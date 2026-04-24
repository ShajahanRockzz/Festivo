import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface LoginFormData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginData: LoginFormData = {
    username: '',
    password: ''
  };

  isLoading = false;
  isSuccess = false;
  showPassword = false;
  rememberMe = false;
  errorMessage = '';
  successMessage = '';
  showRegisterModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // Load remembered username if exists
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.loginData.username = rememberedUsername;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openRegisterModal(): void {
    this.router.navigate(['/guestmaster/guesthome'], { queryParams: { showRegister: true } });
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  submitLogin(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.loginData.username.trim()) {
      this.errorMessage = 'Please enter your username';
      return;
    }

    if (!this.loginData.password) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Call login API
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.isLoading = false;

            if (response.success) {
              this.isSuccess = true;
              this.cdr.detectChanges();
              setTimeout(() => {
                // Handle "Remember Me"
                if (this.rememberMe) {
                  localStorage.setItem('rememberedUsername', this.loginData.username);
                } else {
                  localStorage.removeItem('rememberedUsername');
                }

                // Based on role, redirect to appropriate dashboard
                const role = response.user.role.toLowerCase();

                switch (role) {
                  case 'admin':
                    this.router.navigate(['/adminmaster/adminhome']);
                    break;
                  case 'institution':
                    this.router.navigate(['/Institution/home']);
                    break;
                  case 'participant':
                    this.router.navigate(['/participantmaster/participanthome']);
                    break;
                  case 'coordinator':
                    this.router.navigate(['/coordinatormaster/viewassignedfests']);
                    break;
                  default:
                    this.errorMessage = 'Unknown user role. Please contact administrator.';
                    this.cdr.detectChanges();
                }
              }, 800);
            } else {
              this.errorMessage = response.message || 'Login failed. Please try again.';
              this.cdr.detectChanges();
            }
          });
        }, 500);
      },
      (error: any) => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
            console.error('Login error:', error);
            this.cdr.detectChanges();
          });
        }, 500);
      }
    );
  }
}
