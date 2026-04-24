import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guestmaster',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './guestmaster.html',
  styleUrl: './guestmaster.scss',
})
export class Guestmaster implements OnInit, OnDestroy {
  showRegisterModal: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Check for showRegister query parameter
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['showRegister'] === 'true') {
        this.showRegisterModal = true;
        document.body.style.overflow = 'hidden';
      } else {
        this.showRegisterModal = false;
        document.body.style.overflow = '';
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  openRegisterModal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      this.showRegisterModal = true;
      document.body.style.overflow = 'hidden';
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { showRegister: 'true' },
        queryParamsHandling: 'merge'
      });
    }, 500);
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    document.body.style.overflow = '';
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { showRegister: null },
      queryParamsHandling: 'merge'
    });
  }

  registerAsParticipant() {
    this.closeRegisterModal();
    this.router.navigate(['/guestmaster/registerparticipant']);
  }

  registerAsInstitution() {
    this.closeRegisterModal();
    this.router.navigate(['/guestmaster/registerinstitution']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
