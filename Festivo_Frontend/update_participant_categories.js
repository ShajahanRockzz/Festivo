const fs = require('fs');
let tsContent = fs.readFileSync('src/app/Participant/viewallfests/viewallfests.ts', 'utf8');

tsContent = tsContent.replace(
  "this.categories = this.getUniqueValues(this.fests, 'category_name');",
  "this.categories = ['all', ...this.getUniqueValues(this.fests, 'category_name')];"
);

fs.writeFileSync('src/app/Participant/viewallfests/viewallfests.ts', tsContent, 'utf8');
console.log("Updated ts.");
