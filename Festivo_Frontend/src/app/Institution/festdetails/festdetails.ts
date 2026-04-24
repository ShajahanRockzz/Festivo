import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_image: string;
  fest_description: string;
  startdate: string;
  enddate: string;
  fest_for: string;
  category_id: number;
  status: string;
  result_status: string;
  reg_date: string;
}

interface Competition {
  comp_id: number;
  comp_name: string;
  fest_id: number;
  description: string;
  max_members: number;
  reg_count?: number;
  image?: string;
  type?: string;
}

interface Coordinator {
  coord_id: number;
  coord_name: string;
  coord_email: string;
  coord_phone: string;
  fest_id?: number;
}

@Component({
  selector: 'app-festdetails',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './festdetails.html',
  styleUrl: './festdetails.scss',
})
export class Festdetails implements OnInit {
  festId: number = 0;
  fest: Fest | null = null;
  competitions: Competition[] = [];
  coordinators: Coordinator[] = [];
  
  isLoading = false;
  showAddCoordinatorModal = false;
  showAddCompetitionModal = false;
  showResultModal = false;
  showPublishResultModal = false;
  showDeleteConfirmModal = false;
  competitionToDelete: { id: number; name: string } | null = null;
  
  newCoordinator = {
    coord_name: '',
    coord_email: '',
    coord_phone: ''
  };

  newCompetition = {
    comp_name: '',
    description: '',
    max_members: null as number | null
  };

  resultStatusOptions = ['pending', 'processing', 'published'];
  selectedResultStatus = 'pending';
  
