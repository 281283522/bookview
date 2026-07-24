// 从根目录 novels/ 复制到 public/novels/，并生成 manifest.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../novels');
const destDir = path.resolve(__dirname, '../public/novels');

// 1. 清空并重建 public/novels/
fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });

// 2. 递归复制所有 .md 文件
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.name.endsWith('.md')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(srcDir, destDir);

// 3. 扫描并生成 manifest
const manifest = [];
function scanDir(dir, base = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      scanDir(path.join(dir, entry.name), relative);
    } else if (entry.name.endsWith('.md')) {
      const parts = relative.split('/');
      if (parts.length === 2) {
        manifest.push({ dir: parts[0], filename: parts[1] });
      }
    }
  }
}
scanDir(destDir);

const manifestPath = path.join(destDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✓ 复制 novels 并生成 manifest.json: ${manifest.length} 个文件`);
