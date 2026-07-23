/**
 * 从 public/novels/ 通过 fetch 加载小说
 * 依赖 public/novels/manifest.json（由 scripts/gen-manifest.mjs 生成）
 */

let cache = null;

export async function loadNovels() {
  if (cache) return cache;

  // 1. 拉取文件清单
  const resp = await fetch('/novels/manifest.json');
  const files = await resp.json();

  // 2. 按小说目录分组，并发拉取所有 .md 文件
  const novelMap = {};

  const loads = files.map(async ({ dir, filename }) => {
    const mdResp = await fetch(`/novels/${dir}/${filename}`);
    const raw = await mdResp.text();
    const firstLine = raw.split('\n')[0]?.replace(/^#\s+/, '').trim() || '';

    if (!novelMap[dir]) {
      novelMap[dir] = {
        id: dir,
        title: dir,
        outline: null,
        characters: null,
        chapters: [],
      };
    }

    if (filename === '00-大纲.md') {
      novelMap[dir].outline = { title: firstLine, raw };
    } else if (filename === '01-人物档案.md') {
      novelMap[dir].characters = { title: firstLine, raw };
    } else {
      const chMatch = filename.match(/^第(\d+)章-(.+)\.md$/);
      if (chMatch) {
        novelMap[dir].chapters.push({
          id: `ch${chMatch[1]}`,
          index: parseInt(chMatch[1]),
          title: firstLine,
          filename,
          raw,
        });
      }
    }
  });

  await Promise.all(loads);

  // 3. 排序
  const novels = Object.values(novelMap).map((n) => ({
    ...n,
    chapters: n.chapters.sort((a, b) => a.index - b.index),
  }));

  cache = novels;
  return novels;
}
