const fs = require('fs');

let html = `<div class="edit-plan-container fade-in-up">
  <!-- Message Modal/Popup -->
  <div *ngIf="showMessageModal" class="modal-overlay" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div *ngIf="errorMessage" class="modal-message error-modal">
        <div class="modal-icon">✖</div>
        <h2 class="modal-title">Error</h2>
        <p class="modal-text">{{ errorMessage }}</p>
        <button class="modal-btn neon-btn" (click)="closeModal()">CLOSE</button>
      </div>

      <div *ngIf="successMessage" class="modal-message success-modal">
        <div class="modal-icon">✓</div>
        <h2 class="modal-title">Success</h2>
        <p class="modal-text">{{ successMessage }}</p>
        <button class="modal-btn neon-btn" (click)="closeModal()">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div *ngIf="isLoading" class="loading-spinner">
    <div class="spinner-content">
      <div class="spinner"></div>
      <p>Loading plan...</p>
    </div>
  </div>

  <!-- Page Header -->
  <div *ngIf="!isLoading" class="page-header">
    <button class="back-nav-btn neon-btn" (click)="goBack()" title="Go back">← BACK</button>
    <div class="header-content">
      <h1>Edit Subscription Plan</h1>
      <p class="subtitle">Update subscription plan details</p>
    </div>
  </div>

  <!-- Form Container -->
  <div *ngIf="!isLoading" class="form-wrapper grid-wrapper">
    <div class="form-card bento-card">
      <!-- Form -->
      <form (ngSubmit)="submitForm()" #planForm="ngForm">
        <!-- Plan Name Field -->
        <div class="form-group">
          <label for="planName" class="form-label">Plan Name <span class="required">*</span></label>
          <input
            type="text"
            id="planName"
            class="form-input"
            placeholder="e.g., Premium Plan"
            [(ngModel)]="planData.plan_name"
            name="plan_name"
            required
            minlength="3"
            maxlength="100"
          />
        </div>

        <!-- Duration Field -->
        <div class="form-group">
          <label for="days" class="form-label">Duration (Days) <span class="required">*</span></label>
          <input
            type="number"
            id="days"
            class="form-input"
            placeholder="e.g., 30"
            [(ngModel)]="planData.days"
            name="days"
            required
            min="1"
          />
        </div>

        <!-- Amount Field -->
        <div class="form-group">
          <label for="amount" class="form-label">Amount (₹) <span class="required">*</span></label>
          <input
            type="text"
            id="amount"
            class="form-input"
            placeholder="Enter amount"
            [(ngModel)]="planData.amount"
            name="amount"
            required
          />
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description" class="form-label">Description <span class="required">*</span></label>
          <textarea
            id="description"
            class="form-textarea"
            placeholder="Enter detailed plan description"
            [(ngModel)]="planData.description"
            name="description"
            required
            minlength="10"
            maxlength="500"
            rows="4"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary neon-btn"
            [disabled]="isSaving || !planForm.valid"
          >
            <span *ngIf="!isSaving">Update Plan</span>
            <span *ngIf="isSaving">Updating...</span>
          </button>
          <button
            type="button"
            class="btn-secondary neon-btn"
            (click)="goBack()"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Plan Information -->
      <div class="info-box bento-card" style="margin-top: 24px;">
        <h3>📌 Plan Information</h3>
        <ul class="info-list">
          <li>Update plan details to reflect accurate information</li>
          <li>Amount should be in Indian Rupees (₹)</li>
          <li>Duration represents how long the plan is valid</li>
          <li>Changes will be visible to participants immediately</li>
        </ul>
      </div>
    </div>

    <!-- Plan Preview Card -->
    <div class="preview-section bento-card">
      <h3 class="section-title">PLAN PREVIEW</h3>
      
      <div class="pricing-card-mockup">
        <div class="pricing-card-header">
          <span class="pricing-card-name" *ngIf="planData.plan_name">{{ planData.plan_name }}</span>
          <span class="pricing-card-name empty" *ngIf="!planData.plan_name">Plan Name</span>
        </div>
        
        <div class="pricing-card-price">
          <span class="price-symbol">₹</span>
          <span class="price-amount" *ngIf="planData.amount">{{ planData.amount }}</span>
          <span class="price-amount empty" *ngIf="!planData.amount">0</span>
          <span class="price-duration" *ngIf="planData.days">/ {{ planData.days }} days</span>
        </div>
        
        <div class="pricing-card-divider"></div>
        
        <div class="pricing-card-body">
          <p class="pricing-card-desc" *ngIf="planData.description">{{ planData.description }}</p>
          <p class="pricing-card-desc empty" *ngIf="!planData.description">Plan description will appear here...</p>
        </div>
        
        <button class="pricing-card-btn" type="button" tabindex="-1">Choose Plan</button>
      </div>
    </div>
  </div>
</div>`;

