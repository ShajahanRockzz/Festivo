import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrationdetails',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registrationdetails.html',
  styleUrls: ['./registrationdetails.scss']
})
export class Registrationdetails implements OnInit {
  registrationId: string = '';
  registration: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.registrationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.registrationId) {
      this.fetchRegistrationDetails();
    } else {
      this.error = 'No registration ID provided';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  fetchRegistrationDetails() {
    this.http.get<any>(`http://localhost:3000/api/participants/registration/${this.registrationId}`)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.registration = response.data;
          } else {
            this.error = 'Failed to load details: ' + (response.message || 'Unknown reason');
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error loading details.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getAttendanceDisplay(compDateStr: string, attendanceStatus: string): { text: string; cssClass: string } {
    if (!compDateStr) return { text: 'Pending', cssClass: 'status-pending' };
    
    const compDate = new Date(compDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (compDate >= today) {
      return { text: 'Pending', cssClass: 'status-pending' };
    }

    if (attendanceStatus === 'Present') {
      return { text: 'Present', cssClass: 'status-present' };
    } else {
      return { text: 'Absent', cssClass: 'status-absent' };
    }
  }
}
