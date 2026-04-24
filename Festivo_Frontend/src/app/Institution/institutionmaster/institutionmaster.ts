import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
  queryParams?: { [key: string]: string };
}

@Component({
  selector: 'app-institutionmaster',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './institutionmaster.html',
  styleUrl: './institutionmaster.scss',
})
export class Institutionmaster implements OnInit {
  institutionName = 'Institution';
  institutionNameShort = '';
  institutionFullName = '';
  institutionId: number = 0;
  loginId: number = 0;
  userProfileOpen = false;
  sidebarOpen = true;
  
  // Subscription plan properties
  subscriptionPlan: string = 'No Plan';
  subscriptionLoading = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/Institution/home',
      icon: '📊'
    },
    {
      label: 'Fests',
      route: '#',
      icon: '🎉',
      expanded: false,
      submenu: [
        { label: 'Create Fest', route: '/Institution/createfest', icon: '➕' },
        { label: 'View All Fests', route: '/Institution/viewfest', icon: '👁️' }
      ]
    },
    {
      label: 'Competitions',
      route: '#',
      icon: '🏆',
      expanded: false,
      submenu: [
        { label: 'View Competitions', route: '/Institution/selectfest', icon: '👁️', queryParams: { action: 'viewcompetitions' } },
        { label: 'View Result', route: '/Institution/selectfest', icon: '📊', queryParams: { action: 'viewresult' } }
      ]
    },
    {
      label: 'Coordinators',
      route: '#',
      icon: '👥',
      expanded: false,
      submenu: [
        { label: 'Add Coordinator', route: '/Institution/addcoordinator', icon: '➕' },
        { label: 'View Coordinators', route: '/Institution/viewcoordinators', icon: '👁️' }
      ]
    },
    {
      label: 'Reports',
      route: '#',
      icon: '📋',
      expanded: false,
      submenu: [
        { label: 'Student Participation', route: '/Institution/studentparticipationreport', icon: '📈' },
        { label: 'Fest Revenue', route: '/Institution/festrevenuereport', icon: '💰' },
        { label: 'Prize Report', route: '/Institution/prizereport', icon: '🏆' }
      ]
    },
    {
      label: 'Buy Plan',
      route: '/Institution/buyplan',
      icon: '💳'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loginId = currentUser.loginId || 0; // Backend returns 'loginId' not 'login_id'
      console.log('Current user:', currentUser);
      console.log('Login ID extracted:', this.loginId);
    }
  }

  ngOnInit(): void {
    // Check if user is an institution
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role.toLowerCase() !== 'institution') {
      this.router.navigate(['/login']);
    } else {
      // Fetch institution details using login_id
      this.fetchInstitutionDetails();
      
      // Listen for subscription updates from other components
      window.addEventListener('subscriptionUpdated', () => {
        console.log('Subscription updated event received');
        this.fetchSubscriptionPlan();
            this.cdr.detectChanges();
          });
    }
  }

  fetchInstitutionDetails(): void {
    // Fetch institution details using login_id
    if (!this.loginId) {
      console.error('No login ID found');
      this.institutionName = 'Institution';
      return;
    }

    console.log('Fetching institution details for login ID:', this.loginId);
    this.http.get(`/api/login/user-details/${this.loginId}/Institution`).subscribe(
      (response: any) => {
        console.log('Institution details response:', response);
        // Backend returns 'userDetails' not 'data'
        const institutionData = response.userDetails || response.data || null;
        
        if (response.success && institutionData) {
          this.institutionFullName = institutionData.institution_name || 'Institution';
          this.institutionId = institutionData.institution_id || 0;
          this.institutionName = this.generateShortForm(this.institutionFullName);
          console.log('Institution Details Set:', {
            fullName: this.institutionFullName,
            shortForm: this.institutionName,
            institutionId: this.institutionId
          });
          // Fetch subscription plan after current change detection cycle completes
          Promise.resolve().then(() => {
            this.fetchSubscriptionPlan();
            this.cdr.detectChanges();
          });
        } else {
          console.error('Invalid response structure:', response);
          this.institutionName = 'Institution';
        this.cdr.detectChanges();
      }
      },
      (error) => {
        console.error('Error fetching institution details:', error);
        this.institutionName = 'Institution';
        this.cdr.detectChanges();
      }
    );
  }

  generateShortForm(fullName: string): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3); // Limit to 3 characters
  }

  toggleMenu(item: MenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }

  toggleUserProfile(): void {
    this.userProfileOpen = !this.userProfileOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
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

  fetchSubscriptionPlan(): void {
    if (!this.institutionId) {
      console.log('No institution ID, skipping subscription fetch');
      this.subscriptionPlan = 'No Plan';
      return;
    }

    this.subscriptionLoading = true;
    console.log('Fetching subscription for institution:', this.institutionId);
    
    this.http.get(`/api/fest/check-subscription/${this.institutionId}`).subscribe(
      (response: any) => {
        console.log('Subscription response:', response);
        if (response.success && response.hasSubscription && response.subscription) {
          this.subscriptionPlan = response.subscription.plan_name || 'Active Plan';
          console.log('Subscription plan set to:', this.subscriptionPlan);
        } else {
          this.subscriptionPlan = 'No Active Plan';
        }
        this.subscriptionLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        this.subscriptionPlan = 'No Plan';
        this.subscriptionLoading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
