import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-festpreview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './festpreview.html',
  styleUrl: './festpreview.scss',
})
export class Festpreview implements OnInit {
  festId: number = 0;
  festData: any = null;
  institutionData: any = null;
  categoryData: any = null;
  competitions: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.festId = id ? parseInt(id, 10) : 0;

      if (!this.festId) {
        this.error = 'Invalid festival ID';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.loadFestivalDetails();
    });
  }

  loadFestivalDetails(): void {
    this.ngZone.run(() => {
      this.http.get(`/api/fest/${this.festId}`).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.festData = response.data;
            // Load institution details
            if (this.festData.institution_id) {
              this.loadInstitutionDetails(this.festData.institution_id);
            }
            // Load competitions
            this.loadCompetitions();
          } else {
            this.error = 'Failed to load festival details';
            this.loading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          console.error('Error loading festival:', err);
          this.error = 'Failed to load festival details';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  loadInstitutionDetails(institutionId: number): void {
    this.http.get(`/api/institution/${institutionId}`).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.institutionData = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error loading institution:', err);
      }
    });
  }

  loadCompetitions(): void {
    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.competitions = response.data || [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading competitions:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFestImagePath(): string {
    if (this.festData?.fest_image) {
      return `/uploads/${this.festData.fest_image}`;
    }
    return '/uploads/default_fest.jpg';
  }

  getInstitutionImagePath(): string {
    if (this.institutionData?.institution_image) {
      return `/uploads/${this.institutionData.institution_image}`;
    }
    return `/uploads/default_user.avif`;
  }

  onInstitutionImageError(event: any): void {
    event.target.src = '/uploads/default_user.avif';
  }

  getCompetitionImagePath(imageName: string): string {
    if (imageName) {
      return `/uploads/${imageName}`;
    }
    return '/uploads/default_competition.jpg';
  }

  getStatusBadgeClass(): string {
    return this.festData?.status === 'active' ? 'active' : 'inactive';
  }

  getStatusLabel(): string {
    return this.festData?.status === 'active' ? '● Active' : '● Inactive';
  }

  downloadBrochure(): void {
    if (this.festData?.brochure) {
      const brochureUrl = `/public/uploads/${this.festData.brochure}`;
      const link = document.createElement('a');
      link.href = brochureUrl;
      link.download = this.festData.brochure;
      link.click();
    }
  }

  goBack(): void {
    this.router.navigate(['/Institution/viewfest']);
  }
}

// Trigger rebuild
