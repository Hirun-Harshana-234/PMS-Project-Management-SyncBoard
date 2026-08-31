import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import TasksPage from "./pages/TasksPage";
import AddTaskPage from "./pages/AddTaskPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import RequestsPage from "./pages/RequestsPage";
import SettingsPage from "./pages/SettingsPage";
import ActivityPage from "./pages/ActivityPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminMembersPage from "./pages/AdminMembersPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AppShell from "./components/AppShell";
import AdminShell from "./components/AdminShell";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return <Routes>
    <Route path="/login.html" element={<AuthPage />} />
    <Route path="/admin-login.html" element={<AdminLoginPage />} />
    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route index element={<Navigate to="/home.html" replace />} />
      <Route path="home.html" element={<HomePage />} />
      <Route path="dashboard.html" element={<DashboardPage />} />
      <Route path="board.html" element={<BoardPage />} />
      <Route path="tasks.html" element={<TasksPage />} />
      <Route path="add-task.html" element={<AddTaskPage />} />
      <Route path="members.html" element={<TeamPage />} />
      <Route path="contact.html" element={<ContactPage />} />
      <Route path="reports.html" element={<ReportsPage />} />
      <Route path="notifications.html" element={<NotificationsPage />} />
      <Route path="request-admin.html" element={<RequestsPage />} />
      <Route path="settings.html" element={<SettingsPage />} />
      <Route path="activity.html" element={<ActivityPage />} />
      <Route path="profile.html" element={<ProfilePage />} />
      <Route path="team.html" element={<Navigate to="/members.html" replace />} />
    </Route>
    <Route path="/admin.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<Navigate to="/admin-dashboard.html" replace />} />
    </Route>
    <Route path="/admin-dashboard.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<AdminPage />} />
    </Route>
    <Route path="/admin-tasks.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<TasksPage adminMode />} />
    </Route>
    <Route path="/admin-add-task.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<AddTaskPage adminMode />} />
    </Route>
    <Route path="/admin-members.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<AdminMembersPage />} />
    </Route>
    <Route path="/admin-reports.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<ReportsPage adminMode />} />
    </Route>
    <Route path="/admin-requests.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<AdminRequestsPage />} />
    </Route>
    <Route path="/admin-settings.html" element={<ProtectedRoute admin adminRedirect><AdminShell /></ProtectedRoute>}>
      <Route index element={<SettingsPage adminMode />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
