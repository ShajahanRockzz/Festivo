import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_image: string;
  brochure: string;
  startdate: string;
  enddate: string;
  fest_description: string;
  fest_for: string;
  institution_id: number;
  category_id: number;
  reg_date: string;
  status: string;
}

@Component({
  selector: 'app-viewfest',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './viewfest.html',
  styleUrl: './viewfest.scss',
})
export class Viewfest implements OnInit {
  fests: Fest[] = [];
  filteredFests: Fest[] = [];
  searchQuery = '';
  sortBy = 'name'; // 'name' or 'startdate'
  sortOrder = 'asc'; // 'asc' or 'desc'
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false;
  isClosingModal = false;
  modalData = { title: '', message: '', type: '' };
  
  // Confirmation Modal states
  showConfirmModal = false;
  isClosingConfirmModal = false;
  festToDelete: number | null = null;

  // Publish Confirmation Modal states
  showPublishConfirmModal = false;
  isClosingPublishConfirmModal = false;
  festToPublish: Fest | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  // Helper method to forcefully close native HTML details dropdowns
  closeAllDropdowns(): void {
    const dropdowns = document.querySelectorAll('details.actions-dropdown');
    dropdowns.forEach((dropdown) => {
      dropdown.removeAttribute('open');
    });
  }

  ngOnInit(): void {
    this.loadFests();
  }

  loadFests(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Ensure UI reflects loading state immediately
    const currentUser = this.authService.getCurrentUser();
    const institutionId = currentUser?.institutionId || null;

    if (!institutionId) {
      this.errorMessage = 'Institution ID not found. Please log in again.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get(`/api/fest/institution/${institutionId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.fests = response.data || [];
          this.filterFests();
        } else {
          this.fests = [];
          this.filteredFests = [];
          this.errorMessage = response.message || 'Error loading fests';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading fests';
        this.fests = [];
        this.filteredFests = [];
        this.cdr.detectChanges();
      }
    );
  }

  viewFest(festId: number): void {
    this.closeAllDropdowns();
    this.router.navigate(['/Institution/festdetails', festId]);
  }

  editFest(festId: number): void {
    this.closeAllDropdowns();
    this.router.navigate(['/Institution/editfest', festId]);
  }

  previewFest(festId: number): void {
    this.closeAllDropdowns();
    this.router.navigate(['/Institution/festpreview', festId]);
  }

