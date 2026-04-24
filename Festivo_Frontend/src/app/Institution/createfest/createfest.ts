import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface FestData {
  fest_name: string;
  fest_description: string;
  category_id: string;
  fest_for: string;
  startdate: string;
  enddate: string;
}

@Component({
  selector: 'app-createfest',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './createfest.html',
  styleUrl: './createfest.scss',
})
export class Createfest implements OnInit {
  institutionId: number = 0;
  loginId: number = 0;

  festData: FestData = {
    fest_name: '',
    fest_description: '',
    category_id: '',
    fest_for: 'all',
    startdate: '',
    enddate: ''
  };

  categories: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  brochureFileName: string = '';
  selectedImageFile: File | null = null;
  selectedBrochureFile: File | null = null;
  showMessageModal = false;
  isClosingModal = false;

  // Field-level validation errors
  fieldErrors: {
    fest_name?: string;
    fest_description?: string;
    category_id?: string;
    startdate?: string;
    enddate?: string;
    fest_image?: string;
  } = {};

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initializeInstitutionContext();
    // Load categories
    this.loadCategories();
  }

  initializeInstitutionContext(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'User session not found. Please login again.';
      return;
    }

    this.loginId = currentUser.loginId || 0;

    // Prefer institution id from login response if available
    if (currentUser.institutionId) {
      this.institutionId = Number(currentUser.institutionId);
      return;
    }

    // Fallback: fetch user details and derive institution id
    if (this.loginId) {
      this.authService.getUserDetails(this.loginId, 'Institution').subscribe(
        (response: any) => {
          const data = response.userDetails || response.data || {};
          this.institutionId = Number(data.institution_id || data.institutionId || 0);
          this.cdr.detectChanges();
        },
        () => {
          this.errorMessage = 'Unable to fetch institution details for this account';
          this.cdr.detectChanges();
        }
      );
    }
  }

  loadCategories(): void {
    this.http.get('/api/category/all').subscribe(
      (response: any) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      (error) => {
        console.error('Error loading categories');
      }
    );
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    this.ngZone.run(() => {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errorMessage = 'Image size must be less than 5MB';
        this.cdr.detectChanges();
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Only PNG, JPG, GIF, and WebP images are allowed';
        this.cdr.detectChanges();
        return;
      }

      // Store the file
      this.selectedImageFile = file;
      this.errorMessage = '';
      this.validateImage(); // Ensure validation state updates
      this.cdr.detectChanges();

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.ngZone.run(() => {
          this.imagePreview = e.target.result;
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    });
  }

  onBrochureSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    this.ngZone.run(() => {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.errorMessage = 'Brochure size must be less than 10MB';
        this.cdr.detectChanges();
        return;
      }

      // Validate file type (PDF, DOC, DOCX)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Only PDF and Word documents are allowed';
        this.cdr.detectChanges();
        return;
      }

      // Store the file
      this.selectedBrochureFile = file;
      this.brochureFileName = file.name;
      this.errorMessage = '';
      this.cdr.detectChanges();
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  removeBrochure(): void {
    this.brochureFileName = '';
    this.selectedBrochureFile = null;
  }

  showModal(): void {
    this.showMessageModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isClosingModal = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showMessageModal = false;
      this.isClosingModal = false;
      this.cdr.detectChanges();
      if (this.successMessage) {
        this.successMessage = '';
        this.router.navigate(['/Institution/viewfests']);
      }
    }, 300);
  }

  submitForm(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate all fields
    this.validateFestName();
    this.validateDescription();
    this.validateCategory();
    this.validateStartDate();
    this.validateEndDate();
    this.validateImage();

    // Check if there are any validation errors
    if (this.hasFieldErrors()) {
      this.errorMessage = 'Please fix all validation errors before submitting';
      this.showModal();
      return;
    }

    this.createFest();
  }

  createFest(): void {
    if (!this.institutionId) {
      this.errorMessage = 'Invalid institution context. Please login again and retry.';
      this.showModal();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('fest_name', this.festData.fest_name.trim());
    formData.append('fest_description', this.festData.fest_description.trim());
    formData.append('category_id', this.festData.category_id);
    formData.append('fest_for', this.festData.fest_for);
    formData.append('startdate', this.festData.startdate);
    formData.append('enddate', this.festData.enddate);
    formData.append('institution_id', String(this.institutionId));

    if (this.selectedImageFile) {
      formData.append('fest_image', this.selectedImageFile);
    }

    if (this.selectedBrochureFile) {
      formData.append('brochure', this.selectedBrochureFile);
    }

    // Call actual API
    this.http.post('/api/fest/create', formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Fest created successfully!';
          this.errorMessage = ''; // Clear error message
          this.showModal();
          this.resetForm();
        } else {
          this.errorMessage = response.message || 'Error creating fest';
          this.successMessage = '';
          this.showModal();
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error creating fest. Please try again.';
        this.successMessage = '';
        this.showModal();
        this.cdr.detectChanges();
      }
    );
  }

  resetForm(): void {
    this.festData = {
      fest_name: '',
      fest_description: '',
      category_id: '',
      fest_for: 'all',
      startdate: '',
      enddate: ''
    };
    this.imagePreview = null;
    this.brochureFileName = '';
    this.selectedImageFile = null;
    this.selectedBrochureFile = null;
    this.errorMessage = '';
    this.fieldErrors = {};
  }

  // Field Validation Methods
  validateFestName(): void {
    const name = this.festData.fest_name.trim();
    
    if (!name) {
      this.fieldErrors['fest_name'] = 'Fest name is required';
    } else if (name.length < 3) {
      this.fieldErrors['fest_name'] = 'Fest name must be at least 3 characters';
    } else if (name.length > 50) {
      this.fieldErrors['fest_name'] = 'Fest name must be 50 characters or less';
    } else {
      delete this.fieldErrors['fest_name'];
    }
    this.cdr.detectChanges();
  }

  validateDescription(): void {
    const desc = this.festData.fest_description.trim();
    
    if (!desc) {
      this.fieldErrors['fest_description'] = 'Description is required';
    } else if (desc.length < 20) {
      this.fieldErrors['fest_description'] = 'Description must be at least 20 characters';
    } else if (desc.length > 1000) {
      this.fieldErrors['fest_description'] = 'Description must be 1000 characters or less';
    } else {
      delete this.fieldErrors['fest_description'];
    }
    this.cdr.detectChanges();
  }

  validateCategory(): void {
    if (!this.festData.category_id) {
      this.fieldErrors['category_id'] = 'Category is required';
    } else {
      delete this.fieldErrors['category_id'];
    }
    this.cdr.detectChanges();
  }

  validateStartDate(): void {
    const startdate = this.festData.startdate;
    
    if (!startdate) {
      this.fieldErrors['startdate'] = 'Start date is required';
      this.cdr.detectChanges();
      return;
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse the selected start date
    const selectedDate = new Date(startdate);
    selectedDate.setHours(0, 0, 0, 0);

    // Don't allow previous dates
    if (selectedDate < today) {
      this.fieldErrors['startdate'] = 'Start date cannot be a previous date';
      this.cdr.detectChanges();
      return;
    }

    // Validate with end date if end date exists
    if (this.festData.enddate) {
      this.validateEndDate();
    }

    delete this.fieldErrors['startdate'];
    this.cdr.detectChanges();
  }

  validateEndDate(): void {
    const enddate = this.festData.enddate;
    
    if (!enddate) {
      this.fieldErrors['enddate'] = 'End date is required';
      this.cdr.detectChanges();
      return;
    }

    if (!this.festData.startdate) {
      this.fieldErrors['enddate'] = 'Start date must be set first';
      this.cdr.detectChanges();
      return;
    }

    const startDate = new Date(this.festData.startdate);
    const endDate = new Date(enddate);

    // End date must be after start date
    if (endDate <= startDate) {
      this.fieldErrors['enddate'] = 'End date must be after start date';
      this.cdr.detectChanges();
      return;
    }

    delete this.fieldErrors['enddate'];
    this.cdr.detectChanges();
  }

  validateImage(): void {
    if (!this.selectedImageFile) {
      this.fieldErrors['fest_image'] = 'Fest cover image is required';
    } else {
      delete this.fieldErrors['fest_image'];
    }
    this.cdr.detectChanges();
  }

  // Check if form has any errors
  hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }
}
