import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-institutionhome',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './institutionhome.html',
  styleUrl: './institutionhome.scss',
})
export class Institutionhome implements OnInit {
  institutionName = 'Institution';
  institutionData: any = null;
  topFests: any[] = [];
  topCompetitions: any[] = [];
  isLoading = false;

  stats = {
    totalFests: 0,
    totalCompetitions: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const loginId = currentUser.loginId || 0;
      this.fetchInstitutionName(loginId);
    } else {
      this.loadDashboardData();
    }
  }

  fetchInstitutionName(loginId: number): void {
    this.http.get(`/api/login/user-details/${loginId}/Institution`).subscribe(
      (response: any) => {
        const institutionData = response.userDetails || response.data;
        if (response.success && institutionData) {
          this.institutionName = institutionData.institution_name || 'Institution';
          this.institutionData = institutionData;
          this.cdr.detectChanges();
        }
        this.loadDashboardData();
      },
      (error) => {
        console.error('Error fetching institution details:', error);
        this.loadDashboardData();
      }
    );
  }

  loadDashboardData(): void {
    this.isLoading = true;
    let institutionId = null;

    if (this.institutionData && this.institutionData.institution_id) {
      institutionId = this.institutionData.institution_id;
    } else {
      const currentUser = this.authService.getCurrentUser();
      institutionId = currentUser?.institutionId;
    }

    if (!institutionId) {
      this.isLoading = false;
      return;
    }

    // In a real app, this would fetch from an API endpoint
    this.fetchInstitutionStats(institutionId);
  }

  fetchInstitutionStats(institutionId: number): void {
    // Fetch actual data from backend
    this.http.get(`/api/fest/institution/${institutionId}`).subscribe(
      (response: any) => {
        let fests: any[] = [];
        if (response.success) {
          fests = response.data || [];
          this.stats.totalFests = fests.length;
          this.topFests = fests.slice(0, 3);
        }

        // Fetch competitions for this institution
        const fest_ids = fests.map((f: any) => f.fest_id);
        if (fest_ids.length > 0) {
          this.fetchCompetitionsStats(fest_ids);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching institution stats:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  fetchCompetitionsStats(fest_ids: number[]): void {
    // Fetch all competitions for these festivals
    let allCompetitions: any[] = [];
    let completed = 0;

    fest_ids.forEach(fest_id => {
      this.http.get(`/api/competitions/fest/${fest_id}`).subscribe(
        (response: any) => {
          if (response.success && response.data) {
            allCompetitions = allCompetitions.concat(response.data);
          }
          completed++;

          if (completed === fest_ids.length) {
            this.stats.totalCompetitions = allCompetitions.length;
            this.topCompetitions = allCompetitions.slice(0, 3);

            // Fetch registrations and revenue data
            this.fetchRegistrationsAndRevenue(allCompetitions.map((c: any) => c.competition_id || c.comp_id));
          }
        },
        (error) => {
          console.error('Error fetching competitions:', error);
          completed++;

          if (completed === fest_ids.length) {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        }
      );
    });
  }

  fetchRegistrationsAndRevenue(competition_ids: number[]): void {
    // Get registrations count
    if (competition_ids.length > 0) {
      this.http.get(`/api/competitions/registrations/all`).subscribe(
        (response: any) => {
          if (response.success && response.data) {
            // Filter registrations for this institution's competitions
            const institutionRegistrations = response.data.filter((reg: any) => 
              competition_ids.includes(reg.competitionid)
            );
            this.stats.totalRegistrations = institutionRegistrations.length;
          }

          // Fetch revenue data
          this.fetchRevenue();
        },
        (error) => {
          console.error('Error fetching registrations:', error);
          this.fetchRevenue();
        }
      );
    } else {
      this.fetchRevenue();
    }
  }

  fetchRevenue(): void {
    let institutionId = null;

    if (this.institutionData && this.institutionData.institution_id) {
      institutionId = this.institutionData.institution_id;
    } else {
      const currentUser = this.authService.getCurrentUser();
      institutionId = currentUser?.institutionId;
    }

    if (institutionId) {
      this.http.get(`http://localhost:3000/revenue/institution/${institutionId}`).subscribe(
        (response: any) => {
          if (response.success && response.data) {
            this.stats.totalRevenue = response.data.totalRevenue || 0;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching revenue:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      );
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  navigateToCreateFest(): void {
    this.router.navigate(['/Institution/createfest']);
  }
}
