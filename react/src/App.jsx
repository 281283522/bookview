import './App.css';

import TestPage from './components/TestPage';
function App() {
  return (
    <div className="app">
      <div className="apk-download">
        <div className="apk-download-header">
          <span className="apk-icon">📲</span>
          <span>APK 下载</span>
        </div>
        <div className="apk-download-links">
          <a
            className="apk-btn apk-release"
            href="/src/assets/app-release.apk"
            download="app-release.apk"
          >
            <span className="apk-btn-icon">🚀</span>
            <span className="apk-btn-text">
              <span className="apk-btn-label">正式版</span>
              <span className="apk-btn-size">app-release.apk</span>
            </span>
          </a>
          <a
            className="apk-btn apk-debug"
            href="/src/assets/app-debug.apk"
            download="app-debug.apk"
          >
            <span className="apk-btn-icon">🔧</span>
            <span className="apk-btn-text">
              <span className="apk-btn-label">调试版</span>
              <span className="apk-btn-size">app-debug.apk</span>
            </span>
          </a>
        </div>
      </div>
      <TestPage />
    </div>
  );
}

export default App;
