const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/Rizwan Saeed/g, 'Fiza Rafi');
  content = content.replace(/Rizwan/g, 'Fiza');
  content = content.replace(/Saeed/g, 'Rafi');
  content = content.replace(/rizwansaeed610@gmail\.com/g, 'fizarafir@gmail.com');
  content = content.replace(/rizwansaeed6597@gmail\.com/g, 'fizarafir@gmail.com');
  content = content.replace(/rizwansaeed/g, 'fizarafir');
  content = content.replace(/\+971 58 143 5161/g, '03017530487'); // guessing phone number replacement might be needed, let's keep it safe
  fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json')) {
      replaceInFile(fullPath);
    }
  }
}

processDir(__dirname);
console.log("Replacement complete.");
