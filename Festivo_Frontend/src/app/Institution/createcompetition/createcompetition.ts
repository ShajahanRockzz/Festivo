import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface Competition {
  competition_name: string;
  fest_id: number;
  description: string;
  type: string;
  max_members: number;
  min_members: number;
  competition_date: string;
  grouplimit: number;
  reg_fee: number;
  image: string;
}

@Component({
  selector: 'app-createcompetition',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './createcompetition.html',
  styleUrl: './createcompetition.scss',
})
export class Createcompetition implements OnInit {
  competition: Competition = {
    competition_name: '',
    fest_id: 0,
    description: '',
    type: 'single',
    max_members: 1,
    min_members: 1,
    competition_date: '',
    grouplimit: 1,
    reg_fee: 0,
    image: ''
  };

  festId: number = 0;
  festName: string = '';
  festStartDate: string = '';
  festEndDate: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false;
  modalData = { title: '', message: '', type: '' };
  
  // Validation error tracking
  fieldErrors: { [key: string]: string } = {};
  
  // Min date for competition (fest start date)
  minDate: string = '';
  maxDate: string = '';

  // Image upload properties
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isUploadingImage = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['festId']) {
        this.festId = parseInt(params['festId']);
        this.competition.fest_id = this.festId;
        this.fetchFestDetails();
      }
    });
  }
  
  // Handle type change
  onTypeChange(): void {
    this.fieldErrors = {}; // Clear errors
    
    if (this.competition.type === 'single') {
      // For single participant competitions, set fixed values
      this.competition.min_members = 1;
      this.competition.max_members = 1;
    } else {
      // For group competitions, reset to default
      this.competition.min_members = 1;
      this.competition.max_members = 2;
    }
    this.cdr.detectChanges();
  }

  // Helper method to format date for display
  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  }

  fetchFestDetails(): void {
    if (!this.festId) return;

    this.http.get(`/api/fest/${this.festId}`).subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.festName = response.data.fest_name;
          // Note: Database uses 'startdate' and 'enddate' (no underscore)
          this.festStartDate = response.data.startdate;
          this.festEndDate = response.data.enddate;
          
          // Set min and max dates based on fest duration
          if (this.festStartDate) {
            this.minDate = this.festStartDate;
          }
          if (this.festEndDate) {
            this.maxDate = this.festEndDate;
          }
          
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching fest details:', error);
      }
    );
  }

  // Validate form fields
  validateForm(): boolean {
    this.fieldErrors = {};
    this.errorMessage = '';
    
    // Validate competition name
    if (!this.competition.competition_name || !this.competition.competition_name.trim()) {
      this.fieldErrors['competition_name'] = 'Competition name is required';
    } else if (this.competition.competition_name.length < 3) {
      this.fieldErrors['competition_name'] = 'Competition name must be at least 3 characters';
    }
    
    // Validate description
    if (!this.competition.description || !this.competition.description.trim()) {
      this.fieldErrors['description'] = 'Description is required';
    } else if (this.competition.description.length < 10) {
      this.fieldErrors['description'] = 'Description must be at least 10 characters';
    }
    
    // Validate type
    if (!this.competition.type) {
      this.fieldErrors['type'] = 'Please select a competition type';
    }
    
    // Validate date
    if (!this.competition.competition_date) {
      this.fieldErrors['competition_date'] = 'Competition date is required';
    } else {
      let hasDateError = false;
      
      // Normalize dates to YYYY-MM-DD format for string comparison
      const selectedDateStr = this.competition.competition_date;
      
      // Check if date is within fest duration using string comparison (more reliable)
      if (this.festStartDate && selectedDateStr < this.festStartDate) {
        this.fieldErrors['competition_date'] = `Competition date cannot be before the fest start date (${this.formatDateForDisplay(this.festStartDate)})`;
        hasDateError = true;
      }
      
      if (!hasDateError && this.festEndDate && selectedDateStr > this.festEndDate) {
        this.fieldErrors['competition_date'] = `Competition date cannot be after the fest end date (${this.formatDateForDisplay(this.festEndDate)})`;
        hasDateError = true;
      }
      
      // Also do Date object comparison as a backup
      if (!hasDateError) {
        const selectedDate = new Date(this.competition.competition_date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (this.festStartDate) {
          const startDate = new Date(this.festStartDate);
          startDate.setHours(0, 0, 0, 0);
          if (selectedDate < startDate) {
            this.fieldErrors['competition_date'] = `Competition date cannot be before the fest start date (${this.formatDateForDisplay(this.festStartDate)})`;
            hasDateError = true;
          }
        }
        
        if (!hasDateError && this.festEndDate) {
          const endDate = new Date(this.festEndDate);
          endDate.setHours(0, 0, 0, 0);
          if (selectedDate > endDate) {
            this.fieldErrors['competition_date'] = `Competition date cannot be after the fest end date (${this.formatDateForDisplay(this.festEndDate)})`;
          }
        }
      }
    }
    
    // Validate min/max members
    if (this.competition.type !== 'single') {
      if (!this.competition.min_members || this.competition.min_members < 1) {
        this.fieldErrors['min_members'] = 'Minimum members must be at least 1';
      }
      
      if (!this.competition.max_members || this.competition.max_members < 1) {
        this.fieldErrors['max_members'] = 'Maximum members must be at least 1';
      } else if (this.competition.max_members < this.competition.min_members) {
        this.fieldErrors['max_members'] = 'Maximum members must be greater than or equal to minimum members';
      }
    }
    
    // Validate group limit / participant limit
    if (!this.competition.grouplimit || this.competition.grouplimit < 1) {
      this.fieldErrors['grouplimit'] = 'This field is required and must be at least 1';
    }
    
    // Validate registration fee
    if (this.competition.reg_fee < 0) {
      this.fieldErrors['reg_fee'] = 'Registration fee cannot be negative';
    }
    
    // Set error message if there are any errors
    if (Object.keys(this.fieldErrors).length > 0) {
      this.errorMessage = 'Please fix the errors below';
      this.cdr.detectChanges();
      return false;
    }
    
    return true;
  }

  createCompetition(): void {
    // Validate before submitting
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // If image is selected, upload it first
    if (this.selectedImageFile) {
      this.uploadImage()
        .then(() => {
          // After image upload, create competition
          this.submitCompetition();
        })
        .catch((err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to upload image. Please try again.';
          this.showModal = true;
          this.modalData = {
            title: 'Error',
            message: this.errorMessage,
            type: 'error'
          };
          this.cdr.detectChanges();
        });
    } else {
      // No image selected, directly create competition
      this.submitCompetition();
    }
  }

  submitCompetition(): void {
    const payload = {
      competition_name: this.competition.competition_name,
      fest_id: this.festId,
      description: this.competition.description,
      type: this.competition.type,
      max_members: this.competition.max_members,
      min_members: this.competition.min_members,
      competition_date: this.competition.competition_date,
      grouplimit: this.competition.grouplimit,
      reg_fee: this.competition.reg_fee,
      image: this.competition.image
    };

    this.http.post('/api/competitions', payload).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.showModal = true;
          this.modalData = {
            title: 'Success',
            message: 'Competition created successfully!',
            type: 'success'
          };
          setTimeout(() => {
            this.router.navigate(['/Institution/festdetails', this.festId]);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Error creating competition';
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
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error creating competition';
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

  closeModal(): void {
    this.showModal = false;
  }

  goBack(): void {
    this.router.navigate(['/Institution/festdetails', this.festId]);
  }

  // Image upload handlers
  onImageSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.fieldErrors['image'] = 'Please select a valid image file (JPG, PNG, GIF)';
        this.cdr.detectChanges();
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.fieldErrors['image'] = 'Image size must be less than 5MB';
        this.cdr.detectChanges();
        return;
      }

      // Set selected file
      this.selectedImageFile = file;
      this.fieldErrors['image'] = ''; // Clear any previous errors

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.ngZone.run(() => {
          this.imagePreviewUrl = e.target.result;
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
      
      this.cdr.detectChanges();
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
    this.competition.image = '';
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.cdr.detectChanges();
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedImageFile) {
        resolve(''); // No image selected
        return;
      }

      this.isUploadingImage = true;
      const formData = new FormData();
      formData.append('image', this.selectedImageFile);
      formData.append('festId', this.festId.toString());

      this.http.post('/api/upload-competition-image', formData).subscribe({
        next: (response: any) => {
          this.isUploadingImage = false;
          if (response.success && response.data?.filename) {
            this.competition.image = response.data.filename;
            resolve(response.data.filename);
          } else {
            this.errorMessage = response.message || 'Failed to upload image';
            reject(new Error(this.errorMessage));
          }
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.isUploadingImage = false;
          this.errorMessage = 'Failed to upload image: ' + (err.error?.message || err.message || 'Unknown error');
          reject(err);
          this.cdr.detectChanges();
        }
      });
    });
  }
}
