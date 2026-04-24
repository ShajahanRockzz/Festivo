import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Competition {
  competition_id: number;
  competition_name: string;
  image: string;
  description: string;
  competition_date: string;
  type: string;
  max_members: number;
  min_members: number;
  grouplimit: number;
  fest_id: number;
  reg_fee: number;
  reg_date: string;
  res_status: string;
}

interface RegistrationDetail {
  competitionregid: number;
  competitionid: number;
  chessno: number;
  attendance: string;
  regdate: string;
  participantid: number;
  participantname?: string;
  participantemail?: string;
  contact_no?: string;
  groupMembers?: Array<{
    participantname: string;
    email: string;
    contact_no: string;
    collegeidproof: string;
    institution_name?: string;
  }>;
}

@Component({
  selector: 'app-competitiondetails',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './competitiondetails.html',
  styleUrl: './competitiondetails.scss',
})
export class Competitiondetails implements OnInit {
  competition: Competition | null = null;
  festName = '';
  registrations: RegistrationDetail[] = [];
  isGroupCompetition = false;
  registrationsLoading = false;
  registrationsError = '';
  competitionId = 0;
  festId = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.competitionId = parseInt(this.route.snapshot.paramMap.get('competitionId') || '0', 10);
    this.festId = parseInt(this.route.snapshot.paramMap.get('festId') || '0', 10);

    if (!this.competitionId) {
      this.router.navigate(['/coordinatormaster/viewassignedfests']);
      return;
    }

    this.loadCompetition();
    this.loadRegistrations();
    this.loadFestName();
  }

  loadCompetition(): void {
    this.isLoading = true;
    this.http.get(`/api/competitions/${this.competitionId}`).subscribe({
      next: (response: any) => {
        this.competition = response.data || response;
        if (!this.festId && this.competition?.fest_id) {
          this.festId = this.competition.fest_id;
          this.loadFestName();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading competition:', err);
        this.errorMessage = 'Failed to load competition details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFestName(): void {
    if (!this.festId) {
      return;
    }
    this.http.get(`/api/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        const fest = response.data || response;
        this.festName = fest?.fest_name || '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading fest name:', err);
      }
    });
  }

  loadRegistrations(): void {
    this.registrationsLoading = true;
    this.registrationsError = '';
    this.http.get(`/api/competitions/${this.competitionId}/participants`).subscribe({
      next: (response: any) => {
        this.registrations = response.data || response || [];
        this.isGroupCompetition = !!response.isGroupCompetition;
        this.registrationsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading registrations:', err);
        this.registrationsError = 'Failed to load registrations.';
        this.registrationsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    if (this.festId) {
      this.router.navigate(['/coordinatormaster/viewfestcompetitions', this.festId]);
      return;
    }
    this.router.navigate(['/coordinatormaster/viewassignedfests']);
  }

  getImageUrl(imageName: string): string {
    if (!imageName) {
      return '/uploads/default_competition.jpg';
    }
    return `/uploads/${imageName}`;
  }
}
