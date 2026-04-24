import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-participantmaster',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './participantmaster.html',
  styleUrl: './participantmaster.scss',
})
export class Participantmaster implements OnInit {
  isMenuOpen = false;
  participantName = 'Participant';

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role.toLowerCase() !== 'participant') {
      this.router.navigate(['/login']);
      return;
    }

    this.participantName = currentUser.username || currentUser.name || 'Participant';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.isMenuOpen = false;
    this.authService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}
