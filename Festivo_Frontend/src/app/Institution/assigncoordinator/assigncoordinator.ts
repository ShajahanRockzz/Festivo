import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Competition {
  comp_id: number;
  comp_name: string;
  description: string;
}

interface Coordinator {
  coordinator_id: number;
  name: string;
  email: string;
}

interface Assignment {
  assgin_id: number;
  competition_id: number;
  coordinator_id: number;
  coordinator_name: string;
}

interface Fest {
  fest_id: number;
  fest_name: string;
}

@Component({
  selector: 'app-assigncoordinator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './assigncoordinator.html',
  styleUrl: './assigncoordinator.scss',
})
export class Assigncoordinator implements OnInit {
  fests: Fest[] = [];
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  coordinators: Coordinator[] = [];
  assignmentsByCompetition: Record<number, Assignment[]> = {};
  selectedCoordinator: Record<number, number | ''> = {};
  isAssigning: Record<number, boolean> = {};
  isRemoving: Record<number, boolean> = {};
  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  pendingAction: {
    type: 'assign' | 'remove';
    competitionId?: number;
    assignId?: number;
  } | null = null;

  festId: number | null = null;
  institutionId = 0;
  loginId = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchQuery = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const festIdParam = params['festId'];
      this.festId = festIdParam ? parseInt(festIdParam, 10) : null;
    });

    if (this.loginId) {
      this.fetchInstitutionDetails();
    } else {
      this.errorMessage = 'Unable to identify institution. Please login again.';
      this.cdr.detectChanges();
    }
  }

  fetchInstitutionDetails(): void {
    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        const institutionData = response.userDetails || response.data || null;
        if (response.success && institutionData) {
          this.institutionId = institutionData.institution_id || institutionData.institutionId || 0;
          if (this.institutionId) {
            this.loadFests();
            this.loadCoordinators();
            if (this.festId) {
              this.loadCompetitionsAndAssignments();
            }
          }
        } else {
          this.errorMessage = 'Invalid response from server.';
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching institution details:', error);
        this.errorMessage = 'Failed to load institution details.';
        this.cdr.detectChanges();
      }
    );
  }

  loadFests(): void {
    this.http.get(`/api/fest/institution/${this.institutionId}`).subscribe(
      (response: any) => {
        this.fests = response.data || [];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading fests:', error);
        this.errorMessage = 'Failed to load festivals.';
        this.cdr.detectChanges();
      }
    );
  }

  loadCoordinators(): void {
    this.http.get(`/api/coordinators/institution/${this.institutionId}`).subscribe(
      (response: any) => {
        this.coordinators = response.data || [];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading coordinators:', error);
        this.errorMessage = 'Failed to load coordinators.';
        this.cdr.detectChanges();
      }
    );
  }

  onFestChange(): void {
    if (this.festId) {
      this.loadCompetitionsAndAssignments();
    } else {
      this.competitions = [];
      this.filteredCompetitions = [];
      this.assignmentsByCompetition = {};
    }
  }

  loadCompetitionsAndAssignments(): void {
    if (!this.festId) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe(
      (response: any) => {
        const competitions = response.data || [];
        this.competitions = competitions.map((comp: any) => ({
          comp_id: comp.comp_id || comp.competition_id,
          comp_name: comp.comp_name || comp.competition_name || '',
          description: comp.description || ''
        }));
        this.applyCompetitionSearch();
        this.loadAssignments();
      },
      (error) => {
        console.error('Error loading competitions:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load competitions.';
        this.cdr.detectChanges();
      }
    );
  }

  loadAssignments(): void {
    if (!this.festId) return;

    this.http.get(`/api/assignments/fest/${this.festId}`).subscribe(
      (response: any) => {
        const assignments = response.data || response || [];
        this.assignmentsByCompetition = assignments.reduce((acc: Record<number, Assignment[]>, item: Assignment) => {
          if (!acc[item.competition_id]) {
            acc[item.competition_id] = [];
          }
          acc[item.competition_id].push(item);
          return acc;
        }, {});
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading assignments:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load assignments.';
        this.cdr.detectChanges();
      }
    );
  }

  onSearchChange(): void {
    this.applyCompetitionSearch();
  }

  applyCompetitionSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredCompetitions = [...this.competitions];
      this.cdr.detectChanges();
      return;
    }

    this.filteredCompetitions = this.competitions.filter((comp) => {
      const name = (comp.comp_name || '').toLowerCase();
      const description = (comp.description || '').toLowerCase();
      return name.includes(query) || description.includes(query);
    });
    this.cdr.detectChanges();
  }

  assignCoordinator(competitionId: number): void {
    const coordinatorId = this.selectedCoordinator[competitionId];
    if (!coordinatorId) {
      this.errorMessage = 'Please select a coordinator to assign.';
      this.successMessage = '';
      this.cdr.detectChanges();
      return;
    }

    this.isAssigning[competitionId] = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.http.post('/api/assignments', {
      competition_id: competitionId,
      coordinator_id: coordinatorId
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Coordinator assigned successfully.';
          this.selectedCoordinator[competitionId] = '';
          this.isAssigning[competitionId] = false;
          const coordinator = this.coordinators.find(
            (item) => item.coordinator_id === coordinatorId
          );
          const newAssignment: Assignment = {
            assgin_id: response.assgin_id || 0,
            competition_id: competitionId,
            coordinator_id: coordinatorId as number,
            coordinator_name: coordinator?.name || 'Coordinator'
          };
          const currentAssignments = this.assignmentsByCompetition[competitionId] || [];
          this.assignmentsByCompetition = {
            ...this.assignmentsByCompetition,
            [competitionId]: [...currentAssignments, newAssignment]
          };
          this.loadAssignments();
        } else {
          this.errorMessage = response.message || 'Failed to assign coordinator.';
          this.isAssigning[competitionId] = false;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error assigning coordinator:', error);
        this.errorMessage = 'Failed to assign coordinator.';
        this.isAssigning[competitionId] = false;
        this.cdr.detectChanges();
      }
    );
  }

  openAssignConfirm(competitionId: number): void {
    const coordinatorId = this.selectedCoordinator[competitionId];
    if (!coordinatorId) {
      this.errorMessage = 'Please select a coordinator to assign.';
      this.successMessage = '';
      this.cdr.detectChanges();
      return;
    }

    const coordinator = this.coordinators.find(
      (item) => item.coordinator_id === coordinatorId
    );
    const competition = this.competitions.find(
      (item) => item.comp_id === competitionId
    );

    this.confirmTitle = 'Assign Coordinator';
    this.confirmMessage = `Assign ${coordinator?.name || 'this coordinator'} to ${competition?.comp_name || 'this competition'}?`;
    this.pendingAction = { type: 'assign', competitionId };
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  openRemoveConfirm(assignId: number, competitionId: number, coordinatorName: string): void {
    this.confirmTitle = 'Remove Assignment';
    this.confirmMessage = `Remove ${coordinatorName} from this competition?`;
    this.pendingAction = { type: 'remove', assignId, competitionId };
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  confirmAction(): void {
    if (!this.pendingAction) return;

    if (this.pendingAction.type === 'assign' && this.pendingAction.competitionId) {
      this.showConfirmModal = false;
      this.assignCoordinator(this.pendingAction.competitionId);
      return;
    }

    if (this.pendingAction.type === 'remove' && this.pendingAction.assignId && this.pendingAction.competitionId) {
      this.showConfirmModal = false;
      this.removeAssignment(this.pendingAction.assignId, this.pendingAction.competitionId);
      return;
    }

    this.showConfirmModal = false;
    this.pendingAction = null;
  }

  cancelAction(): void {
    this.showConfirmModal = false;
    this.pendingAction = null;
  }

  removeAssignment(assignId: number, competitionId: number): void {
    this.isRemoving[assignId] = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.http.delete(`/api/assignments/${assignId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Assignment removed successfully.';
          const remaining = (this.assignmentsByCompetition[competitionId] || []).filter(
            (item) => item.assgin_id !== assignId
          );
          this.assignmentsByCompetition[competitionId] = remaining;
        } else {
          this.errorMessage = response.message || 'Failed to remove assignment.';
        }
        this.isRemoving[assignId] = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error removing assignment:', error);
        this.errorMessage = 'Failed to remove assignment.';
        this.isRemoving[assignId] = false;
        this.cdr.detectChanges();
      }
    );
  }

  getAssignedCount(competitionId: number): number {
    return this.assignmentsByCompetition[competitionId]?.length || 0;
  }

  goBack(): void {
    if (this.festId) {
      this.router.navigate(['/Institution/festdetails', this.festId]);
    } else {
      this.router.navigate(['/Institution/viewfest']);
    }
  }
}
