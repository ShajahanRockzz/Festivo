const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'Festivo_Frontend', 'src', 'app');

function updateStyles(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add grid tracking and bento classes to structural classes
    // But honestly doing this globally in styles.scss is much SAFER.
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.scss')) {
            // Apply bento layout to cards if found
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            if (content.includes('.card {') || content.includes('.container {')) {
                // Not doing raw regex because styles.scss overrides with !important
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updatedContent = content;
            
            // Add bento-card / glass-panel if standard ones exist, mostly let SCSS handle it via generic classes
            updatedContent = updatedContent.replace(/class="([^"]*)shadow([^"]*)"/g, 'class="$1$2"');
            
            if (content !== updatedContent) {
                fs.writeFileSync(fullPath, updatedContent);
            }
        }
    }
}

// Ensure global styles are absolutely perfect
const stylesScssPath = path.join(__dirname, 'Festivo_Frontend', 'src', 'styles.scss');
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --bg-midnight: #020617;
  --surface-slate: #0f172a;
  --border-glass: rgba(255, 255, 255, 0.08);
  --text-primary: #ffffff;
  --text-secondary: #94a3b8;
  --brand-gradient: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  --glass-bg: rgba(15, 23, 42, 0.7);
  --radius-bento: 20px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --transition-bezier: cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-midnight) !important;
  color: var(--text-primary) !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  min-height: 100vh;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 3. Animations & Motion */
/* Apply this animation to every component's host */
[class^="app-"], router-outlet ~ * {
  display: block;
  animation: fadeInUp 0.6s var(--transition-bezier) forwards;
}

/* Add a transition to all interactive elements */
a, button, .btn, .card, input, select, textarea, .bento-card, .dashboard-card {
  transition: all 0.3s var(--transition-bezier) !important;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary) !important;
  margin-top: 0;
}

/* Typography Labels */
label, .label, .date-label, .venue-label, th {
  color: var(--text-secondary) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
}

/* 2. Component Refactoring */
/* Card Style: Bento-style */
.card, .bento-card, .dashboard-card, .form-card, .container, .box, .panel, .fest-card, .comp-card {
  background-color: var(--surface-slate) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: var(--radius-bento) !important;
  padding: var(--space-3) !important;
  box-shadow: none !important;
}

.card:hover, .bento-card:hover, .dashboard-card:hover, .form-card:hover, .container:hover, .box:hover, .panel:hover, .fest-card:hover, .comp-card:hover {
  transform: translateY(-4px) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}

/* Glassmorphism: Navigation and Search bars */
.navbar, nav, .search-bar, .glass-panel, header, .sidebar, app-navbar > *, .top-bar {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid var(--border-glass) !important;
}

/* Buttons: Cyan-to-Indigo gradient */
button, .btn, .btn-primary, input[type='button'], input[type='submit'] {
  background: var(--brand-gradient) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}

button:hover, .btn:hover, .btn-primary:hover, input[type='button']:hover, input[type='submit']:hover {
  box-shadow: 0 0 16px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px) !important;
}

/* 4. Alignment & Precision */
/* 8px grid system padding and margins */
.m-1 { margin: 8px !important; }
.m-2 { margin: 16px !important; }
.m-3 { margin: 24px !important; }
.m-4 { margin: 32px !important; }

.p-1 { padding: 8px !important; }
.p-2 { padding: 16px !important; }
.p-3 { padding: 24px !important; }
.p-4 { padding: 32px !important; }

/* Center all grid content and ensure cards in a row have equal height */
.grid-container, .row, .cards, .grid, .fest-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
  grid-auto-rows: 1fr !important;
  gap: var(--space-3) !important;
  align-items: stretch !important;
  justify-content: center !important;
}

.grid-container > *, .row > *, .cards > *, .grid > *, .fest-grid > * {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

/* For forms */
input:not([type="submit"]):not([type="button"]):not([type="radio"]):not([type="checkbox"]), select, textarea {
  background-color: var(--bg-midnight) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: 8px !important;
  padding: 16px !important; /* Multiple of 8 */
  margin-bottom: 16px !important; /* Multiple of 8 */
  width: 100%;
}

input:focus, select:focus, textarea:focus {
  outline: none !important;
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.2) !important;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface-slate);
  border-radius: 12px;
  overflow: hidden;
}
th {
  background-color: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  padding: 16px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
}
td {
  padding: 16px;
  border-bottom: 1px solid var(--border-glass);
  color: var(--text-primary);
}
`;

fs.writeFileSync(stylesScssPath, globalStyles);
console.log('Global styles overridden successfully.');

processDirectory(targetDir);
console.log('Refactoring applied.');
