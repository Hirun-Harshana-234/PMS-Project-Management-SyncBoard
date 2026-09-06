import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import Logo from "../components/Logo";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ displayName: "", username: "", email: "", login: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { user, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (user) return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/home"} replace />;

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function useDemoAccount() { setMode("login"); setForm((current) => ({ ...current, login: "login@pms", password: "pms@123" })); setError(""); }
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.password || (mode === "login" ? !form.login.trim() : !form.displayName.trim() || !form.username.trim() || !form.email.trim())) return setError("Complete all required fields.");
    setSaving(true);
    try {
      if (mode === "login") await login(form.login.trim(), form.password);
      else await register({ displayName: form.displayName.trim(), username: form.username.trim(), email: form.email.trim(), password: form.password });
      if (remember && mode === "login") localStorage.setItem("pms:rememberedLogin", form.login.trim());
      navigate(location.state?.from?.pathname || "/home", { replace: true });
    } catch (authError) { setError(authError.message); }
    finally { setSaving(false); }
  }

  return <main className="auth-page reference-auth-page">
    <section className="auth-story"><div className="auth-brand"><Logo /></div><div className="auth-copy"><span className="auth-eyebrow">Project Management SyncBoard</span><h1>Sync People.<br />Track Progress.<br /><em>Achieve More.</em></h1><p>Bring your project team, assignments, comments and progress updates together in one clean workspace.</p></div><div className="auth-feature-grid"><article><span>✓</span><strong>Tasks</strong></article><article><span>♟</span><strong>Members</strong></article><article><span>↗</span><strong>Progress</strong></article></div><div className="auth-orbit"><span /><span /><span /></div></section>
    <section className="auth-panel"><form className="auth-card reference-auth-card" onSubmit={submit}><div className="mobile-auth-brand"><Logo /></div><span className="eyebrow">{mode === "login" ? "Member access" : "Create your workspace"}</span><h2>{mode === "login" ? "Welcome Back!" : "Create member account"}</h2><p>{mode === "login" ? "Please sign in to your PMS (Project Management SyncBoard) account." : "Create a member account to join projects, update tasks, and collaborate with your team."}</p>{error && <div className="form-alert" role="alert">{error}</div>}{mode === "register" && <div className="form-row"><label>Full name<span>*</span><input value={form.displayName} onChange={(event) => update("displayName", event.target.value)} autoComplete="name" placeholder="Project member" /></label><label>Username<span>*</span><input value={form.username} onChange={(event) => update("username", event.target.value)} autoComplete="username" placeholder="your.username" /></label></div>}{mode === "register" && <label>Email address<span>*</span><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>}{mode === "login" && <label>Username<input value={form.login} onChange={(event) => update("login", event.target.value)} autoComplete="username" placeholder="Enter your username" autoFocus /></label>}<label>Password<div className="password-input"><input type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div></label>{mode === "login" && <div className="auth-options"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember me</label><span>Secure project access</span></div>}<button className="button primary auth-submit" disabled={saving}>{saving ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}<Icon name="chevron" size={18} /></button>{mode === "login" && <button type="button" className="demo-credentials" onClick={useDemoAccount}><span>Demo access</span><strong>Username: login@pms</strong><small>Password: pms@123 · Click to fill</small></button>}<div className="auth-switch">{mode === "login" ? "Need a member account?" : "Already have an account?"}<button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Create one" : "Sign in"}</button></div><div className="auth-secondary-links"><Link className="admin-login-link" to="/admin/login"><Icon name="admin" size={17} />Administrator Login <Icon name="chevron" size={15} /></Link></div></form></section>
  </main>;
}
