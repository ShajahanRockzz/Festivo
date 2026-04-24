const fs = require('fs');

const htmlContent = `
<!-- Full Screen Loading Overlay -->
<div class="loading-overlay" *ngIf="isLoading">
  <div class="spinner-container">
    <div class="pulse-ring"></div>
    <div class="pulse-ring delay"></div>
    <div class="logo-spinner">F</div>
  </div>
  <p class="loading-text">Authenticating...</p>
</div>

<!-- Failed Login Toast -->
<div class="toast-error" [class.show]="errorMessage">
  <span class="toast-icon">??</span>
  <div>
    <h4>Authentication Failed</h4>
    <p>{{ errorMessage }}</p>
  </div>
  <button class="toast-close" (click)="errorMessage = ''">&times;</button>
</div>

<!-- Success State Transition -->
<div class="login-container" [class.fade-out]="isSuccess">
  <!-- Back Button -->
  <div class="back-button-container">
    <button class="back-btn" (click)="goBack()" title="Go back">
      <span class="back-arrow">?</span>
      <span class="back-text">Back</span>
    </button>
  </div>

  <div class="login-wrapper">
    <!-- Login Header with slide-right animation -->
    <div class="login-header animated-header">
      <div class="logo-section">
        <h1 class="app-title">Festivo</h1>
        <p class="tagline">Festival & Event Management<br>Platform</p>
      </div>
    </div>

    <!-- Glassmorphism Card -->
    <div class="login-content-wrapper">
      <div class="login-content floating-card">
        <h2>Sign In</h2>
        <p class="login-subtitle">Login to your account to access the platform</p>

        <!-- Login Form -->
        <form (ngSubmit)="submitLogin()" #loginForm="ngForm">
          
          <!-- Floating Label Username Field -->
          <div class="form-group floating-group">
            <input
              type="text"
              id="username"
              [(ngModel)]="loginData.username"
              name="username"
              placeholder=" "
              [disabled]="isLoading"
              required
              class="floating-input"
            />
            <label for="username" class="floating-label">Username</label>
            <div class="glow-border"></div>
          </div>

          <!-- Floating Label Password Field -->
          <div class="form-group floating-group">
            <div class="password-input-wrapper">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                [(ngModel)]="loginData.password"
                name="password"
                placeholder=" "
                [disabled]="isLoading"
                required
                class="floating-input"
              />
              <label for="password" class="floating-label">Password</label>
              <div class="glow-border"></div>
              
              <button
                type="button"
                class="btn-toggle-password"
                (click)="togglePasswordVisibility()"
                [disabled]="isLoading"
                tabindex="-1"
              >
                {{ showPassword ? '???' : '??' }}
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-login"
            [disabled]="isLoading || !loginForm.valid"
          >
            <span>Sign In</span>
          </button>
        </form>

        <!-- Additional Links -->
        <div class="login-footer">
          <p class="signup-text">
            Don't have an account?
            <a (click)="openRegisterModal()" class="signup-link">Sign up here</a> 
          </p>
          <p class="forgot-password">
            <a href="#" class="forgot-link">Forgot password?</a>
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="login-info animated-footer">
        <p>Select your role during registration to access the appropriate dashboard:</p>
        <div class="role-badges">
          <span class="badge badge-admin">????? Admin</span>
          <span class="badge badge-institution">??? Institution</span>
          <span class="badge badge-participant">?? Participant</span>
          <span class="badge badge-coordinator">?? Coordinator</span>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const scssContent = `
/* 1. Visual Depth & Radial Gradient Background */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* High-end radial black/navy gradient */
  background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  color: #fff;
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
  transition: opacity 0.8s ease-in-out;
  padding: 24px;
}

/* Success fade out */
.login-container.fade-out {
  opacity: 0;
  pointer-events: none;
}

.back-button-container {
  position: absolute;
  top: 40px;
  left: 40px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #94a3b8;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-4px);
  }
}

/* Flex Grid alignment for Hero vs Form */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  width: 100%;
  max-width: 1100px;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 40px;
  }
}

