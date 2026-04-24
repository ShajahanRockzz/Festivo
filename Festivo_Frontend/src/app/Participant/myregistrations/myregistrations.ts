import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-myregistrations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './myregistrations.html',
  styleUrl: './myregistrations.scss',
})
export class Myregistrations implements OnInit {
  registrations: any[] = [];
  isLoading = true;
  errorMessage = '';

  searchTerm: string = '';
  filterStatus: string = 'all'; // all, pending, present, absent
  
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  get filteredRegistrations() {
    return this.registrations.filter((reg) => {
      const matchSearch = (reg.competition_name?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) || 
                          (reg.fest_name?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
                          (reg.institution_name?.toLowerCase() || '').includes(this.searchTerm.toLowerCase());
      
      let matchFilter = true;
      if (this.filterStatus !== 'all') {
        const attendance = this.getAttendanceDisplay(reg);
        matchFilter = attendance.toLowerCase() === this.filterStatus.toLowerCase();
      }

      return matchSearch && matchFilter;
    });
  }

  loadRegistrations() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const participantId = currentUser.participantid;

    if (!participantId) {
        this.errorMessage = 'You need to be logged in to view your registrations.';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
    }

    this.http.get(`http://localhost:3000/api/participants/my-registrations/${participantId}`).subscribe({
        next: (res: any) => {
            if (res.success) {
                this.registrations = res.data;
            } else {
                this.errorMessage = res.message || 'Failed to load registrations';
            }
            this.isLoading = false;
            this.cdr.detectChanges();
        },
        error: (err) => {
            console.error('Fetch error', err);
            this.errorMessage = 'An error occurred while linking to the server.';
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    });
  }

  isCompetitionEnded(dateStr: string): boolean {
    if (!dateStr) return false;
    const compDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    compDate.setHours(0, 0, 0, 0);
    return compDate < today;
  }

  getAttendanceDisplay(reg: any): string {
    const isEnded = this.isCompetitionEnded(reg.competition_date);
    let att = (reg.attendance || 'pending').toLowerCase();
    
    // Don't show absent if competition date hasn't passed
    if (att === 'absent' && !isEnded) {
      return 'pending';
    }
    return att;
  }

  getFestImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    // Check if path is already full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Prefix with backend URL
    return `http://localhost:3000/uploads/${imagePath}`;
  }
}
