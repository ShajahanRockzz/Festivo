import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_image: string;
  fest_description: string;
  startdate: string;
  enddate: string;
  fest_for: string;
  status: string;
}

interface Competition {
  comp_id: number;
  comp_name: string;
  comp_image: string;
  description: string;
  competition_date: string;
  type: string;
  min_members: number;
  max_members: number;
  reg_fee: number;
}

@Component({
  selector: 'app-coordinator-festpreview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './festpreview.html',
  styleUrl: './festpreview.scss',
})
export class Festpreview implements OnInit {
  fest: Fest | null = null;
  competitions: Competition[] = [];
  assignedCompetitionIds: number[] = [];
  coordinatorId = 0;
  loginId = 0;
  festId = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.festId = parseInt(this.route.snapshot.paramMap.get('festId') || '0', 10);
    if (!this.festId) {
      this.router.navigate(['/coordinatormaster/viewassignedfests']);
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || currentUser.login_id || 0;
    }

    if (!this.loginId) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.loginId = user.loginId || user.login_id || 0;
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }

    if (this.loginId) {
      this.fetchCoordinatorId();
    } else {
      this.loadFest();
    }
  }

  fetchCoordinatorId(): void {
    this.http.get<any>(`/api/coordinators/by-login/${this.loginId}`).subscribe({
      next: (response) => {
        this.coordinatorId = response.coordinator_id || 0;
        this.loadFest();
      },
      error: (err: any) => {
        console.error('Error loading coordinator id:', err);
        this.loadFest();
      }
    });
  }

  loadFest(): void {
    this.isLoading = true;
    this.http.get(`/api/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        this.fest = response.data || response;
        this.loadCompetitions();
      },
      error: (err: any) => {
        console.error('Error loading fest:', err);
        this.errorMessage = 'Failed to load fest preview.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCompetitions(): void {
    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        const competitions = response.data || response || [];
        this.competitions = competitions.map((comp: any) => ({
          comp_id: comp.comp_id || comp.competition_id,
          comp_name: comp.comp_name || comp.competition_name || '',
          comp_image: comp.comp_image || comp.image || '',
          description: comp.description || '',
          competition_date: comp.competition_date || '',
          type: comp.type || 'single',
          min_members: comp.min_members || 1,
          max_members: comp.max_members || 1,
          reg_fee: comp.reg_fee || 0
        }));
        if (this.coordinatorId) {
          this.loadAssignments();
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error loading competitions:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAssignments(): void {
    this.http.get<any[]>(`/api/assignments/coordinator/${this.coordinatorId}`).subscribe({
      next: (assignments) => {
        this.assignedCompetitionIds = (assignments || []).map((item) => item.competition_id);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading assignments:', err);
        this.assignedCompetitionIds = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/coordinatormaster/viewfestcompetitions', this.festId]);
  }

  goToAssignedCompetitions(): void {
    this.router.navigate(['/coordinatormaster/viewfestcompetitions', this.festId]);
  }

  isAssignedCompetition(compId: number): boolean {
    return this.assignedCompetitionIds.includes(compId);
  }

  getImageUrl(imageName: string): string {
    if (!imageName) {
      return '/uploads/default_fest.jpg';
    }
    return `/uploads/${imageName}`;
  }

  getCompetitionImagePath(imageName: string): string {
    if (imageName) {
      return `/uploads/${imageName}`;
    }
    return '/uploads/default_competition.jpg';
  }

  getStatusBadgeClass(): string {
    return this.fest?.status === 'active' ? 'active' : 'inactive';
  }

  getStatusLabel(): string {
    return this.fest?.status === 'active' ? '● Active' : '● Inactive';
  }
}
