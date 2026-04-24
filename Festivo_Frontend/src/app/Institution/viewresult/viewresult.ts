import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewresult',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './viewresult.html',
  styleUrl: './viewresult.scss',
})
export class Viewresult implements OnInit {
  festId: number | null = null;
  festName = '';
  competitions: any[] = [];
  results: any[] = [];
  selectedCompetition: any = null;
  loading = false;
  error = '';
  searchQuery = '';
  statusFilter = 'all';

  get filteredCompetitions() {
    return this.competitions.filter(comp => {
      const matchesSearch = comp.competition_name?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || comp.res_status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.festId = params['festId'] ? parseInt(params['festId'], 10) : null;
      
      if (!this.festId) {
        this.router.navigate(['/Institution/selectfest'], {
          queryParams: { action: 'viewresult' }
        });
      } else {
        this.loadCompetitions();
        this.loadFestName();
      }
    });
  }

  loadFestName() {
    if (!this.festId) return;
    this.http.get(`/api/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        this.festName = response.data?.fest_name || 'Festival';
        this.ngZone.run(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        console.error('Error loading fest name:', err);
      }
    });
  }

  loadCompetitions() {
    if (!this.festId) return;
    
    this.loading = true;
    this.error = '';
    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        this.competitions = response.data || [];
        this.loading = false;
        this.ngZone.run(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        console.error('Error loading competitions:', err);
        this.error = 'Failed to load competitions.';
        this.loading = false;
        this.ngZone.run(() => this.cdr.detectChanges());
      }
    });
  }

  onCompetitionSelected(event: any) {
    const compId = parseInt(event.target.value, 10);
    if (compId) {
      this.selectedCompetition = this.competitions.find(c => c.competition_id === compId) || null;
      if (this.selectedCompetition) {
        this.loadResults(compId);
      }
    }
  }

  loadResults(compId: number) {
    this.http.get(`/api/competitions/${compId}/participants-with-results`).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          // Filter to only those who have a position assigned, and sort them 1, 2, 3
          const scoredResults = response.data.filter((r: any) => r.position && parseInt(r.position) >= 1 && parseInt(r.position) <= 3);
          
          this.results = scoredResults.sort((a: any, b: any) => parseInt(a.position) - parseInt(b.position));
        } else {
          this.results = [];
        }
        this.ngZone.run(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        console.error('Error loading results:', err);
        this.results = [];
        this.ngZone.run(() => this.cdr.detectChanges());
      }
    });
  }

  goBack() {
    this.router.navigate(['/Institution/selectfest'], {
      queryParams: { action: 'viewresult' }
    });
  }
}

