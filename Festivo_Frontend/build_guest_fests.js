const fs = require('fs');

const htmlContent = 
<!-- Main container for viewing all fests -->
<section class="festivals-section" id="fests">
  <div class="container relative-z">
    
    <div class="page-header">
      <div>
        <h1 class="premium-title">All Active Festivals</h1>
        <p class="premium-subtitle">Discover and register for amazing campus events</p>
      </div>
      <div class="header-badge">
        <span>{{ filteredFests.length }}</span>
        <span class="badge-label">Showing</span>
      </div>
    </div>

    <!-- Storage Dock for Filters -->
    <div class="filters-bar floating-dock">
      <div class="search-field">
        <i class="feather icon-search search-icon"></i>
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search festivals or institutions..." 
        />
      </div>

      <div class="select-group festival-dock-filters">
        <button *ngFor="let cat of categories"
                class="filter-btn"
                [class.active]="selectedCategory === cat"
                (click)="selectedCategory = cat">
          {{ cat }}
          <div class="glow-indicator" *ngIf="selectedCategory === cat"></div>
        </button>
      </div>
    </div>

    <!-- No Festivals Message -->
    <div class="empty-state glass-panel" *ngIf="filteredFests.length === 0">
      <div class="icon-wrap"><i class="feather icon-search"></i></div>
      <h3>No festivals found.</h3>
      <p>Try adjusting your search or filters!</p>
    </div>

    <!-- Bento Grid Architecture -->
    <div class="bento-grid" *ngIf="filteredFests.length > 0">
      <div class="floating-card fest-card" *ngFor="let fest of filteredFests; let i = index" [style.--animation-order]="i">
        
        <div class="fest-image-wrapper">
          <img [src]="getFestImage(fest.fest_image)" [alt]="fest.fest_name" class="fest-image" />
          <div class="image-mask"></div>
          <span class="fest-category"> {{ fest.category_name || 'General' }}</span>
        </div>
        
        <div class="fest-info">
          <h3 class="fest-title">{{ fest.fest_name }}</h3>
          <p class="fest-description">{{ fest.fest_description }}</p>
          
          <div class="bento-details">
            <div class="detail-item full-width">
              <span class="meta-label">DATES</span>
              <span class="meta-value">{{ fest.startdate | date: 'MMM dd' }} - {{ fest.enddate | date: 'MMM dd, yyyy' }}</span>
            </div>
            <div class="detail-item" *ngIf="fest.institution_name">
              <span class="meta-label">INSTITUTION</span>
              <span class="meta-value">{{ fest.institution_name }}</span>
            </div>
            <div class="detail-item">
              <span class="meta-label">EVENTS</span>
              <span class="meta-value">{{ fest.event_count || 0 }}</span>
            </div>
            <div class="detail-item full-width">
              <span class="meta-label">AUDIENCE</span>
              <span class="meta-value" style="text-transform: capitalize;">{{ fest.fest_for || 'Everyone' }}</span>
            </div>
          </div>
          
          <button class="btn-ghost-glow" (click)="goToFestDetails(fest.fest_id)">View Details</button>
        </div>
      </div>
      
      <!-- Empty State Balance Card -->
      <div class="floating-card coming-soon-card" *ngIf="filteredFests.length === 1" [style.--animation-order]="1">
        <div class="coming-soon-content">
          <div class="sparkle-icon">?</div>
          <h3 class="coming-soon-title">More Fests Soon</h3>
          <p>New universities and institutions are joining the platform every week. Stay tuned!</p>
        </div>
      </div>

    </div>
  </div>
</section>
;

const scssContent = \
.festivals-section {
  padding: 80px 24px;
  max-width: 1280px;
  margin: 0 auto;
  color: #fff;
  font-family: 'Inter', -apple-system, sans-serif;
  min-height: 100vh;
}

.relative-z {
  position: relative;
  z-index: 2;
}

/* Typography */
.premium-title {
  font-size: 2.8rem;
  font-weight: 800; // Boosted heading weight
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.premium-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 0;
  max-width: 600px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  
  span:first-child {
    font-size: 2rem;
    font-weight: 800;
    color: #38bdf8;
    line-height: 1;
  }
  .badge-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-top: 4px;
  }
}

/* Floating Dock for Filters */
.floating-dock {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 100px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 50px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-field {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 250px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 50px;
  padding: 12px 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: rgba(56, 189, 248, 0.3);
    background: rgba(15, 23, 42, 0.8);
  }
  
  .search-icon {
    color: #64748b;
    margin-right: 12px;
    font-size: 1.1rem;
  }
  
  input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    outline: none;
    
    &::placeholder {
      color: #64748b;
    }
  }
}

.festival-dock-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  .filter-btn {
    position: relative;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
    padding: 10px 24px;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(56, 189, 248, 0.1);
      border-color: rgba(56, 189, 248, 0.3);
    }
    
    &.active {
      color: #fff;
      background: rgba(15, 23, 42, 0.8);
      
      /* Electric Blue Glow for Active State */
      .glow-indicator {
        position: absolute;
        bottom: -2px;
        left: 20%;
        right: 20%;
        height: 2px;
        background: #38bdf8;
        border-radius: 2px;
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.8);
      }
    }
  }
}

/* Bento Grid System */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Premium Floating Card */
.floating-card {
  position: relative;
  background: rgba(15, 23, 42, 0.6); // Deep slate background
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
  height: 100%;
  
  /* 1px Border Glow Gradient */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 10;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1);
  }
}

/* Staggered Animation */
.fest-card {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  animation-delay: calc(var(--animation-order) * 0.1s);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card Image & Mask */
.fest-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  .fest-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }
  
  .image-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 100%);
    pointer-events: none;
  }
  
  .fest-category {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #e2e8f0;
  }
}

.fest-card:hover .fest-image {
  transform: scale(1.05);
}

/* Card Content */
.fest-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.fest-title {
  font-size: 1.5rem;
  font-weight: 800; // Boosted heading weight
  margin: 0 0 8px 0;
  color: #fff;
  letter-spacing: -0.5px;
}

.fest-description {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 24px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Inner Bento Grid Details */
.bento-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  flex: 1;
}

.detail-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &.full-width {
    grid-column: span 2;
  }
  
  .meta-label {
    font-size: 10px;
    font-weight: 600;
    color: #64748b; // Muted slate
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  
  .meta-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #f8fafc; // White pop
  }
}

/* Glowing Ghost Button */
.btn-ghost-glow {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 1px solid rgba(56, 189, 248, 0.5);
  color: #38bdf8;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: #fff;
    border-color: transparent;
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
}

/* Coming Soon Empty State Card */
.coming-soon-card {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.3); // Even lighter transparent background
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 24px;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  
  &::before {
    display: none; // Remove solid glow border
  }
  
  &:hover {
    transform: translateY(0); // Disable hover lift
    box-shadow: none;
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .coming-soon-content {
    .sparkle-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.8;
    }
    
    .coming-soon-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    
    p {
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
}

/* States */
.glass-panel {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 60px 24px;
  text-align: center;
  margin-top: 40px;
}

/* Responsive Overrides */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .floating-dock {
    border-radius: 24px;
    flex-direction: column;
    padding: 16px;
  }
  
  .search-field {
    width: 100%;
  }
  .festival-dock-filters {
    justify-content: center;
  }
}
\

fs.writeFileSync('src/app/Guest/viewallfestsguest/viewallfestsguest.html', htmlContent);
fs.writeFileSync('src/app/Guest/viewallfestsguest/viewallfestsguest.scss', scssContent);

console.log('Done guest replacement!');
