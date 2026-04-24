import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-editresult',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './editresult.html',
  styleUrl: './editresult.scss',
})
export class Editresult implements OnInit {
  compId: number = 0;
  festId: number = 0;
  competitionName: string = '';
  participants: any[] = [];
  loading: boolean = true;
  saving: boolean = false;
  error: string = '';
  successMessage: string = '';
  showModal: boolean = false;
  modalData: any = { title: '', message: '', type: '' };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.compId = params['compId'] ? parseInt(params['compId'], 10) : 0;
      this.festId = params['festId'] ? parseInt(params['festId'], 10) : 0;

      if (!this.compId || !this.festId) {
        this.error = 'Invalid competition or festival ID';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.loadCompetitionData();
    });
  }

  loadCompetitionData(): void {
    this.loading = true;
    this.ngZone.run(() => {
      // First get competition details
      this.http.get(`/api/competitions/${this.compId}`).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.competitionName = response.data.competition_name;
          }
          // Then load participants with their results
          this.loadParticipantsWithResults();
        },
        error: (err: any) => {
          this.error = 'Failed to load competition details';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  loadParticipantsWithResults(): void {
    this.http.get(`/api/competitions/${this.compId}/participants-with-results`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.participants = response.data || [];
        } else {
          this.error = response.message || 'Failed to load participants';
        }
        this.loading = false;
        this.ngZone.run(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        this.error = 'Failed to load participants';
        this.loading = false;
        this.ngZone.run(() => this.cdr.detectChanges());
      }
    });
  }

  saveResults(): void {
    if (!this.validatePositions()) {
      return;
    }

    this.saving = true;
    const results = this.participants
      .filter((p) => p.position) // Only include participants with positions
      .map((p) => ({
        competition_id: this.compId,
        competition_reg_id: p.competition_reg_id,
        position: p.position
      }));

    this.http.post(`/api/competitions/save-results`, { results }).subscribe({
      next: (response: any) => {
        this.saving = false;
        if (response.success) {
          this.showModal = true;
          this.modalData = {
            title: 'Success',
            message: 'Results saved successfully!',
            type: 'success'
          };
          setTimeout(() => {
            this.router.navigate(['/Institution/viewcompetitions'], {
              queryParams: { festId: this.festId }
            });
          }, 2000);
        } else {
          this.error = response.message || 'Failed to save results';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.saving = false;
        this.error = 'Failed to save results: ' + (err.error?.message || err.message);
        this.cdr.detectChanges();
      }
    });
  }

  validatePositions(): boolean {
    const positions = this.participants
      .filter((p) => p.position)
      .map((p) => parseInt(p.position, 10));

    // Check for duplicate positions
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
      this.error = 'Duplicate positions found. Each position must be unique.';
      this.cdr.detectChanges();
      return false;
    }

    this.error = '';
    return true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  goBack(): void {
    this.router.navigate(['/Institution/viewcompetitions'], {
      queryParams: { festId: this.festId }
    });
  }
}
