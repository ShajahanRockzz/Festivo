const fs = require('fs');

const tsPath = 'src/app/Institution/buyplan/buyplan.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Add currentPlan, loginId, institutionId properties
if (!tsContent.includes('currentPlan: Plan | null')) {
    tsContent = tsContent.replace(
        'plans: Plan[] = [];',
        'plans: Plan[] = [];\n  currentPlan: Plan | null = null;\n  loginId: number = 0;\n  institutionId: number = 0;'
    );
}

// Ensure NgZone is imported
if (!tsContent.includes('NgZone')) {
    tsContent = tsContent.replace(
        "import { Component, ChangeDetectorRef, OnInit } from '@angular/core';",
        "import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';"
    );
}

// Add NgZone to constructor
if (!tsContent.includes('private ngZone')) {
    tsContent = tsContent.replace(
        'private authService: AuthService\n  ) {}',
        'private authService: AuthService,\n    private ngZone: NgZone\n  ) {\n    const currentUser = this.authService.getCurrentUser();\n    if (currentUser) {\n      this.loginId = currentUser.loginId || 0;\n    }\n  }'
    );
}

// Update loadPlans to fetchInstitutionAndPlans
if (!tsContent.includes('fetchInstitutionAndPlans')) {
    tsContent = tsContent.replace(
        /ngOnInit\(\): void \{\s*this\.loadPlans\(\);\s*\}/,
        `ngOnInit(): void {
    this.fetchInstitutionAndPlans();
  }

  fetchInstitutionAndPlans(): void {
    this.isLoading = true;
    if (!this.loginId) {
      this.loadPlans();
      return;
    }

    this.http.get(\`/api/login/user-details/\${this.loginId}/Institution\`).subscribe(
      (response: any) => {
        const institutionData = response.userDetails || response.data;
        if (response.success && institutionData) {
          this.institutionId = institutionData.institution_id || 0;
          this.fetchUpgradePlans();
        } else {
          this.loadPlans();
        }
      },
      (error) => {
        this.loadPlans();
      }
    );
  }

  fetchUpgradePlans(): void {
    if (!this.institutionId) {
      this.loadPlans();
      return;
    }

    this.http.get(\`/api/plans/higher-plans/\${this.institutionId}\`).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          if (response.success) {
            this.currentPlan = response.data.currentPlan;
            this.plans = response.data.availablePlans;
          } else {
            this.loadPlans();
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          this.loadPlans();
        });
      }
    );
  }`
    );
}

// We need formatRenewalDate function
if (!tsContent.includes('formatRenewalDate')) {
    tsContent = tsContent.replace(
        /\s*validateCvv\(\): void \{[\s\S]*?\}\s*\}/,
        `  validateCvv(): void {
    if (!this.paymentData.cvv) {
      this.paymentErrors['cvv'] = 'CVV is required';
    } else if (!/^\\d{3}$/.test(this.paymentData.cvv)) {
      this.paymentErrors['cvv'] = 'CVV must be 3 digits';
    } else {
      delete this.paymentErrors['cvv'];
    }
    this.cdr.detectChanges();
  }

  formatRenewalDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  }
}`
    );
}

// Add renewaldate?: string; to Plan interface
if (!tsContent.includes('renewaldate?: string')) {
    tsContent = tsContent.replace(
        'description: string;',
        'description: string;\n  renewaldate?: string;'
    );
}

fs.writeFileSync(tsPath, tsContent);

// NOW HTML
const htmlPath = 'src/app/Institution/buyplan/buyplan.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

const higherPlansSection = `  <!-- Current Plan Section -->
  <div class="current-plan-section" *ngIf="currentPlan" style="margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0056b3;">
    <h2>Your Current Plan</h2>
    <div class="current-plan-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <h3 style="margin: 0; font-size: 1.5rem; color: #333;">{{ currentPlan.plan_name }}</h3>
          <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">Current</span>
        </div>
        <p style="margin: 10px 0 5px 0;"><strong>Duration:</strong> {{ currentPlan.days }} days</p>
        <p style="margin: 5px 0;"><strong>Price:</strong> ₹{{ currentPlan.amount }}</p>
        <p style="margin: 5px 0;"><strong>Renewal Date:</strong> {{ formatRenewalDate(currentPlan.renewaldate) }}</p>
        <p style="margin: 5px 0 0 0; color: #666;">{{ currentPlan.description }}</p>
      </div>
    </div>
  </div>

  <!-- Plans Grid -->`;

if (!htmlContent.includes('Your Current Plan') && !htmlContent.includes('current-plan-section')) {
    htmlContent = htmlContent.replace('<!-- Plans Grid -->', higherPlansSection);
    // Also change the "Choose your Plan" text
    htmlContent = htmlContent.replace('<h1>Choose Your Plan</h1>', '<h1>{{ currentPlan ? "Upgrade Your Plan" : "Choose Your Plan" }}</h1>');
    htmlContent = htmlContent.replace(
      '<p class="subtitle">Select a plan to publish your festivals and manage competitions</p>', 
      '<p class="subtitle">{{ currentPlan ? "You are currently subscribed. Select a higher plan to upgrade." : "Select a plan to publish your festivals and manage competitions" }}</p>'
    );
}

fs.writeFileSync(htmlPath, htmlContent);
console.log('Modified buyplan.ts and buyplan.html');
