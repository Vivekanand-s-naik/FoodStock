const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'client/src/App.jsx',
  'client/src/style.css',
  'client/index.html',
  'gateway/index.js',
  'services/book-service/models/Book.js',
  'services/book-service/index.js',
  'services/book-service/db.js',
  'services/book-service/inMemoryStore.js',
  'services/book-service/check-db.js',
  'services/book-service/package.json',
  'START-ALL-WINDOWS.bat',
  'START-ALL.ps1',
  'QUICK-START.md',
  'SETUP-MONGODB.md',
  'MONGODB_SETUP.md',
  'MONGODB-WINDOWS-SETUP.md',
  'TROUBLESHOOTING.md',
  'FIX-SUMMARY.md'
];

const replacements = [
  { match: /Foods/g, replace: 'Books' },
  { match: /foods/g, replace: 'books' },
  { match: /Food/g, replace: 'Book' },
  { match: /food/g, replace: 'book' },
  { match: /🍔/g, replace: '📚' },
  { match: /🍽️/g, replace: '📖' },
  { match: /Pizza/g, replace: 'Novel' },
  { match: /pizza/g, replace: 'novel' }
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
