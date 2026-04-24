import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-competitionsdetails',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './competitionsdetails.html',
  styleUrl: './competitionsdetails.scss',
})
export class Competitionsdetails implements OnInit {
  competitionId: string | null = null;
  competitionDetails: any = null;
  participants: any[] = [];
  
  isLoading: boolean = false;
  isLoadingParticipants: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.competitionId = params.get('id');
      if (this.competitionId) {
        this.fetchCompetitionDetails();
        this.fetchParticipants();
      }
    });
  }

  fetchCompetitionDetails(): void {
    this.isLoading = true;
    this.http.get(`http://localhost:3000/api/competitions/${this.competitionId}`)
      .subscribe({
        next: (res: any) => {
          this.competitionDetails = Array.isArray(res.data) ? res.data[0] : res.data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching competition details', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  fetchParticipants(): void {
    this.isLoadingParticipants = true;
    this.http.get(`http://localhost:3000/api/competitions/${this.competitionId}/participants`)
      .subscribe({
        next: (res: any) => {
          this.participants = res.data || [];
          this.isLoadingParticipants = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching participants', err);
          this.isLoadingParticipants = false;
          this.cdr.detectChanges();
        }
      });
  }

  goBack(): void {
    window.history.back();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