fs.writeFileSync('src/app/Admin/editplan/editplan.html', html, 'utf8');

let scss = `.edit-plan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;

  .back-nav-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-slate);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }

  .header-content {
    h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }
    .subtitle {
      margin: 0;
      color: var(--text-slate);
    }
  }
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-slate);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.btn-primary {
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  color: var(--text-slate);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
}

.info-box {
  margin-top: 24px;
  h3 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #fff;
  }
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      position: relative;
      padding-left: 24px;
      margin-bottom: 12px;
      color: var(--text-slate);
      line-height: 1.5;
      
      &:before {
        content: '•';
        position: absolute;
        left: 8px;
        color: #0ea5e9;
      }
    }
  }
}

/* Plan Preview Card Styles */
.preview-section {
  display: flex;
  flex-direction: column;
  padding: 40px;
  
  .section-title {
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    margin-bottom: 32px;
    width: 100%;
    text-align: left;
  }
  
  .pricing-card-mockup {
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 32px;
    margin: auto auto;
    width: 100%;
    max-width: 360px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0ea5e9, #6366f1);
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -10px rgba(14, 165, 233, 0.2);
      border-color: rgba(14, 165, 233, 0.3);
    }

    .pricing-card-header {
      margin-bottom: 24px;
      text-align: center;
      
      .pricing-card-name {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        text-transform: capitalize;
        
        &.empty {
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
    
    .pricing-card-price {
      text-align: center;
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
      align-items: baseline;
      
      .price-symbol {
        font-size: 24px;
        color: #0ea5e9;
        margin-right: 4px;
        font-weight: 600;
      }
      
      .price-amount {
        font-size: 56px;
        font-weight: 800;
        color: #fff;
        line-height: 1;
        
        &.empty {
          color: rgba(255, 255, 255, 0.3);
        }
      }
      
      .price-duration {
        font-size: 16px;
        color: var(--text-slate);
        margin-left: 8px;
        font-weight: 500;
      }
    }
    
    .pricing-card-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 24px 0;
    }
    
    .pricing-card-body {
      margin-bottom: 32px;
      min-height: 80px;
      
      .pricing-card-desc {
        color: var(--text-slate);
        font-size: 15px;
        line-height: 1.6;
        text-align: center;
        
        &.empty {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }
      }
    }
    
    .pricing-card-btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-slate);
      padding: 14px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: default;
      transition: all 0.3s ease;
    }
    
    &:hover .pricing-card-btn {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
      color: #fff;
      border-color: rgba(14, 165, 233, 0.4);
    }
  }
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  .spinner-content {
    text-align: center;
    
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(14, 165, 233, 0.2);
      border-top-color: #0ea5e9;
      border-radius: 50%;
      animation: spin 1s infinite linear;
      margin: 0 auto 16px;
    }

    p {
      color: var(--text-slate);
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


/* MODALS */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-slate);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.error-modal .modal-icon { color: #ef4444; }
.success-modal .modal-icon { color: #22c55e; }

.modal-title { margin-bottom: 12px; font-size: 20px; color: #fff; }
.modal-message, .modal-text {
  color: var(--text-slate);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-btn {
  width: 100%;
}
`;

fs.writeFileSync('src/app/Admin/editplan/editplan.scss', scss, 'utf8');
console.log('Edit plan applied!');
