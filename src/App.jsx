import { Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import NewTaskPage from "./pages/NewTaskPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={<ProtectedRoute><BoardPage /></ProtectedRoute>}
          />

          <Route
            path="/tasks/new"
            element={<ProtectedRoute><NewTaskPage /></ProtectedRoute>}
          />

          <Route
            path="/tasks/:id"
            element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </main>
    </div>
  );
}