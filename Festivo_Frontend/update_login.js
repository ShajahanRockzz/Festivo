const fs = require('fs');

let css = fs.readFileSync('src/app/Guest/login/login.scss', 'utf8');

css = css.replace('.floating-card {', '.login-card {\n  backdrop-filter: blur(20px);\n  background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.1);');
css = css.replace('.toast-error {', '.toast-error {\n  right: 20px;\n  top: 20px;\n  left: auto;\n  transform: translateX(120%);\n');
css = css.replace('.toast-error.show {', '.toast-error.show {\n  transform: translateX(0) translateY(0);\n');
css = css.replace('top: 6px;', 'top: 0;');

fs.writeFileSync('src/app/Guest/login/login.scss', css);

let html = fs.readFileSync('src/app/Guest/login/login.html', 'utf8');
html = html.replace('login-content floating-card', 'login-content login-card');
fs.writeFileSync('src/app/Guest/login/login.html', html);
console.log("Updated login artifacts to strictly match prompt")
