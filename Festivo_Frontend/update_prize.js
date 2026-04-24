const fs = require('fs');

const tsCode = `import { Component, OnInit } from '@angular/core';
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
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      selectedFest: ['All']
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const loginId = currentUser.loginId || 0;
      this.http.get(\`http://localhost:3000/api/login/user-details/\${loginId}/Institution\`).subscribe({
        next: (response: any) => {
          const instData = response.userDetails || response.data || response.user;
          if (response.success && instData) {
            this.institutionId = instData.institution_id;
            this.loadPrizes();
          }
        },
        error: (err) => console.error('Error fetching institution details:', err)
      });
    }

    this.filterForm.get('selectedFest')?.valueChanges.subscribe(value => {
      if (value === 'All') {
        this.filteredPrizes = this.prizes;
      } else {
        this.filteredPrizes = this.prizes.filter(p => p.fest_name === value);
      }
      this.processData();
    });
  }

  loadPrizes() {
    this.http.get(\`http://localhost:3000/api/fest/prize-report/\${this.institutionId}\`)
      .subscribe((res: any) => {
        if (res.success) {
          this.prizes = res.results;
          this.filteredPrizes = [...this.prizes];
          
          const uniqueFests = new Set(this.prizes.map(p => p.fest_name));
          this.fests = Array.from(uniqueFests) as string[];

          this.processData();
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
`;

const htmlCode = `<div class="dashboard-container">
  <div class="header">
      <h1>Prize Report</h1>
      <button class="export-btn" (click)="exportToPDF()">
          <i class="bi bi-file-earmark-pdf"></i>
          Export to PDF
      </button>
  </div>

  <!-- Filter Card -->
  <div class="filter-card card" [formGroup]="filterForm">
      <div class="card-header">
          <h2><i class="bi bi-funnel"></i> Filter Prizewinners</h2>
      </div>
      <div class="card-body">
          <div class="form-group">
              <label for="selectedFest">Select Fest</label>
              <select id="selectedFest" formControlName="selectedFest" class="form-control">
                  <option value="All">All Fests</option>
                  <option *ngFor="let fest of fests" [value]="fest">{{ fest }}</option>
              </select>
          </div>
      </div>
  </div>

  <!-- Charts Section -->
  <div class="charts-wrapper" *ngIf="filteredPrizes.length > 0">
      <div class="card chart-card">
          <div class="card-header">
              <h2><i class="bi bi-bar-chart-fill"></i> {{ filterForm.get('selectedFest')?.value === 'All' ? 'Prizes per Fest' : 'Prizes per Competition' }}</h2>
          </div>
          <div class="card-body">
              <div class="chart-container">
                  <canvas baseChart
                      [data]="barChartData"
                      [options]="barChartOptions"
                      [type]="barChartType">
                  </canvas>
              </div>
          </div>
      </div>
      <div class="card chart-card">
          <div class="card-header">
              <h2><i class="bi bi-pie-chart-fill"></i> Top Winning Colleges</h2>
          </div>
          <div class="card-body">
              <div class="chart-container">
                  <canvas baseChart
                      [data]="pieChartData"
                      [options]="pieChartOptions"
                      [type]="pieChartType">
                  </canvas>
              </div>
          </div>
      </div>
  </div>

  <!-- Prizes Table by Fest and Competition -->
  <div class="card history-table-container fest-group-card" *ngFor="let fest of groupedData">
      <div class="card-header bg-fest">
          <h2 class="text-white m-0 d-flex align-items-center gap-2"><i class="bi bi-calendar2-star"></i> Fest: {{ fest.fest_name }}</h2>
      </div>
      
      <div class="card-body p-0">
          <div *ngFor="let comp of fest.competitions" class="competition-section">
              <div class="competition-header">
                  <h3><i class="bi bi-trophy"></i> {{ comp.competition_name }}</h3>
              </div>
              <div class="table-responsive">
                  <table class="table table-hover mb-0">
                      <thead class="table-light">
                          <tr>
                              <th style="width: 20%;">Position</th>
                              <th>Participant Name</th>
                              <th>Participant College</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr *ngFor="let prize of comp.prizes">
                              <td>
                                  <span class="position-badge position-{{prize.position}}">
                                      {{ prize.position == '1' ? '1st' : prize.position == '2' ? '2nd' : prize.position == '3' ? '3rd' : prize.position + 'th' }}
                                  </span>
                              </td>
                              <td class="fw-bold text-dark">{{ prize.participantname }}</td>
                              <td>{{ prize.participant_college }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  </div>

  <!-- Empty State -->
  <div *ngIf="filteredPrizes.length === 0" class="card history-table-container">
      <div class="card-body text-center text-muted py-5 empty-state">
          <i class="bi bi-inbox fs-1 d-block mb-3"></i>
          <h4>No prize data found</h4>
          <p>Try selecting a different fest or ensure results are published.</p>
      </div>
  </div>
</div>
`;

