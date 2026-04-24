const fs = require('fs');
let html = fs.readFileSync('src/app/Guest/login/login.html', 'utf8');

html = html.replace('<span class="toast-icon">??</span>', '<span class="toast-icon">??</span>');
html = html.replace('<span class="back-arrow">?</span>', '<span class="back-arrow">?</span>');
html = html.replace("{{ showPassword ? '???' : '??' }}", "{{ showPassword ? '???' : '??' }}");
html = html.replace('<span class="badge badge-admin">????? Admin</span>', '<span class="badge badge-admin">????? Admin</span>');
html = html.replace('<span class="badge badge-institution">??? Institution</span>', '<span class="badge badge-institution">??? Institution</span>');
html = html.replace('<span class="badge badge-participant">?? Participant</span>', '<span class="badge badge-participant">?? Participant</span>');
html = html.replace('<span class="badge badge-coordinator">?? Coordinator</span>', '<span class="badge badge-coordinator">?? Coordinator</span>');

fs.writeFileSync('src/app/Guest/login/login.html', html, 'utf8');
