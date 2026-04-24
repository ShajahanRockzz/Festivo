import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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

interface PaymentForm {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

@Component({
  selector: 'app-upgradeplan',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './upgradeplan.html',
  styleUrl: './upgradeplan.scss',
})
export class Upgradeplan implements OnInit {
  currentPlan: Plan | null = null;
  availablePlans: Plan[] = [];
  institutionId: number = 0;
  loginId: number = 0;
  loading: boolean = true;
  errorMessage: string = '';

  // Payment modal properties
  showPaymentModal: boolean = false;
  selectedPlan: Plan | null = null;
  paymentLoading: boolean = false;
  paymentError: string = '';
  paymentSuccess: boolean = false;

  paymentForm: PaymentForm = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
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
    if (!this.loginId) {
      this.errorMessage = 'User not logged in';
      this.loading = false;
      return;
    }

    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        const institutionData = response.userDetails || response.data;
        if (response.success && institutionData) {
          this.institutionId = institutionData.institution_id || 0;
          console.log('Institution ID:', this.institutionId);
          this.fetchUpgradePlans();
        } else {
          this.errorMessage = 'Could not fetch institution details';
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching institution:', error);
        this.errorMessage = 'Error loading institution details';
        this.loading = false;
      }
    );
  }

  fetchUpgradePlans(): void {
    if (!this.institutionId) {
      this.errorMessage = 'Invalid institution';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get(`/api/plans/higher-plans/${this.institutionId}`).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          console.log('Upgrade plans response:', response);
          if (response.success) {
            this.currentPlan = response.data.currentPlan;
            this.availablePlans = response.data.availablePlans;
          } else {
            this.errorMessage = response.message || 'Could not fetch available plans';
          }
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          console.error('Error fetching upgrade plans:', error);
          this.errorMessage = 'Error loading available plans';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    );
  }

  upgradeToPlan(plan: Plan): void {
    this.selectedPlan = plan;
    this.showPaymentModal = true;
    this.paymentError = '';
    this.paymentSuccess = false;
    this.resetPaymentForm();
  }

  resetPaymentForm(): void {
    this.paymentForm = {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlan = null;
    this.paymentError = '';
    this.paymentSuccess = false;
    this.resetPaymentForm();
  }

  validatePaymentForm(): boolean {
    if (!this.paymentForm.cardholderName.trim()) {
      this.paymentError = 'Cardholder name is required';
      return false;
    }

    const cardNumber = this.paymentForm.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) {
      this.paymentError = 'Please enter a valid card number (13-19 digits)';
      return false;
    }

    if (!this.paymentForm.expiryDate.trim()) {
      this.paymentError = 'Expiry date is required';
      return false;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(this.paymentForm.expiryDate)) {
      this.paymentError = 'Expiry date must be in MM/YY format';
      return false;
    }

    if (!/^\d{3,4}$/.test(this.paymentForm.cvv)) {
      this.paymentError = 'Please enter a valid CVV (3-4 digits)';
      return false;
    }

    return true;
  }

  processPayment(): void {
    if (!this.validatePaymentForm()) {
      return;
    }

    if (!this.selectedPlan || !this.institutionId) {
      this.paymentError = 'Invalid payment details';
      return;
    }

    this.paymentLoading = true;
    this.paymentError = '';

    const paymentPayload = {
      planId: this.selectedPlan.plan_id,
      institutionId: this.institutionId,
      cardHolderName: this.paymentForm.cardholderName,
      cardNumber: this.paymentForm.cardNumber.replace(/\s/g, ''),
      amount: this.selectedPlan.amount
    };

    console.log('Processing payment:', paymentPayload);

    this.http.post(`/api/payment/process`, paymentPayload).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          console.log('Payment response:', response);
          this.paymentLoading = false;

          if (response.success) {
            this.paymentSuccess = true;
            this.cdr.detectChanges();
            
            // Broadcast subscription update to parent components
            sessionStorage.setItem('subscriptionUpdated', 'true');
            window.dispatchEvent(new Event('subscriptionUpdated'));
            
            setTimeout(() => {
              this.closePaymentModal();
              // Refresh plans to show updated subscription
              this.fetchUpgradePlans();
            }, 2000);
          } else {
            this.paymentError = response.message || 'Payment processing failed';
            this.cdr.detectChanges();
          }
        });
      },
      (error) => {
        this.ngZone.run(() => {
          console.error('Payment error:', error);
          this.paymentLoading = false;
          this.paymentError = error.error?.message || 'Error processing payment. Please try again.';
          this.cdr.detectChanges();
        });
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/Institution/home']);
  }

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  formatCardNumber(event: any): void {
    const rawValue = String(event.target.value || '');
    const value = rawValue.replace(/\D/g, '').slice(0, 19);
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.cardNumber = formattedValue;
  }

  // Allow only numeric keys for card number field
  allowOnlyDigits(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Allow only letters/spaces for cardholder name
  allowOnlyLetters(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[a-zA-Z ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Keep cardholder name clean even for pasted input
  formatCardholderName(event: any): void {
    const rawValue = String(event.target.value || '');
    this.paymentForm.cardholderName = rawValue
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();
  }

  // Format expiry date as MM/YY
  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.expiryDate = value;
  }

  // Keep CVV numeric and within 4 digits
  formatCvv(event: any): void {
    const rawValue = String(event.target.value || '');
    this.paymentForm.cvv = rawValue.replace(/\D/g, '').slice(0, 4);
  }

  // Format renewal date for display
  formatRenewalDate(dateString: string): string {
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
