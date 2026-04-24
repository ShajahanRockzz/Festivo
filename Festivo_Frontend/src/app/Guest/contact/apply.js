const fs = require('fs');
const htmlContent = `
<div class="contact-page">
  <!-- Background Visual Anchor -->
  <div class="bg-visual-anchor"></div>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="blob-bg"></div>
    <div class="container relative-z">
      <h2 class="glow-text">Support & Community</h2>
      <p>Have questions about Festivo? We're here to help.</p>
      
      <!-- Searchable FAQ Mini-Bar -->
      <div class="faq-search-bar glass-panel premium-glass">
        <i class="feather icon-search"></i>
        <input type="text" placeholder="Search FAQs or ask a question...">
        <button type="button" class="btn-search">Search</button>
      </div>
    </div>
  </section>

  <!-- Contact Form & Info Grid -->
  <section class="contact-main-section">
    <div class="container layout-grid">
      
      <!-- Contact Form -->
      <div class="contact-card glass-panel premium-glass">
        <h3 class="form-title">Send us a Message</h3>
        
        <div class="alert success" *ngIf="successMessage">
          <i class="feather icon-check-circle"></i> {{ successMessage }}
        </div>
        
        <div class="alert error" *ngIf="errorMessage">
          <i class="feather icon-alert-circle"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="submitContact()" #form="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Your Name</label>
              <input type="text" class="premium-input" placeholder="John Doe" [(ngModel)]="contactForm.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label>Your Email</label>
              <input type="email" class="premium-input" placeholder="johndoe@example.com" [(ngModel)]="contactForm.email" name="email" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" class="premium-input" placeholder="1234567890" [(ngModel)]="contactForm.phone_no" name="phone_no" required>
            </div>
            
            <div class="form-group">
              <label>Subject</label>
              <input type="text" class="premium-input" placeholder="How can we help?" [(ngModel)]="contactForm.subject" name="subject" required>
            </div>
          </div>

          <div class="form-group full-width">
            <label>Message</label>
            <textarea class="premium-input" placeholder="Write your message here..." [(ngModel)]="contactForm.message" name="message" rows="5" required></textarea>
          </div>

          <button type="submit" class="btn-submit" [disabled]="isSubmitting">
            <span *ngIf="!isSubmitting">Send Message </span>
            <i class="feather icon-send" *ngIf="!isSubmitting"></i>
            <span *ngIf="isSubmitting">Sending...</span>
          </button>
        </form>
      </div>

      <!-- Contact Info & Map -->
      <div class="right-panel">
        <div class="contact-info">
          <div class="info-card glass-panel premium-glass mini">
            <div class="icon-wrap"><i class="feather icon-map-pin"></i></div>
            <div class="details">
              <h4>Office Location</h4>
              <p>Festivo Tech Park<br>Trivandrum, Kerala<br>India 695001</p>
            </div>
          </div>
          
          <div class="info-card glass-panel premium-glass mini">
            <div class="icon-wrap"><i class="feather icon-mail"></i></div>
            <div class="details">
              <h4>Email Support</h4>
              <p>support@festivo.com<br>info@festivo.com</p>
            </div>
          </div>

          <div class="info-card glass-panel premium-glass mini">
            <div class="icon-wrap"><i class="feather icon-phone"></i></div>
            <div class="details">
              <h4>Call Us</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>

        <!-- Interactive Map Placeholder -->
        <div class="map-container glass-panel premium-glass">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.06994350174!2d76.94073357500588!3d8.530391491501712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b8a05c742c39%3A0xc6cb6966f39e3c98!2sTechnopark%20Trivandrum!5e0!3m2!1sen!2sin!4v1709400010996!5m2!1sen!2sin" 
            width="100%" height="100%" style="border:0; filter: grayscale(100%) invert(92%) contrast(83%);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </section>

  <!-- Community Statistics Section -->
  <section class="community-stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card glass-panel premium-glass">
          <div class="neon-icon yellow"><i class="feather icon-bookmark"></i></div>
          <h3>50+</h3>
          <p>Partner Colleges</p>
        </div>
        <div class="stat-card glass-panel premium-glass">
          <div class="neon-icon blue"><i class="feather icon-calendar"></i></div>
          <h3>200+</h3>
          <p>Annual Fests</p>
        </div>
        <div class="stat-card glass-panel premium-glass">
          <div class="neon-icon pink"><i class="feather icon-users"></i></div>
          <h3>10k+</h3>
          <p>Participants</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Social Media Row -->
  <section class="social-media-row">
    <div class="container">
      <div class="social-grid">
        <a href="javascript:void(0)" class="social-card instagram glass-panel premium-glass">
          <div class="icon-bg"><i class="feather icon-instagram"></i></div>
          <div class="social-text">
            <h4>Instagram</h4>
            <p>Join 5k+ Students</p>
          </div>
        </a>
        <a href="javascript:void(0)" class="social-card linkedin glass-panel premium-glass">
          <div class="icon-bg"><i class="feather icon-linkedin"></i></div>
          <div class="social-text">
            <h4>LinkedIn</h4>
            <p>Network with 2k+ Pros</p>
          </div>
        </a>
        <a href="javascript:void(0)" class="social-card twitter glass-panel premium-glass">
          <div class="icon-bg"><i class="feather icon-twitter"></i></div>
          <div class="social-text">
            <h4>X (Twitter)</h4>
            <p>Follow 8k+ Updates</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</div>
`;