/* Logo Animation (Slide right & fade) */
.animated-header {
  flex: 1;
  opacity: 0;
  animation: slideRightFade 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes slideRightFade {
  0% { opacity: 0; transform: translateX(-40px); }
  100% { opacity: 1; transform: translateX(0); }
}

.app-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

.tagline {
  font-size: 1.25rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

/* Glassmorphism Card Settings */
.login-content-wrapper {
  flex: 1;
  max-width: 480px;
  width: 100%;
}

.floating-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: floatIn 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

@keyframes floatIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.login-content h2 {
  font-size: 2rem;
  margin: 0 0 8px;
  font-weight: 700;
}

.login-subtitle {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

/* Floating Labels & Input Focus State */
form {
  display: flex;
  flex-direction: column;
  gap: 24px; /* Increased gap */
}

.floating-group {
  position: relative;
  width: 100%;
}

.floating-input {
  width: 100%;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 20px 20px 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

/* Focus Glow */
.floating-input:focus {
  border-color: rgba(14, 165, 233, 0.6);
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.floating-label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  font-size: 1rem;
  z-index: 3;
}

/* Form transition logic: Float up on focus OR when not empty */
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label {
  top: 6px;
  transform: translateY(0);
  font-size: 0.7rem;
  color: #0ea5e9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.btn-toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  z-index: 10;
  padding: 4px;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background: #0284c7;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(14, 165, 233, 0.4);
  }
  
  &:disabled {
    background: #334155;
    color: #64748b;
    cursor: not-allowed;
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.95rem;
  
  .signup-link {
    color: #38bdf8;
    cursor: pointer;
    font-weight: 600;
    margin-left: 6px;
    &:hover { text-decoration: underline; }
  }
  
  .forgot-password {
    margin-top: 12px;
    a {
      color: #94a3b8;
      text-decoration: none;
      &:hover { color: #fff; }
    }
  }
}

/* Footer / Role Tilt Cards */
.login-info {
  margin-top: 32px;
  text-align: center;
  
  p {
    color: #64748b;
    font-size: 0.85rem;
    margin-bottom: 16px;
  }
}

.role-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.badge {
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  cursor: default;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Role Hover Tilt & Glow */
.badge-admin:hover { transform: perspective(200px) rotateX(10deg) rotateY(-10deg) translateY(-4px); background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); color: #fca5a5; }
.badge-institution:hover { transform: perspective(200px) rotateX(10deg) rotateY(10deg) translateY(-4px); background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2); color: #93c5fd; }
.badge-participant:hover { transform: perspective(200px) rotateX(-10deg) rotateY(-10deg) translateY(-4px); background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); color: #6ee7b7; }
.badge-coordinator:hover { transform: perspective(200px) rotateX(-10deg) rotateY(10deg) translateY(-4px); background: rgba(168, 85, 247, 0.2); border-color: rgba(168, 85, 247, 0.5); box-shadow: 0 10px 20px rgba(168, 85, 247, 0.2); color: #d8b4fe; }

/* -------------------------------------
 * MODERN OVERLAYS & FEEDBACK
 * ------------------------------------- */

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeInBase 0.3s ease;
}

@keyframes fadeInBase {
  from { opacity: 0; }
  to { opacity: 1; }
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #0ea5e9;
  border-radius: 50%;
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.pulse-ring.delay {
  animation-delay: 1s;
}

.logo-spinner {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  animation: pulseLogo 2s infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
@keyframes pulseLogo {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; color: #0ea5e9; }
}

.loading-text {
  color: #e2e8f0;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  animation: pulseLogo 2s infinite;
}

/* Toast Error (Shake & Glassmorphism) */
.toast-error {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: rgba(239, 68, 68, 0.15); /* Red glass */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
  min-width: 300px;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-error.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  animation: shakeError 0.5s cubic-bezier(.36,.07,.19,.97) both;
  animation-delay: 0.1s;
}

@keyframes shakeError {
  10%, 90% { transform: translateX(calc(-50% - 2px)) translateY(0); }
  20%, 80% { transform: translateX(calc(-50% + 4px)) translateY(0); }
  30%, 50%, 70% { transform: translateX(calc(-50% - 6px)) translateY(0); }
  40%, 60% { transform: translateX(calc(-50% + 6px)) translateY(0); }
}

.toast-icon { font-size: 1.5rem; }
.toast-error h4 { margin: 0 0 4px; color: #fca5a5; font-size: 1rem; }
.toast-error p { margin: 0; color: #fee2e2; font-size: 0.9rem; }
.toast-close {
  margin-left: auto;
  background: none;
  border: none;
  color: #fca5a5;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 4px;
}
.toast-close:hover { color: #fff; }
`;

fs.writeFileSync('src/app/Guest/login/login.html', htmlContent);
fs.writeFileSync('src/app/Guest/login/login.scss', scssContent);

console.log('Login modern UI generated successfully.');
