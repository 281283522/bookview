import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import NovelPage from "./pages/NovelPage";
import ReaderPage from "./pages/ReaderPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/novel/:novelId" element={<NovelPage />} />
        <Route path="/novel/:novelId/:chapterId" element={<ReaderPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
