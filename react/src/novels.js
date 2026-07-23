// 使用 Vite 的 import.meta.glob 在构建时批量导入 novels 目录下的所有 .md 文件
const mdModules = import.meta.glob('/../novels/**/*.md', { query: '?raw', import: 'default' });

/**
 * 解析小说目录结构，返回所有小说及其章节列表
 * @returns {Promise<Array>} [{ id, title, outline, characters, chapters: [{ id, title, file }] }]
 */
export async function loadNovels() {
  const novelMap = {};

  for (const [path, loader] of Object.entries(mdModules)) {
    const match = path.match(/\/novels\/([^/]+)\/(.+)\.md$/);
    if (!match) continue;
    const [, novelDir, filename] = match;

    if (!novelMap[novelDir]) {
      novelMap[novelDir] = {
        id: novelDir,
        title: novelDir,
        outline: null,
        characters: null,
        chapters: [],
      };
    }

    const raw = await loader();
    const firstLine = raw.split('\n')[0]?.replace(/^#\s+/, '').trim() || '';

    if (filename === '00-大纲') {
      novelMap[novelDir].outline = { title: firstLine, raw };
    } else if (filename === '01-人物档案') {
      novelMap[novelDir].characters = { title: firstLine, raw };
    } else {
      const chMatch = filename.match(/^第(\d+)章-(.+)$/);
      if (chMatch) {
        novelMap[novelDir].chapters.push({
          id: `ch${chMatch[1]}`,
          index: parseInt(chMatch[1]),
          title: firstLine,
          filename,
          raw,
        });
      }
    }
  }

  // 排序章节
  const novels = Object.values(novelMap).map((n) => ({
    ...n,
    chapters: n.chapters.sort((a, b) => a.index - b.index),
  }));

  return novels;
}
