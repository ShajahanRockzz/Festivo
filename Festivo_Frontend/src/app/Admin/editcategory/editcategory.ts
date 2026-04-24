import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface CategoryData {
  category_name: string;
  category_description: string;
  category_image?: File;
}

@Component({
  selector: 'app-editcategory',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './editcategory.html',
  styleUrl: './editcategory.scss',
})
export class Editcategory implements OnInit {
  categoryId: number | null = null;
  categoryData: CategoryData = {
    category_name: '',
    category_description: ''
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  selectedFileName: string = '';
  selectedFile: File | null = null;
  showMessageModal = false;
  existingImageName: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get category ID from route params
    this.route.params.subscribe((params) => {
      this.categoryId = parseInt(params['categoryId']);
      if (this.categoryId) {
        this.loadCategoryData();
      }
    });
  }

  loadCategoryData(): void {
    if (!this.categoryId) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.get<any>(`/api/category/${this.categoryId}`).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.categoryData = {
            category_name: response.data.category_name,
            category_description: response.data.category_description
          };
          this.existingImageName = response.data.category_image || '';
          // Show existing image as preview
          if (this.existingImageName) {
            this.imagePreview = '/uploads/' + this.existingImageName;
            this.selectedFileName = this.existingImageName;
          }
        } else {
          this.errorMessage = 'Category not found';
          this.showModal();
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load category';
        this.showModal();
        this.cdr.detectChanges();
      }
    );
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.errorMessage = 'Image size must be less than 5MB';
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only PNG, JPG, and GIF images are allowed';
      return;
    }

    // Store the file
    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.errorMessage = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFileName = '';
    this.selectedFile = null;
    this.existingImageName = '';
  }

  showModal(): void {
    this.showMessageModal = true;
  }

  closeModal(): void {
    this.showMessageModal = false;
    if (this.successMessage) {
      this.successMessage = '';
      // Redirect to view categories after success
      setTimeout(() => {
        this.router.navigate(['/adminmaster/viewcategory']);
      }, 500);
    }
  }

  submitForm(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.categoryData.category_name.trim()) {
      this.errorMessage = 'Category name is required';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (this.categoryData.category_name.length < 3) {
      this.errorMessage = 'Category name must be at least 3 characters';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (!this.categoryData.category_description.trim()) {
      this.errorMessage = 'Description is required';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (this.categoryData.category_description.length < 10) {
      this.errorMessage = 'Description must be at least 10 characters';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    if (!this.imagePreview && !this.existingImageName) {
      this.errorMessage = 'Category image is required';
      this.showModal();
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.cdr.detectChanges();

    // Create FormData if new image is selected, otherwise send normal data
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('category_name', this.categoryData.category_name.trim());
      formData.append('category_description', this.categoryData.category_description.trim());
      formData.append('category_image', this.selectedFile);

      this.updateCategory(formData, true);
    } else {
      // Update without image
      this.updateCategory(
        {
          category_name: this.categoryData.category_name.trim(),
          category_description: this.categoryData.category_description.trim()
        },
        false
      );
    }
  }

  updateCategory(data: any, isFormData: boolean): void {
    if (!this.categoryId) return;

    // For FormData, let the browser set Content-Type automatically
    // For JSON, explicitly set the Content-Type header
    let requestOptions: any = { responseType: 'json' };
    if (!isFormData) {
      requestOptions.headers = { 'Content-Type': 'application/json' };
    }

    this.http
      .put<any>(`/api/category/update/${this.categoryId}`, data, requestOptions)
      .subscribe(
        (response: any) => {
          this.isSaving = false;
          if (response && response.success) {
            this.successMessage = 'Category updated successfully!';
            this.showModal();
            this.cdr.detectChanges();
          } else {
            this.errorMessage = (response && response.message) || 'Error updating category';
            this.showModal();
            this.cdr.detectChanges();
          }
        },
        (error: any) => {
          this.isSaving = false;
          this.errorMessage = error?.error?.message || 'Error updating category. Please try again.';
          this.showModal();
          this.cdr.detectChanges();
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/adminmaster/viewcategory']);
  }
}
