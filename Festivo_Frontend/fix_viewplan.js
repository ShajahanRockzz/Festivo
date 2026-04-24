const fs = require('fs');

let html = `<div class="view-plan-container fade-in-up">
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

  <!-- Delete Confirmation Modal -->
  <div *ngIf="showDeleteModal" class="modal-overlay" (click)="closeDeleteModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-message warning-modal">
        <div class="modal-icon">⚠️</div>
        <h2 class="modal-title">Delete Plan</h2>
        <p class="modal-text">
          Are you sure you want to delete the plan "<strong>{{ planToDelete?.plan_name }}</strong>"? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button class="modal-btn btn-danger neon-btn" (click)="onDeleteConfirm()">DELETE</button>
          <button class="modal-btn btn-cancel neon-btn" (click)="closeDeleteModal()">CANCEL</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Page Header -->
  <div class="page-header">
    <button class="back-nav-btn neon-btn" (click)="goBack()" title="Go back">← BACK</button>
    <div class="header-content">
      <h1>Subscription Plans</h1>
      <p class="subtitle">Manage your festival subscription plans</p>
    </div>
    <button class="create-btn neon-btn" (click)="createNewPlan()" title="Create new plan">
      <span>➕ NEW PLAN</span>
    </button>
  </div>

  <!-- Loading State -->
  <div *ngIf="isLoading" class="loading-spinner">
    <div class="spinner-content">
      <div class="spinner"></div>
      <p>Loading plans...</p>
    </div>
  </div>

  <!-- Plans Content -->
  <div *ngIf="!isLoading" class="plans-content">
    <!-- Search Bar -->
    <div class="search-container fade-in-up">
      <input
        type="text"
        class="search-input"
        placeholder="Search plans by name, description, days, or amount..."
        [(ngModel)]="searchQuery"
        (keyup)="filterPlans()"
        name="search"
      />
      <button
        class="clear-search-btn neon-btn" 
        *ngIf="searchQuery"
        (click)="clearSearch()"
        title="Clear search">
        ✖
      </button>
    </div>

    <!-- No Plans Message -->
    <div *ngIf="filteredPlans.length === 0" class="no-plans bento-card">
      <div class="no-plans-icon">📦</div>
      <h3>No Plans Found</h3>
      <p *ngIf="searchQuery">
        No plans match your search criteria. Try adjusting your search.
      </p>
      <p *ngIf="!searchQuery">
        No subscription plans yet. Create your first plan to get started.
      </p>
      <button class="btn-primary neon-btn" (click)="createNewPlan()" *ngIf="!searchQuery" style="margin-top: 16px;">
        Create First Plan
      </button>
    </div>

    <!-- Plans Grid -->
    <div class="plans-grid" *ngIf="filteredPlans.length > 0">
      <div *ngFor="let plan of filteredPlans" class="pricing-card-mockup">
        
        <!-- Plan Header -->
        <div class="pricing-card-header">
          <span class="pricing-card-name">{{ plan.plan_name }}</span>
        </div>

        <!-- Plan Price -->
        <div class="pricing-card-price">
          <span class="price-symbol">₹</span>
          <span class="price-amount">{{ plan.amount }}</span>
          <span class="price-duration">/ {{ plan.days }} days</span>
        </div>
        
        <div class="pricing-card-divider"></div>

        <!-- Plan Description -->
        <div class="pricing-card-body">
          <p class="pricing-card-desc">{{ plan.description }}</p>
        </div>

        <!-- Plan Actions -->
        <div class="plan-actions">
          <button
            class="btn-edit neon-btn"
            (click)="onEditClick(plan)"
            title="Edit plan">
            ✏️ Edit
          </button>
          <button
            class="btn-delete"
            (click)="openDeleteModal(plan)"
            title="Delete plan">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div class="results-info" *ngIf="filteredPlans.length > 0">
      <small>Showing {{ filteredPlans.length }} of {{ plans.length }} plan(s)</small>
    </div>
  </div>
</div>`;

fs.writeFileSync('src/app/Admin/viewplan/viewplan.html', html, 'utf8');

let scss = `.view-plan-container {
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
    flex: 1;
    h1 {
      font-size: 28px;
      margin-bottom: 8px;
      color: #fff;
    }
    .subtitle {
      margin: 0;
      color: var(--text-slate);
    }
  }

  .create-btn {
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.search-container {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  .search-input {
    width: 100%;
    padding: 16px 24px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
    }
  }

  .clear-search-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--text-slate);
    cursor: pointer;
    font-size: 16px;
    padding: 8px;

    &:hover {
      color: #ef4444;
    }
  }
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* Reused Pricing Card UI mapped to actual rows */
.pricing-card-mockup {
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  
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
    flex: 1; /* Pushes the actions to the bottom */
    
    .pricing-card-desc {
      color: var(--text-slate);
      font-size: 15px;
      line-height: 1.6;
      text-align: center;
    }
  }

  /* Actions mapping */
  .plan-actions {
    display: flex;
    gap: 16px;
    width: 100%;
    
    button {
      flex: 1;
      padding: 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .btn-edit {
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      
      &:hover {
        border-color: rgba(14, 165, 233, 0.4);
      }
    }
    
    .btn-delete {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
}

.no-plans {
  text-align: center;
  padding: 64px 24px;
  
  .no-plans-icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.8;
  }
  
  h3 {
    font-size: 24px;
    color: #fff;
    margin-bottom: 12px;
  }
  
  p {
    color: var(--text-slate);
    max-width: 400px;
    margin: 0 auto;
  }
}

.results-info {
  text-align: center;
  color: var(--text-slate);
  margin-top: 32px;
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
.warning-modal .modal-icon { color: #f59e0b; }

.modal-title { margin-bottom: 12px; font-size: 20px; color: #fff; }
.modal-message, .modal-text {
  color: var(--text-slate);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-btn {
  width: 100%;
}

.modal-actions {
  display: flex;
  gap: 16px;
  
  button {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }
  
  .btn-danger {
    background: #ef4444;
    color: #fff;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-slate);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }
}
`;

fs.writeFileSync('src/app/Admin/viewplan/viewplan.scss', scss, 'utf8');

console.log("viewplan applied successfully!");
