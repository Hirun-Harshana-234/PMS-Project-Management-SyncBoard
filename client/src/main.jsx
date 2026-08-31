import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BoardProvider } from "./context/BoardContext";
import "./styles.css";

// Keep the multi-page structure real during normal clicks. React Router still
// provides route rendering and protected-route state, while HTML page links
// load their own entry document instead of staying inside one index page.
if (!window.__pmsHtmlNavigationHandler) {
  window.__pmsHtmlNavigationHandler = true;
  document.addEventListener("click", (event) => {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    const href = anchor?.getAttribute("href");
    if (!anchor || !href || !href.endsWith(".html") || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    event.stopPropagation();
    window.location.assign(destination.href);
  }, true);
}

try {
  const settings = JSON.parse(localStorage.getItem("pms:settings"));
  document.documentElement.dataset.theme = settings?.darkMode ? "dark" : "light";
  document.documentElement.dataset.compact = settings?.compact ? "true" : "false";
  document.documentElement.dataset.motion = settings?.reducedMotion ? "reduced" : "full";
} catch { document.documentElement.dataset.theme = "light"; }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><AuthProvider><BoardProvider><App /></BoardProvider></AuthProvider></BrowserRouter></React.StrictMode>
);
