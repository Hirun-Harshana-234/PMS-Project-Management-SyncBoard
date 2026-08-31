import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBoards } from "../context/BoardContext";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Logo from "./Logo";

const nav = [
  { to: "/home.html", label: "Home", icon: "home" },
  { to: "/tasks.html", label: "View Tasks", icon: "tasks" },
  { to: "/members.html", label: "Members", icon: "team" },
  { to: "/contact.html", label: "Contact", icon: "message" },
  { to: "/dashboard.html", label: "Dashboard", icon: "dashboard" },
  { to: "/board.html", label: "Project Board", icon: "board" },
  { to: "/add-task.html", label: "Add Task", icon: "plus" },
  { to: "/reports.html", label: "Reports", icon: "reports" },
  { to: "/notifications.html", label: "Notifications", icon: "bell" },
  { to: "/request-admin.html", label: "Request Admin", icon: "request" },
  { to: "/settings.html", label: "Settings", icon: "settings" }
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { board, activities, messages, isOffline, pendingCount } = useBoards();
  const location = useLocation();
  const [readAt, setReadAt] = useState(() => Number(localStorage.getItem("pms:notificationsReadAt") || 0));
  useEffect(() => {
    const markRead = () => setReadAt(Number(localStorage.getItem("pms:notificationsReadAt") || Date.now()));
    window.addEventListener("pms:notifications-read", markRead);
    return () => window.removeEventListener("pms:notifications-read", markRead);
  }, []);
  const current = nav.find((item) => item.to === location.pathname);
  const title = current?.label || (location.pathname === "/profile.html" ? "Profile" : board?.title || "PMS");
  const unread = useMemo(() => {
    return activities.filter((item) => new Date(item.createdAt).getTime() > readAt).length;
  }, [activities, readAt]);
  const unreadMessages = useMemo(() => messages.filter((message) => (message.recipient?.id || message.recipient) === user?.id && !message.readAt).length, [messages, user]);

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="brand"><Logo /></div>
      <nav className="main-nav" aria-label="Member navigation">
        {nav.map((item) => <NavLink key={item.to} to={item.to} reloadDocument onClick={() => setMenuOpen(false)}><Icon name={item.icon} /><span>{item.label}</span>{item.to === "/notifications.html" && unread > 0 && <b className="nav-badge">{Math.min(unread, 99)}</b>}{item.to === "/contact.html" && unreadMessages > 0 && <b className="nav-badge">{Math.min(unreadMessages, 99)}</b>}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <Link className="sidebar-profile" to="/profile.html" reloadDocument><Avatar user={user} /><div><strong>{user?.displayName}</strong><small>{user?.jobTitle || `@${user?.username}`}</small></div></Link>
        <button className="sidebar-logout" onClick={logout}><Icon name="logout" /><span>Sign out</span></button>
      </div>
    </aside>
    {menuOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <div className="app-main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        <div><span className="topbar-kicker">PMS Workspace</span><h1>{title}</h1></div>
        <div className="topbar-actions">
          {(isOffline || pendingCount > 0) && <span className="sync-pill"><Icon name="wifiOff" size={16} />{pendingCount ? `${pendingCount} pending` : "Offline"}</span>}
          <NavLink className="topbar-notifications" to="/notifications.html" reloadDocument aria-label="Notifications"><Icon name="bell" size={19} />{unread > 0 && <span>{Math.min(unread, 9)}</span>}</NavLink>
          <div className="topbar-user"><Avatar user={user} size="small" /><div><strong>{user?.displayName}</strong><span>Member</span></div></div>
        </div>
      </header>
      <main className="page-content"><Outlet /></main>
    </div>
    <Link className="admin-fab" to="/admin-login.html" reloadDocument title="Open administrator panel" aria-label="Open administrator panel"><Icon name="admin" /><span>Admin</span></Link>
  </div>;
}
