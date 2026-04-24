import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Coordinator {
  name: string;
  email: string;
  contact_no: string;
  username: string;
  password: string;
  image: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  contact_no?: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-addcoordinator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './addcoordinator.html',
  styleUrl: './addcoordinator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Addcoordinator implements OnInit {
  coordinator: Coordinator = {
    name: '',
    email: '',
    contact_no: '',
    username: '',
    password: '',
    image: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  institutionId: number = 0;
  loginId: number = 0;
  showModal = false;
  modalData = { title: '', message: '', type: '' };
  selectedImagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  validationErrors: ValidationErrors = {};
  formTouched = {
    name: false,
    email: false,
    contact_no: false,
    username: false,
    password: false
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0;
    }
  }

  ngOnInit(): void {
    // Fetch institution details
    if (this.loginId) {
      this.fetchInstitutionDetails();
    } else {
      this.showErrorMessage('Unable to identify institution. Please login again.');
    }
  }

  fetchInstitutionDetails(): void {
    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        if (response.success && response.userDetails) {
          this.institutionId = response.userDetails.institution_id || 0;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching institution details:', error);
        this.showErrorMessage('Error loading institution details');
      }
    );
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showErrorMessage('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.showErrorMessage('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
        // Trigger change detection immediately
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.selectedImagePreview = null;
    this.coordinator.image = '';
    this.cdr.detectChanges();
  }

  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.coordinator.contact_no = value;
    this.cdr.detectChanges();
  }

  validateName(): void {
    this.formTouched.name = true;
    if (!this.coordinator.name.trim()) {
      this.validationErrors.name = 'Name is required';
    } else if (this.coordinator.name.trim().length < 3) {
      this.validationErrors.name = 'Name must be at least 3 characters';
    } else {
      this.validationErrors.name = undefined;
    }
    this.cdr.detectChanges();
  }

  validateEmail(): void {
    this.formTouched.email = true;
    if (!this.coordinator.email.trim()) {
      this.validationErrors.email = 'Email is required';
    } else if (!this.isValidEmail(this.coordinator.email)) {
      this.validationErrors.email = 'Please enter a valid email address';
    } else {
      this.validationErrors.email = undefined;
    }
    this.cdr.detectChanges();
  }

  validatePhone(): void {
    this.formTouched.contact_no = true;
    if (!this.coordinator.contact_no.trim()) {
      this.validationErrors.contact_no = 'Phone number is required';
    } else if (this.coordinator.contact_no.length !== 10) {
      this.validationErrors.contact_no = 'Phone number must be exactly 10 digits';
    } else {
      this.validationErrors.contact_no = undefined;
    }
    this.cdr.detectChanges();
  }

  validateUsername(): void {
    this.formTouched.username = true;
    if (!this.coordinator.username.trim()) {
      this.validationErrors.username = 'Username is required';
    } else if (this.coordinator.username.trim().length < 4) {
      this.validationErrors.username = 'Username must be at least 4 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.coordinator.username)) {
      this.validationErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else {
      this.validationErrors.username = undefined;
    }
    this.cdr.detectChanges();
  }

  validatePassword(): void {
    this.formTouched.password = true;
    if (!this.coordinator.password.trim()) {
      this.validationErrors.password = 'Password is required';
    } else if (this.coordinator.password.length < 6) {
      this.validationErrors.password = 'Password must be at least 6 characters';
    } else {
      this.validationErrors.password = undefined;
    }
    this.cdr.detectChanges();
  }

  addCoordinator(): void {
    // Validate all fields
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validateUsername();
    this.validatePassword();

    if (this.validationErrors.name || this.validationErrors.email || this.validationErrors.contact_no || this.validationErrors.username || this.validationErrors.password) {
      this.showErrorMessage('Please fix all validation errors before submitting');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', this.coordinator.name.trim());
    formData.append('email', this.coordinator.email.trim());
    formData.append('contact_no', this.coordinator.contact_no.trim());
    formData.append('username', this.coordinator.username.trim());
    formData.append('password', this.coordinator.password.trim());
    formData.append('institution_id', this.institutionId.toString());
    formData.append('login_id', this.loginId.toString());

    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    } else {
      formData.append('image', '');
    }

    this.http.post('/api/coordinators', formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.showSuccessModal('Success!', 'Coordinator has been added successfully!');
          this.resetForm();
        } else {
          this.showErrorMessage(response.message || 'Error adding coordinator');
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error adding coordinator:', error);
        
        let errorMsg = 'Error adding coordinator. Please try again.';
        
        // Extract error message from different possible response structures
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMsg = error.error;
          } else if (error.error.message) {
            errorMsg = error.error.message;
          } else if (error.error.msg) {
            errorMsg = error.error.msg;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        console.log('Displaying error message:', errorMsg);
        this.errorMessage = errorMsg;
        this.successMessage = '';
        this.cdr.detectChanges();
        
        // Scroll to top to show error
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    );
  }

  resetForm(): void {
    this.coordinator = {
      name: '',
      email: '',
      contact_no: '',
      username: '',
      password: '',
      image: ''
    };
    this.imageFile = null;
    this.selectedImagePreview = null;
    this.validationErrors = {};
    this.formTouched = { name: false, email: false, contact_no: false, username: false, password: false };
    this.cdr.detectChanges();
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.cdr.detectChanges();
    
    // Scroll to top to show error
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }

  showSuccessModal(title: string, message: string): void {
    this.modalData = { title, message, type: 'success' };
    this.showModal = true;
    // Trigger change detection immediately to show modal
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.modalData = { title: '', message: '', type: '' };
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/Institution/home']);
  }
}


