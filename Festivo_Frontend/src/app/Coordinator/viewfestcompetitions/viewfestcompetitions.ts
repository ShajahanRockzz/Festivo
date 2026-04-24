import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Competition {
  competition_id: number;
  competition_name: string;
  image: string;
  description: string;
  competition_date: string;
  type: string;
  max_members: number;
  min_members: number;
  reg_fee: number;
  res_status: string;
}

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_image: string;
  startdate: string;
  enddate: string;
}

@Component({
  selector: 'app-viewfestcompetitions',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './viewfestcompetitions.html',
  styleUrl: './viewfestcompetitions.scss',
})
export class Viewfestcompetitions implements OnInit {
  isLoading = true;
  competitions: Competition[] = [];
  fest: Fest | null = null;
  festId: number = 0;
  coordinatorId: number = 0;
  assignedCompetitionIds: number[] = [];
  selectedFilter = 'all';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Try to get coordinator ID from current user
    const currentUser = this.authService.getCurrentUser();
    
    console.log('Current user:', currentUser);
    
    let loginId = 0;
    
    if (currentUser) {
      // The backend returns 'loginId' (camelCase)
      loginId = currentUser.loginId || currentUser.login_id || 0;
    }
    
    // If no login ID found, try to extract from local storage
    if (!loginId) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // The backend returns 'loginId' (camelCase)
          loginId = user.loginId || user.login_id || 0;
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
    
    console.log('Login ID:', loginId);
    
    this.festId = parseInt(this.route.snapshot.paramMap.get('festId') || '0');

    if (this.festId === 0) {
      this.router.navigate(['/coordinatormaster/viewassignedfests']);
      return;
    }

    if (loginId > 0) {
      // Fetch the actual coordinator_id using the login_id
      this.http.get<any>(`http://localhost:3000/api/coordinators/by-login/${loginId}`).subscribe({
        next: (response) => {
          this.coordinatorId = response.coordinator_id || 0;
          console.log('Coordinator ID:', this.coordinatorId);
          this.loadData();
        },
        error: (err) => {
          console.error('Error fetching coordinator ID:', err);
          this.isLoading = false;
          this.errorMessage = 'Failed to load coordinator information';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'User not properly authenticated';
    }
  }

  loadData(): void {
    // Load fest details
    this.http.get<any>('http://localhost:3000/api/fest/' + this.festId)
      .subscribe({
        next: (response) => {
          // Extract fest data from response wrapper
          this.fest = response.data || response;
          this.loadCompetitions();
        },
        error: (error) => {
          console.error('Error loading fest:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadCompetitions(): void {
    // Get all competitions for the fest
    this.http.get<any>('http://localhost:3000/api/competitions/fest/' + this.festId)
      .subscribe({
        next: (response) => {
          const allCompetitions: Competition[] = response?.data || response || [];
          // Get assigned competitions for this coordinator for this fest
          this.http.get<any[]>('http://localhost:3000/api/assignments/coordinator/' + this.coordinatorId)
            .subscribe({
              next: (assignments) => {
                // Filter assignments for this fest and get competition IDs
                this.assignedCompetitionIds = assignments
                  .filter(a => allCompetitions.some(c => c.competition_id === a.competition_id))
                  .map(a => a.competition_id);

                // Filter competitions to show only assigned ones
                this.competitions = allCompetitions.filter(c =>
                  this.assignedCompetitionIds.includes(c.competition_id)
                );

                this.isLoading = false;
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error('Error loading assignments:', error);
                // If no assignments found, show all competitions for this fest
                this.competitions = allCompetitions;
                this.isLoading = false;
                this.cdr.detectChanges();
              }
            });
        },
        error: (error) => {
          console.error('Error loading competitions:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/coordinatormaster/viewassignedfests']);
  }

  viewParticipants(competitionId: number): void {
    this.router.navigate(['/coordinatormaster/festparticipant', competitionId, this.festId]);
  }

  viewFestDetails(): void {
    this.router.navigate(['/coordinatormaster/festpreview', this.festId]);
  }

  viewCompetitionDetails(competitionId: number): void {
    this.router.navigate(['/coordinatormaster/competitiondetails', competitionId, this.festId]);
  }

  getImageUrl(imageName: string): string {
    if (!imageName) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    return 'http://localhost:3000/uploads/' + imageName;
  }

  getCompetitionImageUrl(imageName: string): string {
    if (!imageName || imageName.trim() === '') {
      return 'http://localhost:3000/uploads/default_competition.jpg';
    }
    return 'http://localhost:3000/uploads/' + imageName;
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      default:
        return '#999';
    }
  }
}
