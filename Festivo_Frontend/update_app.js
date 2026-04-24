const fs = require('fs'); 
const file = '../Festivo_Backend/app.js'; 
let content = fs.readFileSync(file, 'utf8'); 
content = content.replace("app.use('/api/competitions', competitionsRouter);", "app.use('/api/competitions', upload.any(), competitionsRouter);"); 
fs.writeFileSync(file, content);
