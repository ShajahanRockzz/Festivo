import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-prizereport',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './prizereport.html',
  styleUrl: './prizereport.scss'
})
export class Prizereport implements OnInit {
  institutionId: any;
  prizes: any[] = [];
  filteredPrizes: any[] = [];
  groupedData: any[] = [];
  
  filterForm: FormGroup;
  fests: string[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { color: '#e5e7eb' } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'right' } }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = { labels: [], datasets: [] };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      selectedFest: ['All']
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const loginId = currentUser.loginId || 0;
      this.http.get(`http://localhost:3000/api/login/user-details/${loginId}/Institution`).subscribe({
        next: (response: any) => {
          const instData = response.userDetails || response.data || response.user;
          if (response.success && instData) {
            this.institutionId = instData.institution_id;
            this.loadPrizes();
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error fetching institution details:', err);
          this.cdr.detectChanges();
        }
      });
    }

    this.filterForm.get('selectedFest')?.valueChanges.subscribe(value => {
      if (value === 'All') {
        this.filteredPrizes = this.prizes;
      } else {
        this.filteredPrizes = this.prizes.filter(p => p.fest_name === value);
      }
      this.processData();
          this.cdr.detectChanges();
        });
  }

  loadPrizes() {
    this.http.get(`http://localhost:3000/api/fest/prize-report/${this.institutionId}`)
      .subscribe((res: any) => {
        if (res.success) {
          this.prizes = res.results;
          this.filteredPrizes = [...this.prizes];
          
          const uniqueFests = new Set(this.prizes.map(p => p.fest_name));
          this.fests = Array.from(uniqueFests) as string[];

          this.processData();
          this.cdr.detectChanges();
        }
      });
  }

  processData() {
    // 1. Generate Table Groupings (Fest -> Competition)
    const festsSet = new Set(this.filteredPrizes.map(p => p.fest_name));
    this.groupedData = Array.from(festsSet).map(festName => {
      const festPrizes = this.filteredPrizes.filter(p => p.fest_name === festName);
      const compsSet = new Set(festPrizes.map(p => p.competition_name));
      const competitions = Array.from(compsSet).map(compName => {
        return {
          competition_name: compName,
          prizes: festPrizes.filter(p => p.competition_name === compName).sort((a,b) => parseInt(a.position) - parseInt(b.position))
        };
      });
      return { fest_name: festName, competitions };
    });

    // 2. Generate Chart Data
    // Pie Chart: Winning Colleges Distribution
    const collegeMap: any = {};
    this.filteredPrizes.forEach(p => {
      const col = p.participant_college || 'Unknown';
      collegeMap[col] = (collegeMap[col] || 0) + 1;
    });
    this.pieChartData = {
      labels: Object.keys(collegeMap),
      datasets: [{
        data: Object.values(collegeMap) as number[],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
      }]
    };

    // Bar Chart: Prizes per fest (if All) OR Prizes per competition (if specific)
    const isAll = this.filterForm.get('selectedFest')?.value === 'All';
    const barMap: any = {};
    this.filteredPrizes.forEach(p => {
      const key = isAll ? p.fest_name : p.competition_name;
      barMap[key] = (barMap[key] || 0) + 1;
    });
    this.barChartData = {
      labels: Object.keys(barMap),
      datasets: [{
        label: isAll ? 'Prizes per Fest' : 'Prizes per Competition',
        data: Object.values(barMap) as number[],
        backgroundColor: '#4361ee',
        borderRadius: 4
      }]
    };
  }

  exportToPDF() {
    const element = document.querySelector('.dashboard-container') as HTMLElement;
    if (element) {
      const exportBtn = element.querySelector('.export-btn') as HTMLElement;
      if (exportBtn) exportBtn.style.display = 'none';

      html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('prize-report.pdf');

        if (exportBtn) exportBtn.style.display = 'flex';
      });
    }
  }
}
