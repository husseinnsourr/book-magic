const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), 'src');
const outputFile = path.join(process.cwd(), 'Project_Tree_Visual.md');

function generateTree(dir, prefix = '') {
  let output = '';
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const isLast = index === files.length - 1;
    
    // Custom format based on user request:
    // Root
    // --- Child
    //     ----- Grandchild
    
    // calculate depth for dashes
    const relativePath = path.relative(rootDir, filePath);
    const depth = relativePath.split(path.sep).length;
    
    let currentPrefix = '';
    if (depth === 1) {
        currentPrefix = '--- ';
    } else {
        // approximate the indentation style
        currentPrefix = '    '.repeat(depth - 1) + '----- ';
    }

    if (stats.isDirectory()) {
      output += `${currentPrefix}${file}\n`;
      output += generateTree(filePath, prefix);
    } else {
      output += `${currentPrefix}${file}\n`;
    }
  });
  return output;
}

const tree = `# 🌳 هيكل الملفات الشجري\n\nsrc\n${generateTree(rootDir)}`;

fs.writeFileSync(outputFile, tree);
console.log(`Tree saved to ${outputFile}`);
