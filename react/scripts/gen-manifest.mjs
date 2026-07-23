// 扫描 novels 目录，生成 manifest.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const novelsDir = path.resolve(__dirname, '../public/novels');
const manifestPath = path.join(novelsDir, 'manifest.json');

const manifest = [];
const files = fs.readdirSync(novelsDir, { recursive: true });

for (const f of files) {
  if (!f.endsWith('.md')) continue;
  // f 格式: "玻璃裂隙/第01章-最后的选择.md"
  const parts = f.replace(/\\/g, '/').split('/');
  if (parts.length !== 2) continue;
  const [dir, filename] = parts;
  manifest.push({ dir, filename });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✓ 生成 manifest.json: ${manifest.length} 个文件`);
