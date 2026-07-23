import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadNovels } from '../novels';

export default function NovelPage() {
  const { novelId } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNovels().then((novels) => {
      const found = novels.find((n) => n.id === decodeURIComponent(novelId));
      setNovel(found || null);
      setLoading(false);
    });
  }, [novelId]);

  if (loading) {
    return (
      <div className="page novel-page">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="page novel-page">
        <div className="error-message">
          <h2>作品未找到</h2>
          <Link to="/" className="back-link">返回书架</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page novel-page">
      <header className="novel-header">
        <Link to="/" className="back-btn">← 书架</Link>
        <h1 className="novel-title">{novel.title}</h1>
        <p className="novel-desc">{novel.chapters.length} 章 · 共 {novel.chapters.length > 0 ? `第${novel.chapters[0].index}-${novel.chapters[novel.chapters.length - 1].index}章` : ''}</p>
      </header>

      <div className="novel-extras">
        {novel.outline && (
          <Link to={`/novel/${novel.id}/outline`} className="extra-link">
            📋 {novel.outline.title}
          </Link>
        )}
        {novel.characters && (
          <Link to={`/novel/${novel.id}/characters`} className="extra-link">
            👤 {novel.characters.title}
          </Link>
        )}
      </div>

      <div className="chapter-list">
        <h2 className="section-title">目录</h2>
        {novel.chapters.map((ch) => (
          <Link
            to={`/novel/${novel.id}/${ch.id}`}
            key={ch.id}
            className="chapter-item"
          >
            <span className="chapter-index">第{String(ch.index).padStart(2, '0')}章</span>
            <span className="chapter-title">{ch.title.replace(/^第\d+章\s*/, '')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