  modalData = { title: '', message: '', type: '' };
  showModal = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.festId = parseInt(params['id'], 10);
      if (this.festId) {
        this.loadFestDetails();
        this.loadCompetitions();
        this.loadCoordinators();
      }
    });
  }

  loadFestDetails(): void {
    this.isLoading = true;
    this.http.get(`/api/fest/${this.festId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.fest = response.data;
          this.selectedResultStatus = this.fest?.result_status || 'pending';
        } else {
          this.showErrorModal('Error', response.message || 'Error loading fest details');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.showErrorModal('Error', error.error?.message || 'Error loading fest details');
        this.cdr.detectChanges();
      }
    );
  }

  loadCompetitions(): void {
    this.http.get(`/api/competitions/fest/${this.festId}`).subscribe(
      (response: any) => {
        console.log('Competitions API response:', response);
        if (response.success) {
          const competitions = response.data || [];
          this.competitions = competitions
            .map((comp: any) => ({
              ...comp,
              comp_id: comp.comp_id || comp.competition_id,
              comp_name: comp.comp_name || comp.competition_name || ''
            }))
            .sort((a: any, b: any) => (b.reg_count || 0) - (a.reg_count || 0));
          console.log(`${this.competitions.length} competitions loaded`);
        } else {
          this.competitions = [];
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.competitions = [];
        console.error('Error loading competitions:', error);
        this.cdr.detectChanges();
      }
    );
  }

  loadCoordinators(): void {
    this.http.get(`/api/fest/${this.festId}/coordinators`).subscribe(
      (response: any) => {
        console.log('Coordinators API response:', response);
        if (response.success) {
          this.coordinators = response.data || [];
          console.log(`${this.coordinators.length} coordinators loaded`);
        } else {
          this.coordinators = [];
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.coordinators = [];
        console.error('Error loading coordinators:', error);
        this.cdr.detectChanges();
      }
    );
  }

  openAddCoordinatorModal(): void {
    this.newCoordinator = {
      coord_name: '',
      coord_email: '',
      coord_phone: ''
    };
    this.showAddCoordinatorModal = true;
    this.cdr.detectChanges();
  }

  closeAddCoordinatorModal(): void {
    this.showAddCoordinatorModal = false;
    this.cdr.detectChanges();
  }

  openAddCompetitionModal(): void {
    this.newCompetition = {
      comp_name: '',
      description: '',
      max_members: null
    };
    this.showAddCompetitionModal = true;
    this.cdr.detectChanges();
  }

  closeAddCompetitionModal(): void {
    this.showAddCompetitionModal = false;
    this.cdr.detectChanges();
  }

  validateCoordinator(): boolean {
    if (!this.newCoordinator.coord_name.trim()) {
      this.showErrorModal('Validation Error', 'Coordinator name is required');
      return false;
    }
    if (!this.newCoordinator.coord_email.trim()) {
      this.showErrorModal('Validation Error', 'Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newCoordinator.coord_email)) {
      this.showErrorModal('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!this.newCoordinator.coord_phone.trim()) {
      this.showErrorModal('Validation Error', 'Phone number is required');
      return false;
    }
    if (!/^[0-9]{10}$/.test(this.newCoordinator.coord_phone)) {
      this.showErrorModal('Validation Error', 'Phone number must be 10 digits');
      return false;
    }
    return true;
  }

  validateCompetition(): boolean {
    if (!this.newCompetition.comp_name.trim()) {
      this.showErrorModal('Validation Error', 'Competition name is required');
      return false;
    }
    if (this.newCompetition.comp_name.trim().length < 3) {
      this.showErrorModal('Validation Error', 'Competition name must be at least 3 characters');
      return false;
    }
    if (!this.newCompetition.description.trim()) {
      this.showErrorModal('Validation Error', 'Description is required');
      return false;
    }
    if (this.newCompetition.description.trim().length < 10) {
      this.showErrorModal('Validation Error', 'Description must be at least 10 characters');
      return false;
    }
    if (!this.newCompetition.max_members || this.newCompetition.max_members <= 0) {
      this.showErrorModal('Validation Error', 'Max members must be greater than 0');
      return false;
    }
    return true;
  }

  addCoordinator(): void {
    if (!this.validateCoordinator()) {
      return;
    }

    const coordData = {
      fest_id: this.festId,
      coord_name: this.newCoordinator.coord_name.trim(),
      coord_email: this.newCoordinator.coord_email.trim(),
      coord_phone: this.newCoordinator.coord_phone.trim()
    };

    this.http.post(`/api/fest/${this.festId}/coordinators`, coordData).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccessModal('Success', 'Coordinator added successfully');
          this.loadCoordinators();
          this.closeAddCoordinatorModal();
        } else {
          this.showErrorModal('Error', response.message || 'Error adding coordinator');
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error adding coordinator');
        this.cdr.detectChanges();
      }
    );
  }

  addCompetition(): void {
    if (!this.validateCompetition()) {
      return;
    }

    const compData = {
      fest_id: this.festId,
      comp_name: this.newCompetition.comp_name.trim(),
      description: this.newCompetition.description.trim(),
      max_members: this.newCompetition.max_members
    };

    this.http.post(`/api/competitions`, compData).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccessModal('Success', 'Competition added successfully');
          this.loadCompetitions();
          this.closeAddCompetitionModal();
        } else {
          this.showErrorModal('Error', response.message || 'Error adding competition');
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error adding competition');
        this.cdr.detectChanges();
      }
    );
  }

  deleteCoordinator(coordId: number): void {
    if (!confirm('Are you sure you want to remove this coordinator?')) {
      return;
    }

    this.http.delete(`/api/coordinators/${coordId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccessModal('Success', 'Coordinator removed successfully');
          this.loadCoordinators();
        } else {
          this.showErrorModal('Error', response.message || 'Error removing coordinator');
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error removing coordinator');
        this.cdr.detectChanges();
      }
    );
  }

  deleteCompetition(compId: number, compName: string): void {
    this.competitionToDelete = { id: compId, name: compName };
    this.showDeleteConfirmModal = true;
    this.cdr.detectChanges();
  }

  confirmDeleteCompetition(): void {
    if (!this.competitionToDelete) return;

    this.showDeleteConfirmModal = false;
    const compId = this.competitionToDelete.id;

    this.http.delete(`/api/competitions/${compId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccessModal('Success', 'Competition deleted successfully');
          this.loadCompetitions();
        } else {
          this.showErrorModal('Error', response.message || 'Error deleting competition');
        }
        this.competitionToDelete = null;
        this.cdr.detectChanges();
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error deleting competition');
        this.competitionToDelete = null;
        this.cdr.detectChanges();
      }
    );
  }

  cancelDeleteCompetition(): void {
    this.showDeleteConfirmModal = false;
    this.competitionToDelete = null;
    this.cdr.detectChanges();
  }

  openResultModal(): void {
    this.showResultModal = true;
    this.cdr.detectChanges();
  }

  closeResultModal(): void {
    this.showResultModal = false;
    this.cdr.detectChanges();
  }

  openPublishResultModal(): void {
    this.showPublishResultModal = true;
    this.cdr.detectChanges();
  }

  closePublishResultModal(): void {
    this.showPublishResultModal = false;
    this.cdr.detectChanges();
  }

  updateResultStatus(): void {
    const updateData = { result_status: this.selectedResultStatus };
    
    this.http.put(`/api/fest/${this.festId}/result-status`, updateData).subscribe(
      (response: any) => {
        if (response.success) {
          if (this.fest) {
            this.fest.result_status = this.selectedResultStatus;
          }
          this.showSuccessModal('Success', 'Result status updated successfully');
          this.closeResultModal();
          this.cdr.detectChanges();
        } else {
          this.showErrorModal('Error', response.message || 'Error updating result status');
        }
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error updating result status');
      }
    );
  }

  publishResult(): void {
    const publishData = { result_status: 'published' };

    this.http.put(`/api/fest/${this.festId}/publish-result`, publishData).subscribe(
      (response: any) => {
        if (response.success) {
          if (this.fest) {
            this.fest.result_status = 'published';
            this.selectedResultStatus = 'published';
          }
          this.showSuccessModal('Success', 'Result published successfully to all students');
          this.closePublishResultModal();
          this.cdr.detectChanges();
        } else {
          this.showErrorModal('Error', response.message || 'Error publishing result');
        }
      },
      (error) => {
        this.showErrorModal('Error', error.error?.message || 'Error publishing result');
      }
    );
  }

  showSuccessModal(title: string, message: string): void {
    this.showModal = true;
    this.modalData = {
      title,
      message,
      type: 'success'
    };
    this.cdr.detectChanges();
  }

  showErrorModal(title: string, message: string): void {
    this.showModal = true;
    this.modalData = {
      title,
      message,
      type: 'error'
    };
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  viewAllCompetitions(): void {
    this.router.navigate(['/Institution/viewcompetitions', this.festId]);
  }

  goBack(): void {
    this.router.navigate(['/Institution/viewfest']);
  }

  getImageUrl(imageName: string): string {
    if (!imageName || imageName.trim() === '') {
      return '/uploads/default_fest.jpg';
    }
    return `/uploads/${imageName}`;
  }

  onImageError(event: any): void {
    // Fallback to default image if the original image fails to load
    event.target.src = '/uploads/default_fest.jpg';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getResultStatusClass(status: string): string {
    if (status === 'published') return 'status-published';
    if (status === 'processing') return 'status-processing';
    return 'status-pending';
  }

  getResultStatusText(status: string): string {
    if (status === 'published') return 'Published';
    if (status === 'processing') return 'Processing';
    return 'Pending';
  }
}
