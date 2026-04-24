import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-coordinatorhome',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './coordinatorhome.html',
  styleUrl: './coordinatorhome.scss',
})
export class Coordinatorhome implements OnInit {
  coordinatorName = 'Coordinator';
  isLoading = true;

  stats = {
    assignedEvents: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalAttendees: 0
  };

  recentEvents: any[] = [];
  upcomingTasks: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role.toLowerCase() !== 'coordinator') {
      this.router.navigate(['/login']);
    } else {
      this.coordinatorName = currentUser.username || 'Coordinator';
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.stats = {
          assignedEvents: 5,
          completedTasks: 12,
          pendingTasks: 8,
          totalAttendees: 347
        };

        this.recentEvents = [
          { id: 1, name: 'Tech Fest 2025', date: new Date('2025-04-15'), status: 'upcoming' },
          { id: 2, name: 'Sports Championship', date: new Date('2025-03-20'), status: 'active' },
          { id: 3, name: 'Cultural Night', date: new Date('2025-05-10'), status: 'upcoming' }
        ];

        this.upcomingTasks = [
          { id: 1, title: 'Finalize venue setup', event: 'Tech Fest 2025', dueDate: new Date('2025-03-18'), priority: 'high' },
          { id: 2, title: 'Send invitations', event: 'Tech Fest 2025', dueDate: new Date('2025-03-19'), priority: 'medium' },
          { id: 3, title: 'Arrange equipment', event: 'Sports Championship', dueDate: new Date('2025-03-17'), priority: 'high' }
        ];

        this.isLoading = false;
        this.cdr.detectChanges();
      }, 800);
    });
  }
}
