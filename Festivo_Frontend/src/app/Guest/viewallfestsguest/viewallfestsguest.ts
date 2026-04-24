import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Fest {
  fest_id: number;
  fest_name: string;
  fest_description: string;
  fest_image: string;
  category_name: string;
  startdate: Date;
  enddate: Date;
  institution_name: string;
  event_count: number;
  fest_for?: string;
}

@Component({
  selector: 'app-viewallfestsguest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewallfestsguest.html',
  styleUrls: ['../guesthome/guesthome.scss', './viewallfestsguest.scss']
})
export class Viewallfestsguest implements OnInit {
  availableFests: Fest[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  searchTerm: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAvailableFests();
  }

  loadAvailableFests() {
    // Calling the same endpoint /available as guesthome, which internally matches our criteria
    this.http.get<any>('http://localhost:3000/api/fest/available').subscribe({
      next: (response) => {
        if (response.success) {
          this.availableFests = response.data;
          // Extract unique categories for the filter
          const uniqueCategories = [...new Set(this.availableFests.map(f => f.category_name || 'General'))] as string[];
          this.categories = ['All', ...uniqueCategories];
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching fests:', error);
      }
    });
  }

  get filteredFests() {
    return this.availableFests.filter(fest => {
      const matchesCategory = this.selectedCategory === 'All' || (fest.category_name || 'General') === this.selectedCategory;
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = fest.fest_name.toLowerCase().includes(term) ||
                            fest.institution_name.toLowerCase().includes(term) ||
                            (fest.fest_description || '').toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  getFestImage(imageName: string | null | undefined): string {
    if (imageName) {
      return `http://localhost:3000/uploads/${imageName}`;
    }
    return 'http://localhost:3000/uploads/default_fest.jpg';
  }

  goToFestDetails(festId: number) {
    this.router.navigate(['/guestmaster/festdetailsguest', festId]);
  }
}
