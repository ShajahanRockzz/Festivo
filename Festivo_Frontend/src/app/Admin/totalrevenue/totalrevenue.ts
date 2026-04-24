import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

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
        labels: { color: '#333333' }
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
      { data: [], label: 'Revenue by Institution', backgroundColor: '#0ea5e9', borderRadius: 4 }
    ]
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/revenue/admin').subscribe({
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

          // Trigger change detection forcefully so data renders immediately upon fetching
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching revenue', err);
        this.cdr.detectChanges();
      }
    });
  }

  exportToPDF() {
    const data = document.querySelector('.revenue-container') as HTMLElement;
    if (!data) return;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgWidth = 208; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Revenue_Report.pdf');
    });
  }

  exportToExcel() {
    const formattedHistory = this.history.map(item => ({
      Date: new Date(item.payment_date).toLocaleDateString(),
      Type: item.type,
      'Institution/Source': item.institution_name,
      Amount: item.amount
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedHistory);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Transactions': worksheet }, 
      SheetNames: ['Transactions'] 
    };
    
    // Add Summary at the end of the sheet or top
    const summaryData = [
      [],
      ['Summary'],
      ['Total Revenue', this.totalRevenue],
      ['Subscriptions', this.subscriptionRevenue],
      ['Registrations', this.registrationRevenue]
    ];
    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: -1 });

    XLSX.writeFile(workbook, 'Revenue_Transactions.xlsx');
  }
}
