import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  expanded?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-coordinatormaster',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './coordinatormaster.html',
  styleUrl: './coordinatormaster.scss',
})
export class Coordinatormaster implements OnInit {
  coordinatorName = 'Coordinator';
  coordinatorNameShort = '';
  loginId: number = 0;
  userProfileOpen = false;
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/coordinatormaster/coordinatorhome',
      icon: '📊'
    },
    {
      label: 'Assigned Fests',
      route: '/coordinatormaster/viewassignedfests',
      icon: '🎉'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0;
      this.coordinatorName = currentUser.username || 'Coordinator';
      console.log('Current user:', currentUser);
    }
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role.toLowerCase() !== 'coordinator') {
      this.router.navigate(['/login']);
    } else {
      this.fetchCoordinatorDetails();
    }
  }

  fetchCoordinatorDetails(): void {
    if (!this.loginId) {
      console.error('No login ID found');
      this.coordinatorName = 'Coordinator';
      return;
    }

    console.log('Fetching coordinator details for login ID:', this.loginId);
    this.http.get(`/api/login/user-details/${this.loginId}/Coordinator`).subscribe(
      (response: any) => {
        console.log('Coordinator details response:', response);
        const coordinatorData = response.userDetails || response.data || null;
        
        if (response.success && coordinatorData) {
          this.coordinatorName = coordinatorData.coordinator_name || 'Coordinator';
          this.coordinatorNameShort = this.generateShortForm(this.coordinatorName);
          console.log('Coordinator Details Set:', {
            name: this.coordinatorName,
            shortForm: this.coordinatorNameShort
          });
        } else {
          console.error('Invalid response structure:', response);
          this.coordinatorName = 'Coordinator';
        }
      },
      (error) => {
        console.error('Error fetching coordinator details:', error);
        this.coordinatorName = 'Coordinator';
      }
    );
  }

  generateShortForm(fullName: string): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  toggleMenu(item: MenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserProfile(): void {
    this.userProfileOpen = !this.userProfileOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    if (route !== '#') {
      this.router.navigate([route]);
    }
  }
}
