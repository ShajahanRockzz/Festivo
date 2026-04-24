const fs = require('fs');
const htmlPath = 'src/app/Guest/registerparticipant/registerparticipant.html';
const scssPath = 'src/app/Guest/registerparticipant/registerparticipant.scss';

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('class="registration-container"', 'class="about-page registration-container"');
html = html.replace(/class="registration-wrapper"/g, 'class="container"');
html = html.replace(/class="registration-header"/g, 'class="about-hero text-center"');
html = html.replace(/class="form-section"/g, 'class="form-section glass-card"');
fs.writeFileSync(htmlPath, html);

let scss = \
.about-page {
  background-color: var(--bg-midnight);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center { text-align: center; }

h1 {
  font-size: 2.5rem;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.glass-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px;
  transition: transform 0.3s ease, border-color 0.3s ease;
  margin-bottom: 24px;
}

.glass-card:hover {
  transform: translateY(-5px);
  border-color: rgba(124, 58, 237, 0.5);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-weight: 500;
}

input, select, .file-upload {
  width: 100%;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
  transition: all 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.btn-submit, .btn-send-otp, .btn-verify-otp {
  background: var(--brand-gradient);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
}

.btn-submit:hover, .btn-send-otp:hover, .btn-verify-otp:hover {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
}

.btn-cancel {
  background: rgba(255,255,255,0.1);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 12px;
}

.form-actions {
  display: flex;
  margin-top: 30px;
}
\;

fs.writeFileSync(scssPath, scss);
console.log('Updated registerparticipant visual styles.');
