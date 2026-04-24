const fs = require('fs');
const cleanHTML = `
<div class="add-category-container fade-in-up">
  <!-- Message Modal/Popup -->
  <div *ngIf="showMessageModal" class="modal-overlay" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div *ngIf="errorMessage" class="modal-message error-modal">
        <div class="modal-icon">✖</div>
        <h2 class="modal-title">Error</h2>
        <p class="modal-text">{{ errorMessage }}</p>
        <button class="modal-btn" (click)="closeModal()">Close</button>
      </div>

      <div *ngIf="successMessage" class="modal-message success-modal">
        <div class="modal-icon">✓</div>
        <h2 class="modal-title">Success</h2>
        <p class="modal-text">{{ successMessage }}</p>
        <button class="modal-btn" (click)="closeModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Page Header -->
  <div class="page-header">
    <button class="back-nav-btn" (click)="goBack()">← BACK</button>
    <h1>Edit Category</h1>
    <p class="subtitle">Update the details for this category</p>
  </div>

  <div *ngIf="isLoading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading category data...</p>
  </div>

  <!-- Form Container -->
  <div class="form-wrapper grid-wrapper" *ngIf="!isLoading">
    <div class="form-card bento-card">
      <!-- Form -->
      <form (ngSubmit)="submitForm()" #categoryForm="ngForm">
        <!-- Category Name Field -->
        <div class="form-group">
          <label for="categoryName" class="form-label">Category Name <span class="required">*</span></label>
          <input
            type="text"
            id="categoryName"
            class="form-input"
            placeholder="Enter category name"
            [(ngModel)]="categoryData.category_name"
            name="category_name"
            required
            minlength="3"
            maxlength="100"
          />
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description" class="form-label">Description <span class="required">*</span></label>
          <textarea
            id="description"
            class="form-textarea"
            placeholder="Enter category description"
            [(ngModel)]="categoryData.category_description"
            name="category_description"
            required
            minlength="10"
            maxlength="500"
            rows="5"
          ></textarea>
        </div>

        <!-- Category Image Field -->
        <div class="form-group">
          <label for="categoryImage" class="form-label">Category Image</label>
          <div class="image-upload-wrapper">
            <input
              type="file"
              id="categoryImage"
              class="file-input"
              (change)="onImageSelected($event)"
              accept="image/*"
              #imageInput
            />
            <label for="categoryImage" class="file-input-label">
              <span class="upload-icon">📤</span>
              <span class="upload-text">Click to change image</span>
              <span class="upload-hint">PNG, JPG, GIF up to 5MB</span>
            </label>
          </div>
        </div>

        <!-- Image Preview -->
        <div *ngIf="imagePreview || existingImageName" class="image-preview-wrapper">
          <div class="preview-container">
            <img *ngIf="imagePreview" [src]="imagePreview" alt="Category preview" class="preview-image" />
            <button
              type="button"
              class="remove-image-btn"
              (click)="removeImage()"
              title="Remove image"
            >
              ✖
            </button>
          </div>
          <p class="preview-filename">{{ selectedFileName }}</p>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary neon-btn"
            [disabled]="isSaving || !categoryForm.valid || (!selectedFile && !existingImageName)"
          >
            <span *ngIf="!isSaving">Update Category</span>
            <span *ngIf="isSaving">Updating...</span>
          </button>
          <button
            type="button"
            class="btn-secondary"
            (click)="goBack()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Info Box -->
    <div class="info-box bento-card">
      <h3>📌 Edit Information</h3>
      <ul class="info-list">
        <li>Update the details for this category</li>
        <li>Uploading a new image will replace the current one</li>
        <li>Changes are immediate once updated</li>
      </ul>
    </div>
  </div>
</div>`;

fs.writeFileSync('src/app/Admin/editcategory/editcategory.html', cleanHTML, 'utf8');
console.log('Fixed editcategory.html successfully!');