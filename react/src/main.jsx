import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import NovelPage from "./pages/NovelPage";
import ReaderPage from "./pages/ReaderPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/novel/:novelId" element={<NovelPage />} />
        <Route path="/novel/:novelId/:chapterId" element={<ReaderPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
