import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface Competition {
  competition_id?: number;
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
  selector: 'app-editcompetition',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './editcompetition.html',
  styleUrl: './editcompetition.scss',
})
export class Editcompetition implements OnInit {
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

  compId: number = 0;
  festId: number = 0;
  festName: string = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
    fieldErrors: { [key: string]: string } = {};
  minDate: string = '';

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
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.route.queryParams.subscribe(params => {
      this.compId = parseInt(params['compId']);
      this.festId = parseInt(params['festId']);
      
      if (this.compId && this.festId) {
        this.loadCompetitionDetails();
        this.loadFestDetails();
      }
    });
  }

  loadCompetitionDetails(): void {
    this.isLoading = true;

    this.http.get(`/api/competitions/${this.compId}`).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if (response.success && response.data) {
            this.competition = {
              competition_id: response.data.competition_id || this.compId,
              competition_name: response.data.competition_name,
              fest_id: response.data.fest_id,
              description: response.data.description,
              type: response.data.type,
              max_members: response.data.max_members,
              min_members: response.data.min_members,
              competition_date: response.data.competition_date,
              grouplimit: response.data.grouplimit,
              reg_fee: response.data.reg_fee,
              image: response.data.image || ''
            };
            
            // Set preview for existing image
            if (this.competition.image) {
              this.imagePreviewUrl = `/uploads/${this.competition.image}`;
            }
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.errorMessage = 'Error loading competition details';
          this.cdr.detectChanges();
        });
      }
    );
  }

  loadFestDetails(): void {
    this.http.get(`/api/fest/${this.festId}`).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if (response.success && response.data) {
            this.festName = response.data.fest_name;
            this.cdr.detectChanges();
          }
        });
      },
      (error) => {
        console.error('Error fetching fest details:', error);
      }
    );
  }

  onTypeChange(): void {
    this.fieldErrors = {};
    
    if (this.competition.type === 'single') {
      this.competition.min_members = 1;
      this.competition.max_members = 1;
    } else {
      this.competition.min_members = 1;
      this.competition.max_members = 2;
    }
    this.cdr.detectChanges();
  }

  validateForm(): boolean {
    this.fieldErrors = {};
    this.errorMessage = '';
    
    if (!this.competition.competition_name || !this.competition.competition_name.trim()) {
      this.fieldErrors['competition_name'] = 'Competition name is required';
    } else if (this.competition.competition_name.length < 3) {
      this.fieldErrors['competition_name'] = 'Competition name must be at least 3 characters';
    }
    
    if (!this.competition.description || !this.competition.description.trim()) {
      this.fieldErrors['description'] = 'Description is required';
    } else if (this.competition.description.length < 10) {
      this.fieldErrors['description'] = 'Description must be at least 10 characters';
    }
    
    if (!this.competition.type) {
      this.fieldErrors['type'] = 'Please select a competition type';
    }
    
    if (!this.competition.competition_date) {
      this.fieldErrors['competition_date'] = 'Competition date is required';
    } else {
      const selectedDate = new Date(this.competition.competition_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        this.fieldErrors['competition_date'] = 'Competition date must be today or in the future';
      }
    }
    
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
    
    if (!this.competition.grouplimit || this.competition.grouplimit < 1) {
      this.fieldErrors['grouplimit'] = 'This field is required and must be at least 1';
    }
    
    if (this.competition.reg_fee < 0) {
      this.fieldErrors['reg_fee'] = 'Registration fee cannot be negative';
    }
    
    if (Object.keys(this.fieldErrors).length > 0) {
      this.errorMessage = 'Please fix the errors below';
      this.cdr.detectChanges();
      return false;
    }
    
    return true;
  }

  updateCompetition(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    // If new image is selected, upload it first
    if (this.selectedImageFile) {
      this.uploadImage()
        .then(() => {
          // After image upload, update competition
          this.submitCompetitionUpdate();
        })
        .catch((err) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to upload image. Please try again.';
          alert(this.errorMessage);
          this.cdr.detectChanges();
        });
    } else {
      // No new image selected, directly update competition
      this.submitCompetitionUpdate();
    }
  }

  submitCompetitionUpdate(): void {
    this.http.put(`/api/competitions/${this.compId}`, this.competition).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.isSaving = false;
          if (response.success) {
            alert('Competition updated successfully!');
            this.router.navigate([`/Institution/festdetails/${this.festId}`]);
          } else {
            this.errorMessage = response.message || 'Error updating competition';
            alert(this.errorMessage);
          }
          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          this.isSaving = false;
          this.errorMessage = error.error?.message || 'Error updating competition';
          alert(this.errorMessage);
          this.cdr.detectChanges();
        });
      }
    );
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
