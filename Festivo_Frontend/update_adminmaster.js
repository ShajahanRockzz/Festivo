const fs = require('fs');
let code = fs.readFileSync('src/app/Admin/adminmaster/adminmaster.ts', 'utf8');

code = code.replace(
    "{ label: 'View All Revenue', route: '#', icon: '??' }",
    "{ label: 'View All Revenue', route: '/adminmaster/totalrevenue', icon: '??' }"
);

fs.writeFileSync('src/app/Admin/adminmaster/adminmaster.ts', code, 'utf8');
console.log('Updated adminmaster.ts');
