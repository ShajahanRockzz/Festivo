import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_description: string;
  fest_image: string;
  startdate: string;
  enddate: string;
  fest_for: string;
  institution_name?: string;
  category_name?: string;
  event_count?: number;
}

@Component({
  selector: 'app-viewallfests',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './viewallfests.html',
  styleUrl: './viewallfests.scss',
})
export class Viewallfests implements OnInit {
  fests: Fest[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  selectedCategory = 'all';
  selectedAudience = 'all';
  categories: string[] = ['all'];
  audiences: string[] = ['all'];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFests();
  }

  loadCategories(): void {
    this.http.get('/api/category/all').subscribe({
      next: (response: any) => {
        const catData = response.data || [];
        const rawCategories = catData.map((c: any) => c.category_name);
        const catTrc: string[] = Array.from<string>(new Set<string>(rawCategories.map((c: any) => (c || '').trim().toLowerCase()))).filter((c: string) => c.length > 0);
        this.categories = ['all', ...catTrc];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadFests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get('/api/fest/available').subscribe({
      next: (response: any) => {
        this.fests = response.data || response || [];
        this.audiences = ['all', ...this.getUniqueValues(this.fests, 'fest_for')];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading fests:', err);
        this.errorMessage = 'Failed to load available fests.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(imageName: string): string {
    if (!imageName) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    return `/uploads/${imageName}`;
  }

  get filteredFests(): Fest[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.fests.filter((fest) => {
      const matchesSearch = !term
        || fest.fest_name.toLowerCase().includes(term)
        || fest.fest_description.toLowerCase().includes(term)
        || (fest.institution_name || '').toLowerCase().includes(term);

      const matchesCategory = this.selectedCategory === 'all'
        || (fest.category_name || '').toLowerCase() === this.selectedCategory;

      const matchesAudience = this.selectedAudience === 'all'
        || (fest.fest_for || '').toLowerCase() === this.selectedAudience;

      return matchesSearch && matchesCategory && matchesAudience;
    });
  }

  private getUniqueValues(items: Fest[], key: 'category_name' | 'fest_for'): string[] {
    const values = items
      .map((item) => (item[key] || '').trim())
      .filter((value) => value.length > 0);

    return Array.from(new Set(values))
      .sort((a, b) => a.localeCompare(b))
      .map((value) => value.toLowerCase());
  }

  getFestImage(imagePath: string | null | undefined): string {
    const defaultImage = 'http://localhost:3000/uploads/default_fest.jpg';

    if (!imagePath) {
      return defaultImage;
    }

    const normalizedPath = imagePath.replace(/\\/g, '/').trim();
    if (!normalizedPath) {
      return defaultImage;
    }

    if (normalizedPath.startsWith('http')) {
      return normalizedPath;
    }

    if (normalizedPath.startsWith('/uploads/')) {
      return `http://localhost:3000${normalizedPath}`;
    }

    if (normalizedPath.startsWith('uploads/')) {
      return `http://localhost:3000/${normalizedPath}`;
    }

    return `http://localhost:3000/uploads/${normalizedPath}`;
  }

  viewFestDetails(festId: number) {
    this.router.navigate(['/participantmaster/festdetailsparticipant', festId]);
  }
}



