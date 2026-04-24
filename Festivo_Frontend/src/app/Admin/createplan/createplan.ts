import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface PlanData {
  plan_name: string;
  description: string;
  days: number | null;
  amount: string;
}

@Component({
  selector: 'app-createplan',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './createplan.html',
  styleUrl: './createplan.scss',
})
export class Createplan implements OnInit {
  planData: PlanData = {
    plan_name: '',
    description: '',
    days: null,
    amount: ''
  };

  isSaving = false;
  errorMessage = '';
  successMessage = '';
  showMessageModal = false;
  existingPlans: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load existing plans
    this.loadExistingPlans();
  }

  loadExistingPlans(): void {
    this.http.get<any>('/api/subscription/all').subscribe(
      (response: any) => {
        if (response && response.success && response.data) {
          this.existingPlans = response.data;
        }
      },
      (error: any) => {
        console.error('Error loading plans:', error);
      }
    );
  }

  showModal(): void {
    this.showMessageModal = true;
  }

  closeModal(): void {
    this.showMessageModal = false;
    if (this.successMessage) {
      this.successMessage = '';
      // Redirect to view plans after success
      setTimeout(() => {
        this.router.navigate(['/adminmaster/viewplan']);
      }, 500);
    }
  }

  submitForm(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.planData.plan_name.trim()) {
      this.errorMessage = 'Plan name is required';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (this.planData.plan_name.length < 3 || this.planData.plan_name.length > 100) {
      this.errorMessage = 'Plan name must be between 3 and 100 characters';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    // Check if plan with same name already exists
    const planNameExists = this.existingPlans.some(
      plan => plan.plan_name.toLowerCase().trim() === this.planData.plan_name.toLowerCase().trim()
    );

    if (planNameExists) {
      this.errorMessage = `A plan with the name "${this.planData.plan_name}" already exists. Please use a different name.`;
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (!this.planData.description.trim()) {
      this.errorMessage = 'Plan description is required';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (this.planData.description.length < 10 || this.planData.description.length > 500) {
      this.errorMessage = 'Description must be between 10 and 500 characters';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (this.planData.days === null || this.planData.days <= 0) {
      this.errorMessage = 'Duration must be greater than 0';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (!this.planData.amount.trim() || isNaN(Number(this.planData.amount))) {
      this.errorMessage = 'Please enter a valid amount';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.cdr.detectChanges();

    const requestData = {
      plan_name: this.planData.plan_name.trim(),
      description: this.planData.description.trim(),
      days: this.planData.days,
      amount: this.planData.amount.trim()
    };

    this.http.post<any>('/api/subscription/add', requestData).subscribe(
      (response: any) => {
        this.isSaving = false;
        if (response && response.success) {
          this.successMessage = 'Subscription plan created successfully!';
          this.showModal();
          this.cdr.detectChanges();
        } else {
          this.errorMessage = (response && response.message) || 'Error creating subscription plan';
          this.showModal();
          this.cdr.detectChanges();
        }
      },
      (error: any) => {
        this.isSaving = false;
        this.errorMessage = error?.error?.message || 'Error creating subscription plan. Please try again.';
        this.showModal();
        this.cdr.detectChanges();
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/adminmaster']);
  }
}
