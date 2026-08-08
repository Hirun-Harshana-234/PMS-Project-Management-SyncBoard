import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="site-header">
      <div className="header-container">

        <div className="brand-section">

          <div className="brand-icon">
            SB
          </div>

          <div className="brand-text">
            <h2>SyncBoard</h2>
            <span>Collaborative Task Management</span>
          </div>

        </div>

        <nav className="main-navigation">

          <NavLink to="/" end>
            Dashboard
          </NavLink>

          <NavLink to="/tasks/new">
            New Task
          </NavLink>

          <a href="#">
            Teams
          </a>

          <a href="#">
            Reports
          </a>

        </nav>

        <div className="header-right">

          <button className="header-icon">
            🔔
          </button>

          <button className="header-icon">
            💬
          </button>

          <div className="profile">

            <div className="profile-avatar">
              {user?.username?.slice(0, 2).toUpperCase() || "US"}
            </div>

            <div>

              <strong>{user?.username ?? "Guest"}</strong>

              <small>Administrator</small>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}