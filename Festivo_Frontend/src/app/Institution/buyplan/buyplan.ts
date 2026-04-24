import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Plan {
  plan_id: number;
  plan_name: string;
  days: number;
  amount: string;
  description: string;
  renewaldate?: string;
}

interface PaymentData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

@Component({
  selector: 'app-buyplan',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './buyplan.html',
  styleUrl: './buyplan.scss',
})
export class Buyplan implements OnInit {
  plans: Plan[] = [];
  currentPlan: Plan | null = null;
  loginId: number = 0;
  institutionId: number = 0;
  selectedPlanId: number | null = null;
  isLoading = false;
  showPaymentModal = false;
  showModal = false;
  modalData = { title: '', message: '', type: '' };
  
  paymentData: PaymentData = {
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  paymentErrors: {
    cardHolderName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  } = {};

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0;
    }
  }

  ngOnInit(): void {
    this.fetchInstitutionAndPlans();
  }

  fetchInstitutionAndPlans(): void {
    this.isLoading = true;
    if (!this.loginId) {
      this.loadPlans();
      return;
    }

    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        const institutionData = response.userDetails || response.data;
        if (response.success && institutionData) {
          this.institutionId = institutionData.institution_id || 0;
          this.fetchUpgradePlans();
        } else {
          this.loadPlans();
        }
      },
      (error) => {
        this.loadPlans();
      }
    );
  }

  fetchUpgradePlans(): void {
    if (!this.institutionId) {
      this.loadPlans();
      return;
    }

    this.http.get(`/api/plans/higher-plans/${this.institutionId}`).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if (response.success) {
            this.currentPlan = response.data.currentPlan;
            this.plans = response.data.availablePlans;
          } else {
            this.loadPlans();
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          this.loadPlans();
        });
      }
    );
  }

  loadPlans(): void {
    this.isLoading = true;
    this.http.get('/api/plans').subscribe(
      (response: any) => {
        if (response.success) {
          this.plans = response.data || [];
        } else {
          this.plans = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.showModal = true;
        this.modalData = {
          title: 'Error',
          message: 'Error loading plans. Please try again.',
          type: 'error'
        };
        this.cdr.detectChanges();
      }
    );
  }

  selectPlan(planId: number): void {
    this.selectedPlanId = planId;
    this.showPaymentModal = true;
    this.cdr.detectChanges();
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlanId = null;
    this.resetPaymentForm();
    this.cdr.detectChanges();
  }

  resetPaymentForm(): void {
    this.paymentData = {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
    this.paymentErrors = {};
  }

  validatePaymentForm(): boolean {
    this.paymentErrors = {};

    // Validate cardholder name
    const cardholderName = this.paymentData.cardHolderName.trim();
    if (!cardholderName) {
      this.paymentErrors['cardHolderName'] = 'Cardholder name is required';
    } else if (cardholderName.length < 2) {
      this.paymentErrors['cardHolderName'] = 'Cardholder name must be at least 2 characters';
    }

    // Validate card number (13-19 digits)
    const cardNumber = this.paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      this.paymentErrors['cardNumber'] = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      this.paymentErrors['cardNumber'] = 'Please enter a valid card number (13-19 digits)';
    }

    // Validate expiry date (MM/YY + not expired)
    const expiry = this.paymentData.expiryDate;
    if (!expiry) {
      this.paymentErrors['expiryDate'] = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      this.paymentErrors['expiryDate'] = 'Expiry date must be in MM/YY format';
    } else {
      const [monthStr, yearStr] = expiry.split('/');
      const month = Number(monthStr);
      const year = 2000 + Number(yearStr);
      const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
      if (expiryDate < new Date()) {
        this.paymentErrors['expiryDate'] = 'Card has expired';
      }
    }

    // Validate CVV (3-4 digits)
    if (!this.paymentData.cvv) {
      this.paymentErrors['cvv'] = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(this.paymentData.cvv)) {
      this.paymentErrors['cvv'] = 'CVV must be 3 or 4 digits';
    }

    this.cdr.detectChanges();
    return Object.keys(this.paymentErrors).length === 0;
  }

  processPayment(): void {
    if (!this.validatePaymentForm() || !this.selectedPlanId) {
      return;
    }

    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    const institutionId = currentUser?.institutionId;

    if (!institutionId) {
      this.isLoading = false;
      this.showModal = true;
      this.modalData = {
        title: 'Error',
        message: 'Institution ID not found. Please log in again.',
        type: 'error'
      };
      return;
    }

    const paymentPayload = {
      planId: this.selectedPlanId,
      institutionId: institutionId,
      cardHolderName: this.paymentData.cardHolderName.trim(),
      cardNumber: this.paymentData.cardNumber.replace(/\s/g, '').slice(-4), // Store only last 4 digits
      amount: this.getSelectedPlanAmount()
    };

    this.http.post('/api/payment/process', paymentPayload).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.closePaymentModal(); // Properly close the payment modal
          // Show success modal after a brief delay to ensure payment modal is cleared
          setTimeout(() => {
            this.showModal = true;
            this.modalData = {
              title: 'Success',
              message: 'Plan purchased successfully! Your subscription is now active.',
              type: 'success'
            };
            this.cdr.detectChanges();
          }, 300);
        } else {
          this.showModal = true;
          this.modalData = {
            title: 'Error',
            message: response.message || 'Payment processing failed. Please try again.',
            type: 'error'
          };
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.isLoading = false;
        this.showModal = true;
        this.modalData = {
          title: 'Error',
          message: error.error?.message || 'Payment processing failed. Please try again.',
          type: 'error'
        };
        this.cdr.detectChanges();
      }
    );
  }

  getSelectedPlanAmount(): string {
    const plan = this.plans.find(p => p.plan_id === this.selectedPlanId);
    return plan ? plan.amount : '0';
  }

  getSelectedPlanName(): string {
    const plan = this.plans.find(p => p.plan_id === this.selectedPlanId);
    return plan ? plan.plan_name : '';
  }

  getSelectedPlanDays(): number {
    const plan = this.plans.find(p => p.plan_id === this.selectedPlanId);
    return plan ? plan.days : 0;
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
    
    // Navigate back if success
    if (this.modalData.type === 'success') {
      this.router.navigate(['/Institution/viewfest']);
    }
  }

  formatCardNumber(event: any): void {
    const rawValue = String(event.target.value || '');
    const value = rawValue.replace(/\D/g, '').slice(0, 19);
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentData.cardNumber = formattedValue;
  }

  allowOnlyDigits(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[a-zA-Z ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  formatCardholderName(event: any): void {
    const rawValue = String(event.target.value || '');
    this.paymentData.cardHolderName = rawValue
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();
  }

  formatExpiryDate(event: any): void {
    let value = String(event.target.value || '').replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.paymentData.expiryDate = value;
  }

  formatCvv(event: any): void {
    const rawValue = String(event.target.value || '');
    this.paymentData.cvv = rawValue.replace(/\D/g, '').slice(0, 4);
  }

  validateCardHolderName(): void {
    const cardholderName = this.paymentData.cardHolderName.trim();
    if (!cardholderName) {
      this.paymentErrors['cardHolderName'] = 'Cardholder name is required';
    } else if (cardholderName.length < 2) {
      this.paymentErrors['cardHolderName'] = 'Cardholder name must be at least 2 characters';
    } else {
      delete this.paymentErrors['cardHolderName'];
    }
    this.cdr.detectChanges();
  }

  validateCardNumber(): void {
    const cardNumber = this.paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      this.paymentErrors['cardNumber'] = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      this.paymentErrors['cardNumber'] = 'Please enter a valid card number (13-19 digits)';
    } else {
      delete this.paymentErrors['cardNumber'];
    }
    this.cdr.detectChanges();
  }

  validateExpiryDate(): void {
    const expiry = this.paymentData.expiryDate;

    if (!expiry) {
      this.paymentErrors['expiryDate'] = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      this.paymentErrors['expiryDate'] = 'Expiry date must be in MM/YY format';
    } else {
      const [monthStr, yearStr] = expiry.split('/');
      const month = Number(monthStr);
      const year = 2000 + Number(yearStr);
      const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);

      if (expiryDate < new Date()) {
        this.paymentErrors['expiryDate'] = 'Card has expired';
      } else {
        delete this.paymentErrors['expiryDate'];
      }
    }

    this.cdr.detectChanges();
  }

  validateCvv(): void {
    if (!this.paymentData.cvv) {
      this.paymentErrors['cvv'] = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(this.paymentData.cvv)) {
      this.paymentErrors['cvv'] = 'CVV must be 3 or 4 digits';
    } else {
      delete this.paymentErrors['cvv'];
    }
    this.cdr.detectChanges();
  }

  formatRenewalDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  }
}
