import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DashboardStats {
  totalInstitutions: number;
  totalParticipants: number;
  totalCoordinators: number;
  totalFestivals: number;
  totalCompetitions: number;
  activeFestivals: number;
  totalPayments: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-adminhome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminhome.html',
  styleUrl: './adminhome.scss',
})
export class Adminhome implements OnInit {
  adminName = 'Admin';
  stats: DashboardStats = {
    totalInstitutions: 3,
    totalParticipants: 3,
    totalCoordinators: 3,
    totalFestivals: 7,
    totalCompetitions: 3,
    activeFestivals: 4,
    totalPayments: 5,
    totalRevenue: 36998
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
      this.router.navigate(['/login']);
    } else {
      this.adminName = currentUser.username || 'Admin';
    }
    
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // TODO: Replace with actual API calls when backend is ready
    // For now, using hardcoded data from the database
  }

  logout(): void {
    this.authService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}

