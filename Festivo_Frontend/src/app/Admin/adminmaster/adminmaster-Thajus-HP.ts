import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  expanded: boolean;
  submenu?: Array<{ label: string; route: string; icon: string }>;
}

@Component({
  selector: 'app-adminmaster',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './adminmaster.html',
  styleUrl: './adminmaster.scss',
})
export class Adminmaster {
  adminName = 'Admin';
  userProfileOpen = false;
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      expanded: false,
      submenu: [
        { label: 'Overview', route: '/adminmaster/adminhome', icon: '📈' }
      ]
    },
    {
      label: 'Category',
      icon: '📁',
      expanded: false,
      submenu: [
        { label: 'Add Category', route: '/adminmaster/addcategory', icon: '➕' },
        { label: 'View Category', route: '/adminmaster/viewcategory', icon: '👁️' }
      ]
    },
    {
      label: 'Subscription Plan',
      icon: '💳',
      expanded: false,
      submenu: [
        { label: 'Create Subscription Plan', route: '/adminmaster/createplan', icon: '➕' },
        { label: 'View Subscription Plan', route: '/adminmaster/viewplan', icon: '👁️' }
      ]
    },
    {
      label: 'Report',
      icon: '📊',
      expanded: false,
      submenu: [
        { label: 'View All Revenue', route: '#', icon: '💰' },
        { label: 'Admin Revenue', route: '#', icon: '📈' }
      ]
    },
    {
      label: 'Users',
      icon: '👥',
      expanded: false,
      submenu: [
        { label: 'View All Users', route: '/adminmaster/viewallusers', icon: '👁️' }
      ]
    },
    {
      label: 'Guests',
      icon: '🧑',
      expanded: false,
      submenu: [
        { label: 'Guest Message', route: '#', icon: '💬' }
      ]
    }
  ];

  constructor(private router: Router, private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.adminName = currentUser.username || 'Admin';
    }
  }

  toggleMenu(item: MenuItem): void {
    item.expanded = !item.expanded;
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

