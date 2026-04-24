import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-selectfest',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './selectfest.html',
  styleUrls: ['./selectfest.scss']
})
export class Selectfest implements OnInit {
  fests: any[] = [];
  loading: boolean = true;
  error: string = '';
  action: string = '';
  institutionId: number = 0;
  loginId: number = 0;
  router: Router;

  constructor(
    private http: HttpClient,
    router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.router = router;
  }

  ngOnInit() {
    // Get action from query parameters
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'] || 'viewcompetitions';
    });

    // Get loginId from auth service
    const user = this.authService.getCurrentUser();
    if (user && user.loginId) {
      this.loginId = user.loginId;
      this.fetchInstitutionDetails();
    } else {
      this.error = 'User not authenticated. Please login again.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  fetchInstitutionDetails() {
    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe({
      next: (response: any) => {
        console.log('Institution details response:', response);
        // Backend returns 'userDetails' not 'data'
        const institutionData = response.userDetails || response.data || null;
        
        if (response.success && institutionData) {
          // Use institution_id (with underscore) as per backend response
          this.institutionId = institutionData.institution_id || institutionData.institutionId || 0;
          
          console.log('Extracted institutionId:', this.institutionId);
          
          if (this.institutionId) {
            this.loadFests();
          } else {
            this.error = 'Could not determine institution ID.';
            this.loading = false;
            this.ngZone.run(() => this.cdr.detectChanges());
          }
        } else {
          console.error('Invalid response structure:', response);
          this.error = 'Invalid response from server.';
          this.loading = false;
          this.ngZone.run(() => this.cdr.detectChanges());
        }
      },
      error: (err: any) => {
        console.error('Error fetching institution details:', err);
        this.error = 'Failed to load institution details.';
        this.loading = false;
        this.ngZone.run(() => this.cdr.detectChanges());
      }
    });
  }

  loadFests() {
    this.loading = true;
    this.ngZone.run(() => {
      this.http
        .get(`/api/fest/institution/${this.institutionId}`)
        .subscribe({
          next: (response: any) => {
            this.fests = response.data || [];
            
            // Load competition count for each festival
            this.fests.forEach((fest: any) => {
              this.loadCompetitionCount(fest);
            });
            
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error loading fests:', err);
            this.error = 'Failed to load fests. Please try again.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
    });
  }

  loadCompetitionCount(fest: any) {
    this.http.get(`/api/competitions/fest/${fest.fest_id}`).subscribe({
      next: (response: any) => {
        fest.competitionCount = (response.data || []).length;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(`Error loading competitions for fest ${fest.fest_id}:`, err);
        fest.competitionCount = 0;
      }
    });
  }

  selectFest(fest: any) {
    if (this.action === 'viewcompetitions') {
      this.router.navigate(['/Institution/viewcompetitions', fest.fest_id]);
    } else if (this.action === 'addresult') {
      this.router.navigate(['/Institution/addresult'], {
        queryParams: { festId: fest.fest_id }
      });
    } else if (this.action === 'viewresult') {
      this.router.navigate(['/Institution/viewresult'], {
        queryParams: { festId: fest.fest_id }
      });
    }
  }

  getFestImagePath(fest: any): string {
    if (fest.fest_image) {
      return `/uploads/${fest.fest_image}`;
    }
    return '/uploads/default_fest.jpg';
  }
}
