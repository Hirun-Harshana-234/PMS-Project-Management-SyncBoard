import { Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import NewTaskPage from "./pages/NewTaskPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}