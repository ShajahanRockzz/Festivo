import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
}


@Component({
  selector: 'app-guesthome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guesthome.html',
  styleUrl: './guesthome.scss',
})
export class Guesthome implements OnInit {
  availableFests: Fest[] = [];

  showRegisterModal: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAvailableFests();
  }

  loadAvailableFests() {
    this.http.get<any>('http://localhost:3000/api/fest/available').subscribe({
      next: (response) => {
        if (response.success) {
          console.log('API returned success! Data:', response.data);
          this.availableFests = response.data;
          this.cdr.detectChanges(); // Force Angular to redraw the screen
        } else {
          console.log('API returned success=false');
        }
      },
      error: (error) => {
        console.error('Error fetching fests:', error);
      }
    });
  }

  getFestImage(imageName: string | null | undefined): string {
    if (imageName) {
      return `http://localhost:3000/uploads/${imageName}`;
    }
    return `http://localhost:3000/uploads/default_fest.jpg`;
  }

  goToFestDetails(festId: number) {
    this.router.navigate(['/guestmaster/festdetailsguest', festId]);
  }

  openRegisterModal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { showRegister: 'true' },
        queryParamsHandling: 'merge'
      });
    }, 500);
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  registerAsParticipant() {
    this.closeRegisterModal();
    this.router.navigate(['/guestmaster/registerparticipant']);
  }

  registerAsInstitution() {
    this.closeRegisterModal();
    this.router.navigate(['/guestmaster/registerinstitution']);
  }

  browseFestivals() {
    this.router.navigate(['/guestmaster/viewallfestsguest']);
  }
}


