const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'check-db.js',
  'services/user-service/check-db.js'
];

const replacements = [
  { match: /Foods/g, replace: 'Books' },
  { match: /foods/g, replace: 'books' },
  { match: /Food/g, replace: 'Book' },
  { match: /food/g, replace: 'book' }
];

filesToProcess.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ match, replace }) => {
      content = content.replace(match, replace);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