const scssCode = `.dashboard-container {
padding: 24px;
background-color: var(--color-background, #f8f9fa);
min-height: 100vh;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

// Common variables
--primary-color: #4361ee;
--secondary-color: #6c757d;
--success-color: #198754;
--info-color: #0dcaf0;
--warning-color: #ffc107;
--danger-color: #dc3545;
--light-color: #f8f9fa;
--dark-color: #212529;

--card-bg: #ffffff;
--card-border-radius: 12px;
--card-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 { font-size: 28px; font-weight: 700; color: var(--dark-color); margin: 0; }

  .export-btn {
    background-color: var(--danger-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
    &:hover { background-color: darken(#dc3545, 10%); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4); }
  }
}

.card {
  background-color: var(--card-bg); border-radius: var(--card-border-radius); box-shadow: var(--card-box-shadow); border: none; margin-bottom: 24px; overflow: hidden;
  .card-header {
    background-color: rgba(0,0,0,0.02); border-bottom: 1px solid rgba(0,0,0,0.05); padding: 16px 20px;
    h2 { font-size: 18px; font-weight: 600; color: var(--dark-color); margin: 0; display: flex; align-items: center; gap: 8px; i { color: var(--primary-color); } }
  }
  .card-body { padding: 20px; &.p-0 { padding: 0; } }
}

.charts-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  height: 100%;
  .chart-container {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}

.filter-card .form-group {
  margin-bottom: 0;
  label { font-weight: 500; margin-bottom: 8px; color: var(--secondary-color); display: block; }
  .form-control { max-width: 300px; border-radius: 8px; padding: 10px 15px; border: 1px solid #ced4da; appearance: none; background-color: #fff;
    &:focus { border-color: var(--primary-color); box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25); }
  }
}

.fest-group-card {
  .bg-fest {
    background: linear-gradient(135deg, var(--primary-color), #2a41b5);
    padding: 16px 20px;
    h2 { color: white !important; font-size: 20px; i { color: #fff; opacity: 0.8;} }
  }
}

.competition-section {
  border-bottom: 3px solid #f8f9fa;
  &:last-child { border-bottom: none; }

  .competition-header {
    background-color: #f8f9fa;
    padding: 12px 20px;
    border-bottom: 1px solid #e9ecef;
    h3 { margin: 0; font-size: 16px; font-weight: 600; color: var(--dark-color); display: flex; align-items: center; gap: 8px;
         i { color: #f59e0b; }
    }
  }

  .table-responsive { overflow-x: auto; }
  .table {
    margin-bottom: 0; width: 100%; color: #111827;
    th, td { padding: 14px 20px; vertical-align: middle; border-bottom: 1px solid #e9ecef; color: #111827; }
    th { font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; color: #495057; background-color: #ffffff; border-bottom-width: 2px; }
    tbody tr:hover { background-color: rgba(67, 97, 238, 0.03); }
  }
}

.empty-state {
  i { color: #adb5bd; }
  h4 { color: #495057; font-weight: 600; margin-bottom: 8px; }
  p { margin: 0; font-size: 14px; }
}

.position-badge {
  display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; text-align: center; min-width: 60px;
  &.position-1 { background: linear-gradient(135deg, #FFD700 0%, #FDB931 100%); color: #8C6200; box-shadow: 0 2px 5px rgba(253, 185, 49, 0.4); border: 1px solid #E6B800; }
  &.position-2 { background: linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%); color: #424242; box-shadow: 0 2px 5px rgba(189, 189, 189, 0.4); border: 1px solid #9E9E9E; }
  &.position-3 { background: linear-gradient(135deg, #CD7F32 0%, #b86e24 100%); color: #5D3A1A; box-shadow: 0 2px 5px rgba(205, 127, 50, 0.4); border: 1px solid #A66422; }
}
}
`;

fs.writeFileSync('src/app/Institution/prizereport/prizereport.ts', tsCode);
fs.writeFileSync('src/app/Institution/prizereport/prizereport.html', htmlCode);
fs.writeFileSync('src/app/Institution/prizereport/prizereport.scss', scssCode);
console.log('Update completed!');