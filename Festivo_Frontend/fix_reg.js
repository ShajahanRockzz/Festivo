const fs = require('fs');

// READ HTML
let html = fs.readFileSync('src/app/Guest/registerparticipant/registerparticipant.html', 'utf8');

html = html.replace('<div class="registration-container">', '<div class="registration-container about-hero">\n  <div class="glow-sphere left"></div>\n  <div class="glow-sphere right"></div>');
html = html.replace('<div class="registration-wrapper">', '<div class="registration-wrapper container glass-card relative-z">');
html = html.replace('<div class="registration-header">', '<div class="registration-header text-center">\n      <div class="badge">Join Festivo</div>');
html = html.replace('<h1>Participant Registration</h1>', '<h1 class="title">Participant <span>Registration</span></h1>');
html = html.replace('<p>Join thousands of participants in amazing festivals and competitions</p>', '<p class="subtitle">Join thousands of participants in amazing festivals and competitions</p>');

fs.writeFileSync('src/app/Guest/registerparticipant/registerparticipant.html', html);


// WRITE SCSS
let scss = 
.registration-container {
  min-height: 100vh;
  position: relative;
  padding: 120px 0 80px;
  overflow: hidden;
  background-color: var(--bg-midnight);
}

.relative-z {
  position: relative;
  z-index: 1;
}

.glow-sphere {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  z-index: 0;

  &.left {
    top: -100px;
    left: -100px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
  }

  &.right {
    bottom: -100px;
    right: -100px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
  }
}

.registration-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.registration-header {
  margin-bottom: 3rem;
  
  .badge {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(124, 58, 237, 0.1);
    color: #a78bfa;
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  .title {
    font-size: 3rem;
    color: white;
    margin: 0 0 16px;
    font-weight: 800;

    span {
      background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
}

.form-section {
  margin-bottom: 3rem;

  .section-title {
    font-size: 1.3rem;
    color: white;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    font-weight: 600;
  }
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
    font-weight: 600;
  }

  input, select {
    width: 100%;
    padding: 0.875rem 1.25rem;
    background: rgba(0,0,0,0.3) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 12px !important;
    color: white !important;
    font-size: 1rem;
    transition: all 0.3s ease !important;

    &:focus {
      border-color: #0ea5e9 !important;
      box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
      outline: none;
    }

    &[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

/* Email Input Group */
.email-input-group {
  display: flex;
  gap: 12px;
  align-items: center;

  input {
    flex: 1;
  }

  .btn-send-otp {
    padding: 0.875rem 1.5rem;
    background: rgba(14, 165, 233, 0.1);
    color: #0ea5e9;
    border: 1px solid rgba(14, 165, 233, 0.3);
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover:not([disabled]) {
      background: rgba(14, 165, 233, 0.2);
    }
    
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .otp-verified {
    color: #10b981;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.875rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
}

/* OTP Section */
.otp-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);

  .otp-info {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .otp-actions {
    display: flex;
    gap: 12px;
    margin-top: 1rem;
    flex-wrap: wrap;

    button {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .btn-verify-otp {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      
      &:hover:not([disabled]) {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      &[disabled] { opacity: 0.5; }
    }

    .btn-resend-otp, .btn-change-email {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      color: white;

      &:hover:not([disabled]) {
        background: rgba(255,255,255,0.05);
      }
      &[disabled] { opacity: 0.5; }
    }
  }
}

/* File Upload */
.file-upload {
  position: relative;
  width: 100%;
  height: 60px;
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5e9;
    background: rgba(14, 165, 233, 0.05);
  }

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .file-label {
    .upload-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .upload-success {
      color: #10b981;
      font-weight: 600;
    }
  }
}

.file-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);

  .image-preview {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    margin: 0 auto;
    border: 2px solid rgba(255,255,255,0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* Validation Status */
.field-error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 50%;
    font-size: 10px;
    font-weight: bold;
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.1);
  border-left-color: #0ea5e9;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Actions */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.08);

  button {
    flex: 1;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-submit {
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
    color: white;
    border: none;

    &:hover:not([disabled]) {
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }
    
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      background: rgba(255,255,255,0.1);
    }
  }

  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;

    &:hover:not([disabled]) {
      background: rgba(255,255,255,0.05);
    }
  }
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(16px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;

  .spinner {
    width: 48px;
    height: 48px;
    border-width: 3px;
    margin-bottom: 24px;
  }

  h2 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .btn-modal {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
    color: white;
  }
}

.text-center { text-align: center; }
;

fs.writeFileSync('src/app/Guest/registerparticipant/registerparticipant.scss', scss);
console.log('Update successful!');
