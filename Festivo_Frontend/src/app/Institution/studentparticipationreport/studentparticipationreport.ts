import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-studentparticipationreport',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './studentparticipationreport.html',
  styleUrl: './studentparticipationreport.scss',
})
export class Studentparticipationreport implements OnInit {
  festData: any[] = [];
  competitionData: any[] = [];
  
  // Charts config
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#666666' }, grid: { color: '#e5e7eb' } },
      y: { ticks: { color: '#666666' }, grid: { color: '#e5e7eb' } }
    },
    plugins: { legend: { display: false } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { color: '#333333' } }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = { labels: [], datasets: [] };

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const loginId = currentUser.loginId || 0;
      this.http.get(`http://localhost:3000/api/login/user-details/${loginId}/Institution`).subscribe({
        next: (response: any) => {
          const instData = response.userDetails || response.data;
          if (response.success && instData) {
            this.loadReport(instData.institution_id);
          }
        }
      });
    }
  }

  loadReport(institutionId: number) {
    this.http.get(`http://localhost:3000/api/fest/participation-report/${institutionId}`).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.festData = res.festData;
          this.competitionData = res.competitionData;
          
          this.setupCharts();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching report', err)
    });
  }

  setupCharts() {
    // Top Fests Bar Chart
    const fests = [...this.festData].sort((a, b) => b.participant_count - a.participant_count);
    this.barChartData = {
      labels: fests.map(f => f.fest_name),
      datasets: [{
        data: fests.map(f => f.participant_count),
        backgroundColor: '#4f46e5',
        borderRadius: 4,
        label: 'Students'
      }]
    };

    // Competitions Pie Chart
    const comps = [...this.competitionData].sort((a, b) => b.participant_count - a.participant_count).slice(0, 10);
    this.pieChartData = {
      labels: comps.map(c => c.competition_name),
      datasets: [{
        data: comps.map(c => c.participant_count),
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4'],
        borderWidth: 0
      }]
    };
  }

  exportToPDF() {
    const element = document.querySelector('.report-container') as HTMLElement;
    if (!element) return;
    
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('student_participation_report.pdf');
    });
  }
}

