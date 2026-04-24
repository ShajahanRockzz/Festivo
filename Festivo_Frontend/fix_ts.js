const fs=require('fs'); fs.writeFileSync('src/app/Admin/totalrevenue/totalrevenue.ts', \import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-totalrevenue',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './totalrevenue.html',
  styleUrl: './totalrevenue.scss'
})
export class Totalrevenue implements OnInit {
  totalRevenue: number = 0;
  subscriptionRevenue: number = 0;
  registrationRevenue: number = 0;
  history: any[] = [];
  institutionData: any[] = [];

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#e2e8f0' }
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ 'Subscriptions', 'Registrations' ],
    datasets: [ {
      data: [ 0, 0 ],
      backgroundColor: ['#6366f1', '#10b981'],
      borderWidth: 0
    } ]
  };
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    },
    plugins: {
      legend: { display: false }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Revenue by Institution', backgroundColor: '#0ea5e9', borderRadius: 4 }
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/revenue/admin').subscribe({
      next: (res: any) => {
        if (res.success) {
          const d = res.data;
          this.totalRevenue = d.totalRevenue;
          this.subscriptionRevenue = d.subscriptionRevenue;
          this.registrationRevenue = d.registrationRevenue;
          this.history = d.history;
          
          this.pieChartData = {
            labels: [ 'Subscriptions', 'Registrations' ],
            datasets: [ {
              data: [ this.subscriptionRevenue, this.registrationRevenue ],
              backgroundColor: ['#6366f1', '#10b981'],
              borderWidth: 0
            } ]
          };

          const topInsts = d.institutionData.slice(0, 5);
          this.barChartData = {
            labels: topInsts.map((i: any) => i.name),
            datasets: [
              { data: topInsts.map((i: any) => i.amount), label: 'Revenue', backgroundColor: '#0ea5e9', borderRadius: 4 }
            ]
          };
        }
      },
      error: (err) => {
        console.error('Error fetching revenue', err);
      }
    });
  }
}\);
