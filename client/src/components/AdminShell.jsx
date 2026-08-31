import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Logo from "./Logo";

const adminNav = [
  { to: "/admin-dashboard.html", label: "Dashboard", icon: "dashboard" },
  { to: "/admin-tasks.html", label: "Tasks", icon: "tasks" },
  { to: "/admin-add-task.html", label: "Add Task", icon: "plus" },
  { to: "/admin-members.html", label: "Members", icon: "team" },
  { to: "/admin-reports.html", label: "Reports", icon: "reports" },
  { to: "/admin-requests.html", label: "Requests", icon: "request" },
  { to: "/admin-settings.html", label: "Settings", icon: "settings" }
];

export default function AdminShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = adminNav.find((item) => item.to === location.pathname)?.label || "Administration";
  async function signOut() { await logout(); window.location.replace("/admin-login.html"); }
  return <div className="app-shell admin-shell">
    <aside className={`sidebar admin-sidebar ${menuOpen ? "open" : ""}`}>
      <div className="brand"><Logo /></div>
      <span className="admin-mode-label">Administration</span>
      <nav className="main-nav" aria-label="Administrator navigation">
        {adminNav.map((item) => <NavLink key={item.to} to={item.to} reloadDocument onClick={() => setMenuOpen(false)}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-profile"><Avatar user={user} /><div><strong>{user?.displayName}</strong><small>@{user?.username}</small></div></div>
        <button className="sidebar-logout" onClick={signOut}><Icon name="logout" /><span>Admin logout</span></button>
      </div>
    </aside>
    {menuOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <div className="app-main">
      <header className="topbar admin-topbar"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button><div><span className="topbar-kicker">PMS Administration</span><h1>{title}</h1></div><div className="topbar-actions"><span className="admin-badge">Administrator</span><div className="topbar-user"><Avatar user={user} size="small" /><div><strong>{user?.displayName}</strong><span>Administrator</span></div></div></div></header>
      <main className="page-content"><Outlet /></main>
    </div>
  </div>;
}
