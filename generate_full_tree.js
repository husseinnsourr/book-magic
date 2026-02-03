const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'Project_Structure_Visual_Full.md');

// Files/Folders to ignore
const ignore = ['.git', 'node_modules', 'out', 'dist', '.DS_Store', 'Thumbs.db', '.agent', '.aider.tags.cache.v4'];

function getComment(name) {
    const ext = path.extname(name);
    if (name === 'package.json') return ' # إعدادات المشروع والاعتمادات';
    if (name === 'tsconfig.json') return ' # إعدادات TypeScript';
    if (name === 'vite.config.ts' || name === 'electron.vite.config.ts') return ' # إعدادات أداة البناء';
    if (name === 'README.md') return ' # تعليمات المشروع';
    if (name === 'index.html') return ' # ملف HTML الرئيسي';
    if (name === 'main') return ' # العملية الرئيسية (Backend)';
    if (name === 'renderer') return ' # واجهة المستخدم (Frontend)';
    if (name === 'preload') return ' # جسر التواصل (Preload)';
    if (name === 'components') return ' # مكونات الواجهة';
    if (name === 'routes') return ' # صفحات التطبيق';
    if (name === 'store') return ' # مخزن الحالة (State)';
    if (name === 'utils') return ' # أدوات مساعدة';
    if (name === 'styles') return ' # ملفات التنسيق';
    if (name === 'assets') return ' # الأصول (صور/خطوط)';
    if (name === 'hooks') return ' # خطافات React';
    if (name === 'BookReader') return ' # وحدة القارئ';
    return ''; // Default no comment for every single file to avoid clutter
}

function generateTree(dir, prefix = '') {
    let output = '';
    let files = fs.readdirSync(dir).filter(f => !ignore.includes(f));
    
    // Sort: libraries/folders first, then files
    files.sort((a, b) => {
        const aPath = path.join(dir, a);
        const bPath = path.join(dir, b);
        const aStat = fs.statSync(aPath);
        const bStat = fs.statSync(bPath);
        if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
        if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
        return a.localeCompare(b);
    });

    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└─' : '├─';
        
        const comment = getComment(file);
        
        output += `${prefix}${connector} ${file}${comment}\n`;

        if (stats.isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            output += generateTree(filePath, newPrefix);
        } else if (isLast && prefix === '') {
            // Root level spacing
            output += '│\n'; 
        }
    });
    return output;
}

const tree = `# 🌳 هيكل المشروع الكامل (كل الملفات)\n\nbook-magic-desktop/\n│\n${generateTree(rootDir)}`;

fs.writeFileSync(outputFile, tree);
console.log('Done');
