const fs = require('fs');

const htmlPath = 'src/app/Institution/buyplan/buyplan.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// replace the inline styled section with proper semantic structure
const oldSectionMatch = html.match(/<div class="current-plan-section".*?<\/div>\s*<\/div>\s*<\/div>/s);

if (oldSectionMatch) {
  const newSection = `  <!-- Current Plan Section -->
  <div class="current-plan-section" *ngIf="currentPlan">
    <h2>Your Current Plan</h2>
    <div class="current-plan-card">
      <div class="plan-header-info">
        <div class="title-badge-group">
          <h3 class="plan-title">{{ currentPlan.plan_name }}</h3>
          <span class="badge-current">Current</span>
        </div>
        <div class="plan-details-list">
          <p><strong>Duration:</strong> {{ currentPlan.days }} days</p>
          <p><strong>Price:</strong> ₹{{ currentPlan.amount }}</p>
          <p><strong>Renewal Date:</strong> {{ formatRenewalDate(currentPlan.renewaldate) }}</p>
          <p class="plan-desc">{{ currentPlan.description }}</p>
        </div>
      </div>
    </div>
  </div>`;
  html = html.replace(oldSectionMatch[0], newSection);
  fs.writeFileSync(htmlPath, html);
  console.log("HTML replaced");
} else {
  console.log("Could not match html section");
}

const scssPath = 'src/app/Institution/buyplan/buyplan.scss';
let scss = fs.readFileSync(scssPath, 'utf8');

if (!scss.includes('.current-plan-section')) {
  scss += `\n
// Current Plan Section
.current-plan-section {
  margin: 0 40px 30px 40px;
  background: var(--bg-midnight, #1e1e2d);
  padding: 24px 30px;
  border-radius: 12px;
  border-left: 6px solid $primary-blue;
  border-top: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

  h2 {
    margin: 0 0 20px 0;
    font-size: 22px;
    font-weight: 600;
    color: var(--text-pure, #fff);
  }

  .current-plan-card {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    
    .plan-header-info {
      width: 100%;
    }

    .title-badge-group {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;

      .plan-title {
        margin: 0;
        font-size: 24px;
        color: $primary-blue;
      }

      .badge-current {
        background: $success-color;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .plan-details-list {
      p {
        margin: 8px 0;
        color: var(--text-slate, #cbd5e1);
        font-size: 15px;
        
        strong {
          color: var(--text-pure, #fff);
          margin-right: 5px;
        }
      }

      .plan-desc {
        color: var(--text-slate);
        opacity: 0.8;
        font-style: italic;
        margin-top: 12px;
        font-size: 14px;
      }
    }
  }
}
`;
  fs.writeFileSync(scssPath, scss);
  console.log("SCSS updated");
} else {
  console.log("SCSS already contains '.current-plan-section'");
}
