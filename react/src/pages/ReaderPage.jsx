import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loadNovels } from '../novels';

function parseMarkdown(raw) {
  if (!raw) return '';
  let html = raw
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 分割线
    .replace(/^---$/gm, '<hr />')
    // 加粗
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 空行变段落分隔
    .replace(/\n\n+/g, '</p><p>');

  html = '<p>' + html + '</p>';
  // 修复：标题和分割线前后不要被 p 标签包裹
  html = html.replace(/<p><(h[1-3]|hr)\b/g, '<$1');
  html = html.replace(/<\/(h[1-3])><\/p>/g, '</$1>');
  html = html.replace(/<p><\/p>/g, '');
  // 换行
  html = html.replace(/\n/g, '<br />');

  return html;
}

export default function ReaderPage() {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState('dark'); // dark | sepia | light

  const decodedNovelId = decodeURIComponent(novelId);

  useEffect(() => {
    loadNovels().then((novels) => {
      const found = novels.find((n) => n.id === decodedNovelId);
      setNovel(found || null);
      setLoading(false);
    });
  }, [novelId, decodedNovelId]);

  useEffect(() => {
    if (!novel) return;
    let raw = '';
    let t = '';

    if (chapterId === 'outline' && novel.outline) {
      raw = novel.outline.raw;
      t = novel.outline.title;
    } else if (chapterId === 'characters' && novel.characters) {
      raw = novel.characters.raw;
      t = novel.characters.title;
    } else {
      const ch = novel.chapters.find((c) => c.id === chapterId);
      if (ch) {
        raw = ch.raw;
        t = ch.title;
      }
    }

    setContent(parseMarkdown(raw));
    setTitle(t);
    // 滚动到顶部
    window.scrollTo(0, 0);
  }, [novel, chapterId]);

  const chapterNav = useCallback(() => {
    if (!novel || chapterId === 'outline' || chapterId === 'characters') return null;

    const idx = novel.chapters.findIndex((c) => c.id === chapterId);
    if (idx === -1) return null;
    return {
      prev: idx > 0 ? novel.chapters[idx - 1] : null,
      next: idx < novel.chapters.length - 1 ? novel.chapters[idx + 1] : null,
    };
  }, [novel, chapterId]);

  const toggleTheme = () => {
    const themes = ['dark', 'sepia', 'light'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
  };

  const themeNames = { dark: '暗黑', sepia: '护眼', light: '亮白' };

  if (loading) {
    return (
      <div className="page reader-page">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (!novel || !content) {
    return (
      <div className="page reader-page">
        <div className="error-message">
          <h2>内容未找到</h2>
          <Link to="/" className="back-link">返回书架</Link>
        </div>
      </div>
    );
  }

  const nav = chapterNav();

  return (
    <div className={`page reader-page theme-${theme}`}>
      <header className="reader-header">
        <Link to={`/novel/${decodedNovelId}`} className="back-btn">← 目录</Link>
        <div className="reader-tools">
          <button onClick={toggleTheme} className="tool-btn" title="切换主题">
            {themeNames[theme]}
          </button>
          <button onClick={() => setFontSize(Math.max(14, fontSize - 1))} className="tool-btn" title="缩小字体">
            A-
          </button>
          <button onClick={() => setFontSize(Math.min(28, fontSize + 1))} className="tool-btn" title="放大字体">
            A+
          </button>
        </div>
      </header>

      <main className="reader-content" style={{ fontSize: `${fontSize}px` }}>
        <h1 className="reader-title">{title}</h1>
        <div
          className="reader-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

      {nav && (
        <footer className="reader-footer">
          {nav.prev && (
            <Link
              to={`/novel/${decodedNovelId}/${nav.prev.id}`}
              className="nav-link prev-chapter"
            >
              ← {nav.prev.title.replace(/^第\d+章\s*/, '')}
            </Link>
          )}
          <span className="nav-spacer" />
          {nav.next && (
            <Link
              to={`/novel/${decodedNovelId}/${nav.next.id}`}
              className="nav-link next-chapter"
            >
              {nav.next.title.replace(/^第\d+章\s*/, '')} →
            </Link>
          )}
        </footer>
      )}
    </div>
  );
}
