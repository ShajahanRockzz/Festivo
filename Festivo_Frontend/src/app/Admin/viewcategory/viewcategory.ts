import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Category {
  category_id: number;
  category_name: string;
  category_description: string;
  category_image: string;
}

@Component({
  selector: 'app-viewcategory',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './viewcategory.html',
  styleUrl: './viewcategory.scss',
})
export class Viewcategory implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showMessageModal = false;
  showDeleteConfirm = false;
  categoryToDelete: Category | null = null;
  searchQuery = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.get<any>('/api/category/all').subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.categories = response.data;
          this.filteredCategories = response.data;
        } else {
          this.categories = [];
          this.filteredCategories = [];
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load categories';
        this.showModal();
        this.cdr.detectChanges();
      }
    );
  }

  onDeleteClick(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  onDeleteCancel(): void {
    this.showDeleteConfirm = false;
    this.categoryToDelete = null;
    this.cdr.detectChanges();
  }

  onDeleteConfirm(): void {
    if (!this.categoryToDelete) return;

    const categoryId = this.categoryToDelete.category_id;
    this.showDeleteConfirm = false;

    this.http.delete<any>(`/api/category/delete/${categoryId}`).subscribe(
      (response) => {
        if (response.success) {
          // Remove from both lists using spread to trigger deep change detection
          this.categories = [...this.categories.filter(
            (c) => c.category_id !== categoryId
          )];
          this.filteredCategories = [...this.filteredCategories.filter(
            (c) => c.category_id !== categoryId
          )];
          this.cdr.detectChanges();

          this.successMessage = 'Category deleted successfully';
          this.showModal();
          this.cdr.detectChanges();
        } else {
          this.errorMessage = response.message || 'Failed to delete category';
          this.showModal();
          this.cdr.detectChanges();
        }
        this.categoryToDelete = null;
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Error deleting category';
        this.showModal();
        this.cdr.detectChanges();
        this.categoryToDelete = null;
      }
    );
  }

  showModal(): void {
    this.showMessageModal = true;
  }

  closeModal(): void {
    this.showMessageModal = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  filterCategories(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = this.categories;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCategories = this.categories.filter((category) => {
        return (
          category.category_name.toLowerCase().includes(query) ||
          category.category_description.toLowerCase().includes(query)
        );
      });
    }
    this.cdr.detectChanges();
  }

  onEditClick(category: Category): void {
    this.router.navigate(['/adminmaster/editcategory', category.category_id]);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredCategories = this.categories;
    this.cdr.detectChanges();
  }
}
