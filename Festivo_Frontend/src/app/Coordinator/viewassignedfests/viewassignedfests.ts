import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_image: string;
  startdate: string;
  enddate: string;
  fest_description: string;
  status: string;
  category_id: number;
}

interface AssignedFest {
  fest: Fest;
  competitionCount: number;
}

@Component({
  selector: 'app-viewassignedfests',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './viewassignedfests.html',
  styleUrl: './viewassignedfests.scss',
})
export class Viewassignedfests implements OnInit {
  isLoading = true;
  assignedFests: AssignedFest[] = [];
  coordinatorId: number = 0;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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
    
    if (loginId > 0) {
      // Fetch the actual coordinator_id using the login_id
      this.http.get<any>(`http://localhost:3000/api/coordinators/by-login/${loginId}`).subscribe({
        next: (response) => {
          this.coordinatorId = response.coordinator_id || 0;
          console.log('Coordinator ID:', this.coordinatorId);
          this.loadAssignedFests();
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

  loadAssignedFests(): void {
    // Fetch assignments for this coordinator
    this.http.get<any[]>('http://localhost:3000/api/assignments/coordinator/' + this.coordinatorId)
      .subscribe({
        next: (assignments) => {
          if (assignments && assignments.length > 0) {
            // Get unique fest IDs from assignments
            const festIds = [...new Set(assignments.map(a => a.fest_id))];
            
            // Fetch fest details for each fest ID
            this.fetchFestDetails(festIds, assignments);
          } else {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  fetchFestDetails(festIds: number[], assignments: any[]): void {
    const festPromises = festIds.map(id =>
      this.http.get<any>('http://localhost:3000/api/fest/' + id).toPromise()
    );

    Promise.all(festPromises)
      .then((responses) => {
        this.assignedFests = (responses as any[])
          .filter((r): r is any => r !== undefined && r.data !== undefined)
          .map((response: any) => {
            const fest: Fest = response.data;
            return {
              fest: fest,
              competitionCount: assignments.filter(a => a.fest_id === fest.fest_id).length
            };
          });
        this.isLoading = false;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error fetching fest details:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  viewCompetitions(festId: number): void {
    this.router.navigate(['/coordinatormaster/viewfestcompetitions', festId]);
  }

  viewDetails(festId: number): void {
    this.router.navigate(['/coordinatormaster/festpreview', festId]);
  }

  getImageUrl(imageName: string): string {
    if (!imageName) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    return 'http://localhost:3000/uploads/' + imageName;
  }
}
