import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-adminrevenue',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './adminrevenue.html',
  styleUrl: './adminrevenue.scss'
})
export class Adminrevenue implements OnInit {
  subscriptionRevenue: number = 0;
  history: any[] = [];

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#333333' }
      }
    }
  };
  
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: [],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      borderWidth: 0
    } ]
  };
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#666666' }, grid: { color: '#e5e7eb' } },
      y: { ticks: { color: '#666666' }, grid: { color: '#e5e7eb' } }
    },
    plugins: {
      legend: { display: false }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Subscription Revenue', backgroundColor: '#4f46e5', borderRadius: 4 }
    ]
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/revenue/admin').subscribe({
      next: (res: any) => {
        if (res.success) {
          const d = res.data;
          
          this.subscriptionRevenue = d.subscriptionRevenue;
          // Admin only sees subscription payments
          this.history = d.history.filter((item: any) => item.type === 'subscription');

          // Calculate purely subscription-based institution metrics
          const subByInst: any = {};
          this.history.forEach((item: any) => {
            const amt = Number(item.amount) || 0;
            const name = item.institution_name || 'Unknown';
            if(!subByInst[name]) subByInst[name] = 0;
            subByInst[name] += amt;
          });

          const instData = Object.keys(subByInst).map(k => ({
            name: k,
            amount: subByInst[k]
          })).sort((a,b) => b.amount - a.amount);

          const topInsts = instData.slice(0, 5);

          this.pieChartData = {
            labels: topInsts.map((i: any) => i.name),
            datasets: [ {
              data: topInsts.map((i: any) => i.amount),
              backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
              borderWidth: 0
            } ]
          };

          this.barChartData = {
            labels: topInsts.map((i: any) => i.name),
            datasets: [
              { data: topInsts.map((i: any) => i.amount), label: 'Subscription Revenue', backgroundColor: '#4f46e5', borderRadius: 4 }
            ]
          };

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching admin revenue', err);
        this.cdr.detectChanges();
      }
    });
  }

  exportToPDF() {
    const data = document.querySelector('.revenue-container') as HTMLElement;
    if (!data) return;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Admin_Revenue_Report.pdf');
    });
  }

  exportToExcel() {
    const formattedHistory = this.history.map(item => ({
      Date: new Date(item.payment_date).toLocaleDateString(),
      'Institution/Source': item.institution_name,
      Amount: item.amount
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedHistory);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Admin Revenues': worksheet }, 
      SheetNames: ['Admin Revenues'] 
    };
    
    const summaryData = [
      [],
      ['Summary'],
      ['Total Admin Revenue', this.subscriptionRevenue]
    ];
    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: -1 });

    XLSX.writeFile(workbook, 'Admin_Revenue_Transactions.xlsx');
  }
}
