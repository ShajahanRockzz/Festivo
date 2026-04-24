const fs = require('fs');
const tsPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.ts';
let ts = fs.readFileSync(tsPath, 'utf8');

if (!ts.includes('selectedFest: any')) {
   ts = ts.replace(
       "groupedFests: any[] = [];\n  isLoading = true;",
       "groupedFests: any[] = [];\n  selectedFest: any = null;\n  isLoading = true;"
   );
   
   ts = ts.replace(
       "getFestImage(imagePath",
       "selectFest(fest: any) {\n    this.selectedFest = fest;\n  }\n\n  goBack() {\n    this.selectedFest = null;\n  }\n\n  getFestImage(imagePath"
   );
   
   fs.writeFileSync(tsPath, ts);
   console.log('TS state variables added');
}