publishFest(fest: Fest): void {
    this.closeAllDropdowns();
    this.festToPublish = fest;
    this.showPublishConfirmModal = true;
    this.cdr.detectChanges();
  }

  cancelPublishFest(): void {
    this.isClosingPublishConfirmModal = true;
    setTimeout(() => {
      this.showPublishConfirmModal = false;
      this.isClosingPublishConfirmModal = false;
      this.festToPublish = null;
      this.cdr.detectChanges();
    }, 300); // Wait for transition
  }

  confirmPublishFest(): void {
    if (!this.festToPublish) return;

    const festId = this.festToPublish.fest_id;
    const isCurrentlyActive = this.festToPublish.status === 'active';

    // Check if institution has active subscription only if publishing
    if (!isCurrentlyActive) {
      const currentUser = this.authService.getCurrentUser();
      const institutionId = currentUser?.institutionId;

      if (!institutionId) {
        this.cancelPublishFest();
        this.showModal = true;
        this.modalData = {
          title: 'Error',
          message: 'Institution ID not found. Please log in again.',
          type: 'error'
        };
        return;
      }

      this.http.get(`/api/fest/check-subscription/${institutionId}`).subscribe(
        (response: any) => {
          if (!response.hasSubscription) {
            this.cancelPublishFest();
            this.showModal = true;
            this.modalData = {
              title: 'Subscription Required',
              message: 'You need to purchase a plan to publish festivals. Please buy a plan to continue.',
              type: 'error'
            };
            this.cdr.detectChanges();
            return;
          }

          // Proceed with publishing if subscription is active
          this.performPublishFest(festId, 'active');
        },
        (error) => {
          this.cancelPublishFest();
          this.errorMessage = 'Error checking subscription status';
          this.showModal = true;
          this.modalData = {
            title: 'Error',
            message: this.errorMessage,
            type: 'error'
          };
          this.cdr.detectChanges();
        }
      );
    } else {
      // Direct unpublish
      this.performPublishFest(festId, 'inactive');
    }
  }

  performPublishFest(festId: number, newStatus: string): void {
    const updateData = { status: newStatus };
    this.http.put(`/api/fest/${festId}`, updateData).subscribe(
      (response: any) => {
        this.cancelPublishFest();
        if (response.success) {
          const actionMsg = newStatus === 'active' ? 'published' : 'unpublished';
          this.successMessage = `Fest ${actionMsg} successfully!`;
          this.showModal = true;
          this.modalData = {
            title: 'Success',
            message: `Fest ${actionMsg} successfully!`,
            type: 'success'
          };
          this.searchQuery = '';
          this.loadFests(); // Reload fests list
        } else {
          this.errorMessage = response.message || 'Error updating fest status';
          this.showModal = true;
          this.modalData = {
            title: 'Error',
            message: this.errorMessage,
            type: 'error'
          };
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.cancelPublishFest();
        this.errorMessage = error.error?.message || 'Error updating fest status';
        this.showModal = true;
        this.modalData = {
          title: 'Error',
          message: this.errorMessage,
          type: 'error'
        };
        this.cdr.detectChanges();
      }
    );
  }

  deleteFest(festId: number): void {
    this.closeAllDropdowns();
    this.festToDelete = festId;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (this.festToDelete === null) return;
    
    this.closeConfirmModal(); // Hide the confirm modal with animation

    this.http.delete(`/api/fest/${this.festToDelete}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.festToDelete = null; // Reset
          this.successMessage = 'Fest deleted successfully!';
          this.showModal = true;
          this.modalData = {
            title: 'Success',
            message: 'Fest deleted successfully!',
            type: 'success'
          };
          this.searchQuery = '';
          this.loadFests(); // Reload fests list
        } else {
          this.festToDelete = null; // Reset
          this.errorMessage = response.message || 'Error deleting fest';
          this.showModal = true;
          this.modalData = {
            title: 'Error',
            message: this.errorMessage,
            type: 'error'
          };
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.festToDelete = null; // Reset
        this.errorMessage = error.error?.message || 'Error deleting fest';
        this.showModal = true;
        this.modalData = {
          title: 'Error',
          message: this.errorMessage,
          type: 'error'
        };
        this.cdr.detectChanges();
      }
    );
  }

  closeConfirmModal(): void {
    this.isClosingConfirmModal = true;
    this.cdr.detectChanges(); // Trigger closing animation immediately
    setTimeout(() => {
      this.showConfirmModal = false;
      this.isClosingConfirmModal = false;
      this.festToDelete = null;
      this.cdr.detectChanges();
    }, 300);
  }

  closeModal(): void {
    this.isClosingModal = true;
    this.cdr.detectChanges(); // Trigger closing animation immediately
    setTimeout(() => {
      this.showModal = false;
      this.isClosingModal = false;
      this.cdr.detectChanges();
    }, 300);
  }

  navigateToPlansBuy(): void {
    this.router.navigate(['/Institution/buyplan']);
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

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'badge-active' : 'badge-inactive';
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Published' : 'Draft';
  }

  filterFests(): void {
    let filtered = [...this.fests];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((fest) => {
        return (
          fest.fest_name.toLowerCase().includes(query) ||
          fest.fest_description.toLowerCase().includes(query) ||
          fest.fest_for.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    if (this.sortBy === 'name') {
      filtered.sort((a, b) => {
        const nameA = a.fest_name.toLowerCase();
        const nameB = b.fest_name.toLowerCase();
        const comparison = nameA.localeCompare(nameB);
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (this.sortBy === 'startdate') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.startdate).getTime();
        const dateB = new Date(b.startdate).getTime();
        const comparison = dateA - dateB;
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (this.sortBy === 'status') {
      filtered.sort((a, b) => {
        const statusA = a.status === 'active' ? 1 : 0;
        const statusB = b.status === 'active' ? 1 : 0;
        const comparison = statusA - statusB;
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredFests = filtered;
    this.cdr.detectChanges();
  }

  onSearchChange(): void {
    this.filterFests();
  }

  onSortChange(): void {
    this.filterFests();
  }
}
