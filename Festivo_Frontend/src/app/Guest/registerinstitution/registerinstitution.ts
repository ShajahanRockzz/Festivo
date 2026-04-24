import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../services/registration.service';

interface InstitutionForm {
  institution_name: string;
  institution_address: string;
  institution_email: string;
  institution_contactno: string;
  websiteaddress: string;
  institution_image: File | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_link: string;
}

interface LoginData {
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-registerinstitution',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registerinstitution.html',
  styleUrl: './registerinstitution.scss',
})
export class Registerinstitution {
  institutionForm: InstitutionForm = {
    institution_name: '',
    institution_address: '',
    institution_email: '',
    institution_contactno: '',
    websiteaddress: '',
    institution_image: null,
    latitude: null,
    longitude: null,
    google_maps_link: ''
  };

  loginData: LoginData = {
    username: '',
    password: '',
    role: 'Institution'
  };

  submitting = false;
  successMessage = '';
  errorMessage = '';
  fileSelected = false;
  imagePreview: string | ArrayBuffer | null = null;

  // Submit Modal
  submitError = '';
  submitSuccess = '';

  // OTP related
  otpSent = false;
  otpVerified = false;
  otpCode = '';
  otpLoading = false;
  otpErrorMessage = '';
  emailSentTo = '';
  resendTimer = 0;

  // Username availability
  usernameError = '';
  usernameChecking = false;

  // Email availability
  emailError = '';
  emailChecking = false;

  // Location search
  locationSearchQuery = '';
  locationSearching = false;
  locationError = '';
  locationResults: any[] = [];
  showLocationResults = false;
  selectedLocation: any = null;

  constructor(private router: Router, private registrationService: RegistrationService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.institutionForm.institution_image = file;
      this.fileSelected = true;

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.institutionForm.institution_image = null;
    this.imagePreview = null;
    this.fileSelected = false;
    this.cdr.detectChanges();
  }

