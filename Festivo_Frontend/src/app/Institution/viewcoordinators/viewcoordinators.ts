import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Coordinator {
  coordinator_id: number;
  name: string;
  email: string;
  contact_no: string;
  institution_id: number;
  image: string;
  login_id: number;
  status: string;
}

interface Modal {
  type: 'delete' | 'status' | 'none';
  coordinatorId?: number;
  coordinatorName?: string;
  currentStatus?: string;
  newStatus?: string;
}

@Component({
  selector: 'app-viewcoordinators',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './viewcoordinators.html',
  styleUrl: './viewcoordinators.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Viewcoordinators implements OnInit {
  coordinators: Coordinator[] = [];
  filteredCoordinators: Coordinator[] = [];
  institutionId: number = 0;
  loginId: number = 0;
  
  // Loading and error states
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchQuery = '';
  statusFilter = 'all'; // all, active, inactive
  
  // Modal management
  modal: Modal = { type: 'none' };
  showModal = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0;
    }
  }

  ngOnInit(): void {
    if (this.loginId) {
      this.fetchInstitutionDetails();
    } else {
      this.showError('Unable to identify institution. Please login again.');
    }
  }

  fetchInstitutionDetails(): void {
    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        if (response.success && response.userDetails) {
          this.institutionId = response.userDetails.institution_id || 0;
          if (this.institutionId) {
            this.fetchCoordinators();
          }
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching institution details:', error);
        this.showError('Error loading institution details');
      }
    );
  }

  fetchCoordinators(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http.get(`/api/coordinators/institution/${this.institutionId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.coordinators = response.data || [];
          this.applyFiltersAndSearch();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching coordinators:', error);
        this.showError('Error loading coordinators');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  applyFiltersAndSearch(): void {
    this.filteredCoordinators = this.coordinators.filter(coord => {
      // Apply status filter
      if (this.statusFilter !== 'all' && coord.status !== this.statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        return (
          coord.name.toLowerCase().includes(query) ||
          coord.email.toLowerCase().includes(query) ||
          coord.contact_no.includes(query)
        );
      }
      
      return true;
    });
    this.cdr.detectChanges();
  }

  onSearchChange(): void {
    this.applyFiltersAndSearch();
  }

  onFilterChange(): void {
    this.applyFiltersAndSearch();
  }

  deleteCoordinator(coordinator: Coordinator): void {
    this.modal = {
      type: 'delete',
      coordinatorId: coordinator.coordinator_id,
      coordinatorName: coordinator.name
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.modal.coordinatorId) return;

    this.isLoading = true;
    this.http.delete(`/api/coordinators/${this.modal.coordinatorId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccess('Coordinator deleted successfully');
          this.fetchCoordinators();
          this.closeModal();
        } else {
          this.showError(response.message || 'Error deleting coordinator');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error deleting coordinator:', error);
        this.showError('Error deleting coordinator');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  toggleStatus(coordinator: Coordinator): void {
    const newStatus = coordinator.status === 'active' ? 'inactive' : 'active';
    
    this.modal = {
      type: 'status',
      coordinatorId: coordinator.coordinator_id,
      coordinatorName: coordinator.name,
      currentStatus: coordinator.status,
      newStatus: newStatus
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  confirmStatusChange(): void {
    if (!this.modal.coordinatorId || !this.modal.newStatus) return;

    this.isLoading = true;
    this.http.put(`/api/coordinators/${this.modal.coordinatorId}/status`, { 
      status: this.modal.newStatus 
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccess(`Coordinator ${this.modal.newStatus}`);
          this.fetchCoordinators();
          this.closeModal();
        } else {
          this.showError(response.message || 'Error updating status');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error updating status:', error);
        this.showError('Error updating coordinator status');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  editCoordinator(coordinatorId: number): void {
    this.router.navigate(['/Institution/editcoordinator', coordinatorId]);
  }

  closeModal(): void {
    this.showModal = false;
    this.modal = { type: 'none' };
    this.cdr.detectChanges();
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  getActiveCount(): number {
    return this.coordinators.filter(c => c.status === 'active').length;
  }

  getCoordinatorImage(imageName: string): string {
    if (imageName && imageName.trim()) {
      return `http://localhost:3000/uploads/${imageName}`;
    }
    return `http://localhost:3000/uploads/default_user.avif`;
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'badge-active' : 'badge-inactive';
  }

  goBack(): void {
    this.router.navigate(['/Institution/home']);
  }
}
