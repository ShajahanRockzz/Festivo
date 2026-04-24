import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../services/registration.service';

interface ParticipantForm {
  participantname: string;
  participantemail: string;
  contact_no: string;
  academic_status: string;
  institution_name: string;
  institution_id_proof: File | null;
  participantimage: File | null;
}

interface LoginData {
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-registerparticipant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registerparticipant.html',
  styleUrl: './registerparticipant.scss',
})
export class Registerparticipant {
  participantForm: ParticipantForm = {
    participantname: '',
    participantemail: '',
    contact_no: '',
    academic_status: '',
    institution_name: '',
    institution_id_proof: null,
    participantimage: null
  };

  loginData: LoginData = {
    username: '',
    password: '',
    role: 'Participant'
  };

  academicOptions = ['School Student', 'College Student', 'Other'];
  submitting = false;
  successMessage = '';
  errorMessage = '';
  fileSelected = false;

  // Profile image properties
  profileImageSelected: boolean = false;
  profileImagePreviewUrl: string | ArrayBuffer | null = null;

  // Submit Modal
  showSubmitModal = false;
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

  // File preview
  filePreviewUrl: string | ArrayBuffer | null = null;

  // Username availability
  usernameError = '';
  usernameChecking = false;

  // Email availability
  emailError = '';
  emailChecking = false;

  constructor(private router: Router, private registrationService: RegistrationService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  isInstitutionRequired(): boolean {
    return this.participantForm.academic_status === 'School Student' || 
           this.participantForm.academic_status === 'College Student';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.participantForm.institution_id_proof = file;
      this.fileSelected = true;

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.ngZone.run(() => {
            this.filePreviewUrl = e.target.result;
            this.cdr.detectChanges();
          });
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, show the file name
        this.filePreviewUrl = null;
        this.cdr.detectChanges();
      }
    }
  }

  onProfileImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.participantForm.participantimage = file;
      this.profileImageSelected = true;

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.ngZone.run(() => {
            this.profileImagePreviewUrl = e.target.result;
            this.cdr.detectChanges();
          });
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, show null preview
        this.profileImagePreviewUrl = null;
        this.cdr.detectChanges();
      }
    }
  }

  submitRegistration() {
    if (!this.validateForm()) {
      this.showSubmitModal = true;
      this.submitting = false;
      this.submitError = this.errorMessage || 'Please fix the highlighted errors and try again.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.cdr.detectChanges();
      return;
    }

    this.showSubmitModal = true;
    this.submitting = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    this.submitError = '';
    this.submitSuccess = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    // Prepare form data
    const formData = new FormData();
    formData.append('participantname', this.participantForm.participantname);
    formData.append('participantemail', this.participantForm.participantemail);
    formData.append('contact_no', this.participantForm.contact_no);
    formData.append('academic_status', this.participantForm.academic_status);
    formData.append('username', this.loginData.username);
    formData.append('password', this.loginData.password);
    formData.append('role', this.loginData.role);

    // Only append institution_name if it has a value (for students)
    if (this.participantForm.institution_name && this.participantForm.institution_name.trim()) {
      formData.append('institution_name', this.participantForm.institution_name);
    }

    if (this.participantForm.institution_id_proof) {
      formData.append('institution_id_proof', this.participantForm.institution_id_proof);
    }

    if (this.participantForm.participantimage) {
      formData.append('participantimage', this.participantForm.participantimage);
    }

    // Call API
    this.registrationService.registerParticipant(formData).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if(response.success){ this.submitError=''; this.submitSuccess='Registration successful!'; window.scrollTo({ top: 0, behavior: 'smooth' }); 
            this.submitting = false;
            this.showSubmitModal = true;
              this.cdr.detectChanges();
            } else {
              this.submitting = false;
              this.showSubmitModal = true;
              this.submitError = typeof response !== 'undefined' && response.message ? response.message : 'An error occurred during registration. Please try again later.'; window.scrollTo({ top: 0, behavior: 'smooth' });
            this.cdr.detectChanges();
          }
        });
      },
      (error: any) => {
        this.ngZone.run(() => {
          this.submitting = false;
          this.showSubmitModal = true;
          console.error('Registration error:', error);
          this.submitError = error?.error?.message || 'An error occurred during registration. Please try again later.'; window.scrollTo({ top: 0, behavior: 'smooth' });
          this.cdr.detectChanges();
        });
      }
    );
  }

  validateForm(): boolean {
    if (!this.participantForm.participantname.trim()) {
      this.errorMessage = 'Please enter your name';
      return false;
    }
    if (!this.participantForm.participantemail.trim()) {
      this.errorMessage = 'Please enter your email';
      return false;
    }
    if (!this.isValidEmail(this.participantForm.participantemail)) {
      this.errorMessage = 'Please enter a valid email';
      return false;
    }
    if (!this.participantForm.contact_no.trim()) {
      this.errorMessage = 'Please enter your contact number';
      return false;
    }
    if (!/^[0-9]{10}$/.test(this.participantForm.contact_no.replace(/[\s-]/g, ''))) {
      this.errorMessage = 'Please enter a valid 10-digit contact number';
      return false;
    }
    if (!this.participantForm.academic_status) {
      this.errorMessage = 'Please select your academic status';
      return false;
    }
    // Institution fields required only for students
    if (this.isInstitutionRequired()) {
      if (!this.participantForm.institution_name.trim()) {
        this.errorMessage = 'Please enter your institution name';
        return false;
      }
      if (!this.participantForm.institution_id_proof) {
        this.errorMessage = 'Please upload your ID proof';
        return false;
      }
    }
    if (!this.loginData.username.trim()) {
      this.errorMessage = 'Please enter a username';
      return false;
    }
    if (this.usernameError) {
      this.errorMessage = this.usernameError;
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
    if (!this.participantForm.participantimage) {
      this.errorMessage = 'Please upload a profile photo';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  requestOTP() {
    if (!this.participantForm.participantemail.trim()) {
      this.otpErrorMessage = 'Please enter your email first';
      return;
    }
    if (!this.isValidEmail(this.participantForm.participantemail)) {
      this.otpErrorMessage = 'Please enter a valid email';
      return;
    }

    this.otpLoading = true;
    this.otpErrorMessage = '';

    this.registrationService.sendOTP(this.participantForm.participantemail).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.otpLoading = false;
          if (response.success) {
            this.otpSent = true;
            this.emailSentTo = this.participantForm.participantemail;
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

    this.registrationService.verifyOTP(this.participantForm.participantemail, this.otpCode).subscribe(
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
    this.showSubmitModal = false;
    this.submitting = false;
    this.submitError = '';
    this.submitSuccess = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  goHome() {
    this.showSubmitModal = false;
    this.submitting = false;
    this.submitSuccess = '';
    this.router.navigate(['/login']);
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
    if (!this.participantForm.participantemail.trim()) {
      this.emailError = '';
      return;
    }

    this.emailChecking = true;
    this.emailError = '';
    this.cdr.detectChanges();

    this.registrationService.checkEmailAvailability(this.participantForm.participantemail).subscribe(
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
}

