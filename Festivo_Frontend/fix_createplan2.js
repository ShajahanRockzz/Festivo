const fs = require('fs');

let html = fs.readFileSync('src/app/Admin/createplan/createplan.html', 'utf8');

// Replace the older preview card with a fully styled "Subscripion Tier Card" mockup
html = html.replace(/<!-- Plan Preview Card -->[\s\S]*<\/div>\s*<\/div>\s*<\/div>$/i, `<!-- Plan Preview Card -->
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
</div>`);

fs.writeFileSync('src/app/Admin/createplan/createplan.html', html, 'utf8');


let scss = fs.readFileSync('src/app/Admin/createplan/createplan.scss', 'utf8');

scss = scss.replace(/\/\* Plan Preview Card Styles \*\/[\s\S]*?(?=\/\* MODALS \*\/)/i, `/* Plan Preview Card Styles */
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

`);

fs.writeFileSync('src/app/Admin/createplan/createplan.scss', scss, 'utf8');
console.log('Fixed');