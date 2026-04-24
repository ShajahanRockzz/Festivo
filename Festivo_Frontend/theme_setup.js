
const fs = require('fs');

const globalStyles = \
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

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-midnight);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
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

* {
  box-sizing: border-box;
}

// Global host animation for components
* {
  animation: fadeInUp 0.6s var(--transition-bezier) forwards;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  margin-top: 0;
}

label, .label, .date-label, .venue-label {
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card, .bento-card, .dashboard-card, .form-card {
  background-color: var(--surface-slate) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: var(--radius-bento) !important;
  padding: var(--space-3) !important;
  box-shadow: none !important;
  transition: all 0.3s var(--transition-bezier) !important;
}

.card:hover, .bento-card:hover, .dashboard-card:hover, .form-card:hover {
  transform: translateY(-4px) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.navbar, nav, .search-bar, .glass-panel {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid var(--border-glass) !important;
}

button, .btn, .btn-primary, input[type='button'], input[type='submit'] {
  background: var(--brand-gradient) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s var(--transition-bezier) !important;
}

button:hover, .btn:hover, .btn-primary:hover {
  box-shadow: 0 0 16px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px) !important;
}

.grid-container, .row {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
  gap: var(--space-3) !important;
  align-items: stretch !important;
  justify-content: center !important;
}

.grid-container > *, .row > * {
  display: flex !important;
  flex-direction: column !important;
}

input, select, textarea {
    background-color: var(--bg-midnight) !important;
    border: 1px solid var(--border-glass) !important;
    color: var(--text-primary) !important;
    border-radius: 8px !important;
    padding: 8px !important;
}
input:focus, select:focus, textarea:focus {
    outline: none !important;
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.2) !important;
}
\;

fs.writeFileSync('src/styles.scss', globalStyles);
console.log('Global styles overridden applied successfully.');

