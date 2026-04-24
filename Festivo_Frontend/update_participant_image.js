const fs = require('fs');
let tsContent = fs.readFileSync('src/app/Participant/viewallfests/viewallfests.ts', 'utf8');

const oldCode = `  getFestImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/default-fest.jpg';
    }`;

const newCode = `  getFestImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }`;

const oldImageUrl = `  getImageUrl(imageName: string): string {
    if (!imageName) {
      return '/uploads/default_fest.jpg';
    }`;

const newImageUrl = `  getImageUrl(imageName: string): string {
    if (!imageName) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }`;


tsContent = tsContent.replace(oldCode, newCode);
tsContent = tsContent.replace(oldImageUrl, newImageUrl);

// Check if there are other occurrences to replace cleanly using Regex as contingency
tsContent = tsContent.replace(/return 'assets\/default-fest.jpg';/g, "return 'http://localhost:3000/uploads/default_fest.jpg';");

fs.writeFileSync('src/app/Participant/viewallfests/viewallfests.ts', tsContent, 'utf8');