const scssContent = `
.contact-page {
  min-height: 100vh;
  position: relative;
  color: var(--color-text-primary);
  overflow-x: hidden;

  // Visual Anchor (Right-side abstract shapes or silhouette vibe)
  .bg-visual-anchor {
    position: absolute;
    top: 10%;
    right: -10%;
    width: 60vw;
    height: 80vh;
    background: radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 30%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle at center, rgba(236, 72, 153, 0.03) 0%, transparent 60%);
      transform: translate(-50%, -50%);
    }
  }

  .hero-section {
    padding: 120px 0 60px;
    position: relative;
    text-align: center;
    z-index: 1;

    .blob-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 250px;
      background: #7c3aed;
      filter: blur(120px);
      opacity: 0.25;
      border-radius: 50%;
      animation: blobFloat 8s infinite alternate ease-in-out;
      z-index: -1;
    }

    .relative-z {
      position: relative;
      z-index: 2;
    }

    h2.glow-text {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #ffffff, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
    }

    p {
      color: var(--color-text-secondary);
      font-size: 1.2rem;
    }

    // Searchable FAQ Mini-Bar
    .faq-search-bar {
      margin: 40px auto 0;
      max-width: 650px;
      display: flex;
      align-items: center;
      border-radius: 50px;
      padding: 8px 8px 8px 24px;
      transition: border-color 0.3s ease;

      &:focus-within {
        border-color: rgba(99, 102, 241, 0.5);
      }

      i {
        color: var(--color-text-secondary);
        font-size: 1.3rem;
      }

      input {
        flex: 1;
        background: transparent;
        border: none;
        color: white;
        padding: 0 16px;
        font-size: 1rem;
        font-family: var(--font-body);
        outline: none;

        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      }

      .btn-search {
        background: var(--gradient-btn);
        color: white;
        border: none;
        padding: 14px 32px;
        border-radius: 40px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.3s;
        
        &:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
      }
    }
  }

  // Common Glassmorphism Class
  .premium-glass {
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .contact-main-section {
    padding: 20px 0 60px;
    position: relative;
    z-index: 2;

    .layout-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 40px;
      align-items: stretch;
      
      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .contact-card {
      border-radius: 24px;
      padding: 45px;

      .form-title {
        font-size: 1.6rem;
        margin-bottom: 30px;
        color: white;
        font-weight: 600;
        
        &::after { display: none; }
      }

      .alert {
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        
        i { font-size: 1.3rem; }
        
        &.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        &.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
      }

      form {
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;

          @media (max-width: 600px) { grid-template-columns: 1fr; }
        }

        .form-group {
          margin-bottom: 24px;
          &.full-width { grid-column: 1 / -1; }

          label {
            display: block;
            margin-bottom: 10px;
            color: var(--color-text-secondary);
            font-weight: 500;
            font-size: 0.95rem;
          }

          .premium-input {
            width: 100%;
            padding: 16px 20px;
            background: #020617; // Deep Navy Background
            border: none;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px 12px 0 0;
            color: white;
            font-family: var(--font-body);
            font-size: 1rem;
            transition: all 0.3s ease;

            &::placeholder { color: rgba(255, 255, 255, 0.25); }

            &:focus {
              outline: none;
              border-bottom-color: #06b6d4; // Electric Cyan
              box-shadow: 0 10px 20px -5px rgba(6, 182, 212, 0.15);
              background: rgba(2, 6, 23, 0.9);
            }
          }

          textarea.premium-input {
            resize: vertical;
            min-height: 140px;
          }
        }

        .btn-submit {
          width: 100%;
          padding: 18px;
          background: var(--gradient-btn);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          i { font-size: 1.2rem; }

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: #334155;
          }
        }
      }
    }

    .right-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .info-card.mini {
          padding: 24px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s;

          &:hover {
            transform: translateX(5px);
            border-color: rgba(99, 102, 241, 0.3);
            background: rgba(30, 41, 59, 0.6);
          }

          .icon-wrap {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: rgba(99, 102, 241, 0.15);
            color: var(--color-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            flex-shrink: 0;
            box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.1);
          }

          .details {
            h4 { margin: 0 0 6px 0; font-size: 1.1rem; color: white; }
            p { margin: 0; color: var(--color-text-secondary); line-height: 1.5; font-size: 0.95rem;}
          }
        }
      }

      .map-container {
        flex: 1;
        min-height: 300px;
        border-radius: 20px;
        padding: 8px; // Padding creates a frame effect
        display: flex;

        iframe {
          flex: 1;
          border-radius: 12px;
          // Inverting map colors for premium dark mode aesthetic
          filter: grayscale(80%) invert(100%) contrast(90%) hue-rotate(180deg);
          transition: filter 0.3s ease;
          
          &:hover { filter: grayscale(50%) invert(100%) contrast(90%) hue-rotate(180deg); }
        }
      }
    }
  }

  // Community Statistics Grid
  .community-stats {
    padding: 20px 0 60px;
    position: relative;
    z-index: 2;

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;

      @media (max-width: 768px) { grid-template-columns: 1fr; }

      .stat-card {
        padding: 40px 30px;
        border-radius: 24px;
        text-align: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-8px);
        }

        .neon-icon {
          font-size: 2.8rem;
          margin-bottom: 20px;
          display: inline-block;

          &.yellow { color: #facc15; filter: drop-shadow(0 0 15px rgba(250, 204, 21, 0.5)); }
          &.blue { color: #38bdf8; filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.5)); }
          &.pink { color: #f472b6; filter: drop-shadow(0 0 15px rgba(244, 114, 182, 0.5)); }
        }

        h3 {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 10px;
          color: white;
          letter-spacing: -1px;
        }
        
        p { color: var(--color-text-secondary); margin: 0; font-size: 1.1rem; font-weight: 500;}
      }
    }
  }

  // Social Media Row
  .social-media-row {
    padding: 20px 0 80px;
    position: relative;
    z-index: 2;

    .social-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;

      @media (max-width: 768px) { grid-template-columns: 1fr; }

      .social-card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 24px 30px;
        border-radius: 24px;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        .icon-bg {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
        }

        i {
          font-size: 1.8rem;
          color: white;
        }

        .social-text {
          h4 { margin: 0 0 6px; color: white; font-size: 1.15rem; font-weight: 600; }
          p { margin: 0; color: var(--color-text-secondary); font-size: 0.95rem; }
        }

        &:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);

          &.instagram .icon-bg { 
            background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); 
            box-shadow: 0 10px 20px rgba(220, 39, 67, 0.4); 
          }
          &.linkedin .icon-bg { 
            background: #0077b5; 
            box-shadow: 0 10px 20px rgba(0, 119, 181, 0.4); 
          }
          &.twitter .icon-bg { 
            background: #1da1f2; 
            box-shadow: 0 10px 20px rgba(29, 161, 242, 0.4); 
          }
        }
      }
    }
  }
}

@keyframes blobFloat {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-45%, -55%) scale(1.05); }
  100% { transform: translate(-50%, -60%) scale(1.1); filter: blur(140px); }
}
`;

fs.writeFileSync('C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/contact/contact.html', htmlContent);
fs.writeFileSync('C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/contact/contact.scss', scssContent);
console.log('Done!');
