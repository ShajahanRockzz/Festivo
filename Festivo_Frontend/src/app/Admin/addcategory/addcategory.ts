import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface CategoryData {
  category_name: string;
  category_description: string;
  category_image?: File;
}

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './addcategory.html',
  styleUrl: './addcategory.scss',
})
export class Addcategory {
  categoryData: CategoryData = {
    category_name: '',
    category_description: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  selectedFileName: string = '';
  selectedFile: File | null = null;
  showMessageModal = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

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
  }

  showModal(): void {
    this.showMessageModal = true;
  }

  closeModal(): void {
    this.showMessageModal = false;
    if (this.successMessage) {
      this.successMessage = '';
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
      return;
    }

    if (this.categoryData.category_name.length < 3) {
      this.errorMessage = 'Category name must be at least 3 characters';
      this.showModal();
      return;
    }

    if (!this.categoryData.category_description.trim()) {
      this.errorMessage = 'Description is required';
      this.showModal();
      return;
    }

    if (this.categoryData.category_description.length < 10) {
      this.errorMessage = 'Description must be at least 10 characters';
      this.showModal();
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Category image is required';
      this.showModal();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('category_name', this.categoryData.category_name.trim());
    formData.append('category_description', this.categoryData.category_description.trim());
    formData.append('category_image', this.selectedFile);

    // Call API to add category
    this.http
      .post('/api/category/add', formData)
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Category added successfully!';
            this.showModal();
            this.resetForm();
            this.cdr.detectChanges();
          } else {
            this.errorMessage = response.message || 'Error adding category';
            this.showModal();
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error adding category. Please try again.';
          this.showModal();
          this.cdr.detectChanges();
        }
      );
  }

  resetForm(): void {
    this.categoryData = {
      category_name: '',
      category_description: ''
    };
    this.imagePreview = null;
    this.selectedFileName = '';
    this.selectedFile = null;
    this.errorMessage = '';
  }
}
