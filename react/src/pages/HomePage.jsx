import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadNovels } from '../novels';

export default function HomePage() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNovels().then((data) => {
      setNovels(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page home-page">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <header className="home-header">
        <h1 className="home-title">小说书架</h1>
        <p className="home-subtitle">{novels.length} 部作品</p>
      </header>
      <div className="novel-list">
        {novels.map((novel) => (
          <Link to={`/novel/${novel.id}`} key={novel.id} className="novel-card">
            <div className="novel-card-cover">
              <span className="novel-card-emoji">📖</span>
            </div>
            <div className="novel-card-info">
              <h2 className="novel-card-title">{novel.title}</h2>
              <p className="novel-card-meta">
                {novel.chapters.length} 章 · {novel.outline ? '含大纲' : ''}
              </p>
            </div>
            <span className="novel-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
