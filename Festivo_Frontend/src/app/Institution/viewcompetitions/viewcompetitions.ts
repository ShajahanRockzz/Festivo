import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewcompetitions',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './viewcompetitions.html',
  styleUrl: './viewcompetitions.scss'
})
export class Viewcompetitions implements OnInit {
  festId: number | null = null;
  competitions: any[] = [];
  filteredCompetitions: any[] = [];
  loading = false;
  error = '';
  festName = '';
  router: Router;
  
  // Search and filter
  searchQuery = '';
  filterType = '';
  sortBy = 'name';
  
  // Delete confirmation
  showDeleteConfirm = false;
  competitionToDelete: any = null;

  // Participants modal
  showParticipantsModal = false;
  selectedCompetition: any = null;
  participants: any[] = [];
  participantsLoading = false;
  participantsError = '';
  isGroupCompetition = false;

  // Publish results
  publishingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.festId = params['festId'] ? parseInt(params['festId'], 10) : null;
      
      if (!this.festId) {
        // No festId provided, redirect to selectfest
        this.router.navigate(['/Institution/selectfest'], {
          queryParams: { action: 'viewcompetitions' }
        });
      } else {
        // Load competitions for this fest
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
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading fest name:', err);
      }
    });
  }

  loadCompetitions() {
    if (!this.festId) return;
    
    this.loading = true;
    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe({
      next: (response: any) => {
        const competitions = response.data || [];
        this.competitions = competitions.map((comp: any) => ({
          ...comp,
          comp_id: comp.comp_id || comp.competition_id,
          comp_name: comp.comp_name || comp.competition_name || ''
        }));
        this.applyFiltersAndSearch();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading competitions:', err);
        this.error = 'Failed to load competitions.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFiltersAndSearch() {
    // Start with all competitions
    let filtered = [...this.competitions];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(comp =>
        (comp.comp_name || '').toLowerCase().includes(query) ||
        (comp.description || '').toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.filterType) {
      filtered = filtered.filter(comp => comp.type === this.filterType);
    }

    // Apply sorting
    if (this.sortBy === 'name') {
      filtered.sort((a, b) => (a.comp_name || '').localeCompare(b.comp_name || ''));
    } else if (this.sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.competition_date || '').getTime();
        const dateB = new Date(b.competition_date || '').getTime();
        return dateA - dateB;
      });
    } else if (this.sortBy === 'members') {
      filtered.sort((a, b) => (a.max_members || 0) - (b.max_members || 0));
    }

    this.filteredCompetitions = filtered;
    this.cdr.detectChanges();
  }

  onSearchChange() {
    this.applyFiltersAndSearch();
  }

  onFilterChange() {
    this.applyFiltersAndSearch();
  }

  onSortChange() {
    this.applyFiltersAndSearch();
  }

  editCompetition(comp: any) {
    this.router.navigate(['/Institution/editcompetition'], {
      queryParams: { compId: comp.comp_id, festId: this.festId }
    });
  }

  deleteCompetition(comp: any) {
    this.competitionToDelete = comp;
    this.showDeleteConfirm = true;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  confirmDeleteCompetition() {
    if (!this.competitionToDelete) return;

    const compIdToDelete = this.competitionToDelete.comp_id;
    
    this.http.delete(`/api/competitions/${compIdToDelete}`).subscribe({
      next: (response: any) => {
        // Remove from local array
        this.competitions = this.competitions.filter(
          c => c.comp_id !== compIdToDelete
        );
        this.showDeleteConfirm = false;
        this.competitionToDelete = null;
        document.body.style.overflow = 'auto';
        this.applyFiltersAndSearch();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error deleting competition:', err);
        this.error = 'Failed to delete competition.';
        this.showDeleteConfirm = false;
        document.body.style.overflow = 'auto';
        this.cdr.detectChanges();
      }
    });
  }

  cancelDeleteCompetition() {
    this.showDeleteConfirm = false;
    this.competitionToDelete = null;
    document.body.style.overflow = 'auto';
    this.cdr.detectChanges();
  }

  viewParticipants(comp: any) {
    this.selectedCompetition = comp;
    this.showParticipantsModal = true;
    this.participantsLoading = true;
    this.participants = [];
    this.participantsError = '';
    this.isGroupCompetition = false;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
    
    // Fetch participants for this competition
    this.ngZone.run(() => {
      this.http.get(`/api/competitions/${comp.comp_id}/participants`).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.participants = response.data || [];
            this.isGroupCompetition = response.isGroupCompetition || false;
          } else {
            this.participantsError = response.message || 'Failed to load participants';
          }
          this.participantsLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error loading participants:', err);
          this.participantsError = 'Failed to load participants';
          this.participantsLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  closeParticipantsModal() {
    this.showParticipantsModal = false;
    this.selectedCompetition = null;
    this.participants = [];
    this.participantsError = '';
    document.body.style.overflow = 'auto';
    this.cdr.detectChanges();
  }

  getResultStatusClass(status: string): string {
    if (status === 'published') return 'published';
    if (status === 'pending') return 'pending';
    return 'draft';
  }

  getCompetitionImagePath(comp: any): string {
    if (comp.image) {
      return `/uploads/${comp.image}`;
    }
    return '/uploads/default_competition.jpg';
  }

  publishResults(comp: any) {
    if (comp.res_status === 'published') {
      // Change from published to pending
      this.updateResultStatus(comp, 'pending');
    } else {
      // Change to published
      this.updateResultStatus(comp, 'published');
    }
  }

  editResult(comp: any) {
    this.router.navigate(['/Institution/editresult'], {
      queryParams: { compId: comp.comp_id, festId: this.festId }
    });
  }

  updateResultStatus(comp: any, status: string) {
    this.publishingId = comp.comp_id;
    this.cdr.detectChanges();

    this.http.put(`/api/competitions/${comp.comp_id}/result-status`, { status }).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Update local array
          const compIndex = this.competitions.findIndex(c => c.comp_id === comp.comp_id);
          if (compIndex !== -1) {
            this.competitions[compIndex].res_status = status;
          }
          this.applyFiltersAndSearch();
        }
        this.publishingId = null;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error updating result status:', err);
        this.error = 'Failed to update result status.';
        this.publishingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/Institution/selectfest'], {
      queryParams: { action: 'viewcompetitions' }
    });
  }
}