  submitRegistration() {
    if (!this.validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.submitting = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.submitError = '';
    this.submitSuccess = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    // Prepare form data
    const formData = new FormData();
    formData.append('institution_name', this.institutionForm.institution_name);
    formData.append('institution_address', this.institutionForm.institution_address);
    formData.append('institution_email', this.institutionForm.institution_email);
    formData.append('institution_contactno', this.institutionForm.institution_contactno);
    formData.append('websiteaddress', this.institutionForm.websiteaddress);
    formData.append('username', this.loginData.username);
    formData.append('password', this.loginData.password);
    formData.append('role', this.loginData.role);
    formData.append('latitude', this.institutionForm.latitude?.toString() || '');
    formData.append('longitude', this.institutionForm.longitude?.toString() || '');
    formData.append('google_maps_link', this.institutionForm.google_maps_link);

    if (this.institutionForm.institution_image) {
      formData.append('institution_image', this.institutionForm.institution_image);
    }

    // Call API
    this.registrationService.registerInstitution(formData).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if (response.success) {
            this.submitError = ''; this.submitSuccess = 'Registration successful!'; window.scrollTo({ top: 0, behavior: 'smooth' });
            this.submitting = false;
            this.cdr.detectChanges();
          } else {
            this.submitting = false;
            this.submitError = typeof response !== 'undefined' && response.message ? response.message : 'An error occurred during registration. Please try again later.'; window.scrollTo({ top: 0, behavior: 'smooth' });
            this.cdr.detectChanges();
          }
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.submitting = false;
          console.error('Registration error:', error);
          this.submitError = error?.error?.message || 'An error occurred during registration. Please try again later.'; window.scrollTo({ top: 0, behavior: 'smooth' });
          this.cdr.detectChanges();
        });
      }
    );
  }

  validateForm(): boolean {
    if (!this.institutionForm.institution_name.trim()) {
      this.errorMessage = 'Please enter your institution name';
      return false;
    }
    if (!this.institutionForm.institution_address.trim()) {
      this.errorMessage = 'Please enter your address';
      return false;
    }
    if (!this.institutionForm.institution_email.trim()) {
      this.errorMessage = 'Please enter your email';
      return false;
    }
    if (!this.isValidEmail(this.institutionForm.institution_email)) {
      this.errorMessage = 'Please enter a valid email';
      return false;
    }
    if (!this.institutionForm.institution_contactno.trim()) {
      this.errorMessage = 'Please enter your contact number';
      return false;
    }
    if (!/^[0-9]{10}$/.test(this.institutionForm.institution_contactno.replace(/[\s-]/g, ''))) {
      this.errorMessage = 'Please enter a valid 10-digit contact number';
      return false;
    }
    // Website address is now optional
    if (this.institutionForm.websiteaddress.trim() && !this.isValidUrl(this.institutionForm.websiteaddress)) {
      this.errorMessage = 'Please enter a valid website address';
      return false;
    }
    if (!this.institutionForm.latitude || !this.institutionForm.longitude) {
      this.errorMessage = 'Please select your institution location';
      return false;
    }
    if (!this.institutionForm.google_maps_link.trim()) {
      this.errorMessage = 'Please enter your Google Maps link';
      return false;
    }
    // Institution image is now optional
    if (!this.loginData.username.trim()) {
      this.errorMessage = 'Please enter a username';
      return false;
    }
    if (!this.loginData.password) {
      this.errorMessage = 'Please enter a password';
      return false;
    }
    if (this.loginData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  requestOTP() {
    if (!this.institutionForm.institution_email.trim()) {
      this.otpErrorMessage = 'Please enter your email first';
      return;
    }
    if (!this.isValidEmail(this.institutionForm.institution_email)) {
      this.otpErrorMessage = 'Please enter a valid email';
      return;
    }

    this.otpLoading = true;
    this.otpErrorMessage = '';

    this.registrationService.sendOTP(this.institutionForm.institution_email).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.otpLoading = false;
          if (response.success) {
            this.otpSent = true;
            this.emailSentTo = this.institutionForm.institution_email;
            this.startResendTimer();
          } else {
            this.otpErrorMessage = response.message || 'Failed to send OTP';
          }
          this.cdr.detectChanges();
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.otpLoading = false;
          this.otpErrorMessage = error.error?.message || 'Error sending OTP';
          this.cdr.detectChanges();
        });
      }
    );
  }

  verifyOTP() {
    if (!this.otpCode.trim()) {
      this.otpErrorMessage = 'Please enter the OTP';
      return;
    }
    if (this.otpCode.length !== 6) {
      this.otpErrorMessage = 'OTP must be 6 digits';
      return;
    }

    this.otpLoading = true;
    this.otpErrorMessage = '';

    this.registrationService.verifyOTP(this.institutionForm.institution_email, this.otpCode).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.otpLoading = false;
          if (response.success) {
            this.otpVerified = true;
            this.otpErrorMessage = '';
          } else {
            this.otpErrorMessage = response.message || 'Invalid OTP';
            this.otpCode = '';
          }
          this.cdr.detectChanges();
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.otpLoading = false;
          this.otpErrorMessage = error.error?.message || 'Error verifying OTP';
          this.otpCode = '';
          this.cdr.detectChanges();
        });
      }
    );
  }

  startResendTimer() {
    this.resendTimer = 60;
    const interval = setInterval(() => {
      this.resendTimer--;
      this.cdr.detectChanges();
      if (this.resendTimer <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  resetOTP() {
    this.otpSent = false;
    this.otpVerified = false;
    this.otpCode = '';
    this.otpErrorMessage = '';
    this.resendTimer = 0;
    this.cdr.detectChanges();
  }

  closeSubmitModal() {
    this.submitting = false;
    this.submitError = '';
    this.submitSuccess = '';
    this.cdr.detectChanges();
  }

  goHome() {
    this.submitting = false;
    this.submitSuccess = '';
    this.submitError = '';
    this.cdr.detectChanges();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  checkUsernameAvailability() {
    if (!this.loginData.username.trim()) {
      this.usernameError = '';
      return;
    }

    this.usernameChecking = true;
    this.usernameError = '';
    this.cdr.detectChanges();

    this.registrationService.checkUsernameAvailability(this.loginData.username).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.usernameChecking = false;
          if (!response.available) {
            this.usernameError = 'Username already exists. Please choose a different username.';
          } else {
            this.usernameError = '';
          }
          this.cdr.detectChanges();
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.usernameChecking = false;
          console.error('Username check error:', error);
          this.cdr.detectChanges();
        });
      }
    );
  }

  checkEmailAvailability() {
    if (!this.institutionForm.institution_email.trim()) {
      this.emailError = '';
      return;
    }

    this.emailChecking = true;
    this.emailError = '';
    this.cdr.detectChanges();

    this.registrationService.checkInstitutionEmailAvailability(this.institutionForm.institution_email).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.emailChecking = false;
          if (!response.available) {
            this.emailError = 'Email already registered. Please use a different email.';
            this.otpSent = false;
            this.otpVerified = false;
          } else {
            this.emailError = '';
          }
          this.cdr.detectChanges();
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.emailChecking = false;
          console.error('Email check error:', error);
          this.cdr.detectChanges();
        });
      }
    );
  }

  performLocationSearch() {
    if (!this.locationSearchQuery.trim()) {
      this.locationError = 'Please enter a search query';
      return;
    }

    this.locationSearching = true;
    this.locationError = '';
    this.showLocationResults = false;
    this.cdr.detectChanges();

    // Call backend API to search location
    this.registrationService.searchLocation(this.locationSearchQuery).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.locationSearching = false;
          if (response.success && response.locations && response.locations.length > 0) {
            this.locationResults = response.locations;
            this.showLocationResults = true;
            this.locationError = '';
          } else {
            this.locationError = response.message || 'No locations found. Please try a different search.';
            this.locationResults = [];
          }
          this.cdr.detectChanges();
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.locationSearching = false;
          this.locationError = 'Error fetching location. Please try again.';
          console.error('Location search error:', error);
          this.cdr.detectChanges();
        });
      }
    );
  }

  selectLocation(location: any) {
    this.ngZone.run(() => {
      this.institutionForm.latitude = parseFloat(location.lat);
      this.institutionForm.longitude = parseFloat(location.lon);
      this.selectedLocation = location;
      this.showLocationResults = false;
      this.locationError = '';
      this.cdr.detectChanges();
    });
  }

  clearLocation() {
    this.institutionForm.latitude = null;
    this.institutionForm.longitude = null;
    this.selectedLocation = null;
    this.locationResults = [];
    this.showLocationResults = false;
    this.locationError = '';
    this.cdr.detectChanges();
  }
}

