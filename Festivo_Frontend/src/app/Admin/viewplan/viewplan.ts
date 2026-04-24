import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Plan {
  plan_id: number;
  plan_name: string;
  days: number;
  amount: string;
  description: string;
}

@Component({
  selector: 'app-viewplan',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './viewplan.html',
  styleUrl: './viewplan.scss',
})
export class Viewplan implements OnInit {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  isLoading = false;
  searchQuery = '';
  errorMessage = '';
  successMessage = '';
  showMessageModal = false;
  showDeleteModal = false;
  planToDelete: Plan | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.get<any>('/api/subscription/all').subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response && response.success && response.data) {
          this.plans = response.data;
          this.filteredPlans = [...this.plans];
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Error loading plans';
        this.showModal();
        this.cdr.detectChanges();
      }
    );
  }

  filterPlans(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredPlans = [...this.plans];
    } else {
      this.filteredPlans = this.plans.filter(
        plan =>
          plan.plan_name.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query) ||
          plan.days.toString().includes(query) ||
          plan.amount.toLowerCase().includes(query)
      );
    }
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterPlans();
  }

  showModal(): void {
    this.showMessageModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showMessageModal = false;
    if (this.successMessage) {
      this.successMessage = '';
      this.loadPlans();
    }
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  openDeleteModal(plan: Plan): void {
    this.planToDelete = plan;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.planToDelete = null;
    this.cdr.detectChanges();
  }

  onDeleteConfirm(): void {
    if (!this.planToDelete) return;

    const planId = this.planToDelete.plan_id;

    // Remove from arrays immediately for better UX
    this.plans = this.plans.filter(p => p.plan_id !== planId);
    this.filteredPlans = this.filteredPlans.filter(p => p.plan_id !== planId);
    this.cdr.detectChanges();

    this.closeDeleteModal();

    // Then call the API
    this.http.delete<any>(`/api/subscription/delete/${planId}`).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.successMessage = 'Plan deleted successfully!';
          this.showModal();
          this.cdr.detectChanges();
        } else {
          this.errorMessage = response?.message || 'Error deleting plan';
          this.showModal();
          this.cdr.detectChanges();
          // Reload on error to restore deleted item
          this.loadPlans();
        }
      },
      (error: any) => {
        this.errorMessage = error?.error?.message || 'Error deleting plan';
        this.showModal();
        this.cdr.detectChanges();
        // Reload on error to restore deleted item
        this.loadPlans();
      }
    );
  }

  onEditClick(plan: Plan): void {
    this.router.navigate([`/adminmaster/editplan/${plan.plan_id}`]);
  }

  goBack(): void {
    this.router.navigate(['/adminmaster']);
  }

  createNewPlan(): void {
    this.router.navigate(['/adminmaster/createplan']);
  }
}
