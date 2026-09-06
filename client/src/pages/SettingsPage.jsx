import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";

const defaults = { darkMode: false, compact: false, desktopNotifications: true, emailUpdates: false, reducedMotion: false };

export default function SettingsPage({ adminMode = false }) {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState(() => { try { return { ...defaults, ...JSON.parse(localStorage.getItem("pms:settings")) }; } catch { return defaults; } });
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
    document.documentElement.dataset.compact = settings.compact ? "true" : "false";
    document.documentElement.dataset.motion = settings.reducedMotion ? "reduced" : "full";
  }, [settings]);
  useEffect(() => { setProfilePhoto(user?.avatarData || ""); }, [user]);

  function toggle(key) { setSettings((current) => ({ ...current, [key]: !current[key] })); setSaved(""); }
  function save() { localStorage.setItem("pms:settings", JSON.stringify(settings)); setSaved("Preferences saved successfully."); }
  async function savePhoto(avatarData) {
    const previous = profilePhoto;
    setProfilePhoto(avatarData);
    setSaved("");
    try { await updateProfile({ avatarData }); setSaved("Profile photo saved successfully."); }
    catch (error) { setProfilePhoto(previous); setSaved(error.message); }
  }

  return <section className="content-section narrow settings-page">
    <header className="page-heading"><div><span className="eyebrow">{adminMode ? "Administrator preferences" : "User and system preferences"}</span><h2>Settings</h2><p>Customize PMS appearance, density, notifications, accessibility, and your profile image.</p></div></header>
    {saved && <div className={saved.includes("successfully") ? "success-alert" : "form-alert"}>{saved}</div>}
    <div className="settings-grid">
      <section className="panel settings-section settings-profile-section"><header><span className="settings-icon"><Icon name="profile" /></span><div><h3>Profile photo</h3><p>Choose an image from your desktop so teammates can recognize you.</p></div></header><div className="settings-profile-body"><ProfilePhotoPicker user={user} value={profilePhoto} onChange={savePhoto} compact /><div className="settings-profile-account"><strong>{user.displayName}</strong><span>@{user.username} · {user.jobTitle || "Project Member"}</span><small>Photo changes are saved to your member account immediately.</small></div></div></section>
      <section className="panel settings-section"><header><span className="settings-icon"><Icon name="moon" /></span><div><h3>Appearance</h3><p>Control how the workspace looks and feels.</p></div></header><label className="setting-row"><div><strong>Dark mode</strong><span>Use a darker color theme throughout PMS.</span></div><span className="switch"><input type="checkbox" checked={settings.darkMode} onChange={() => toggle("darkMode")} /><span /></span></label><label className="setting-row"><div><strong>Compact layout</strong><span>Reduce page and card spacing to show more information.</span></div><span className="switch"><input type="checkbox" checked={settings.compact} onChange={() => toggle("compact")} /><span /></span></label><label className="setting-row"><div><strong>Reduce motion</strong><span>Minimize interface animation and transition effects.</span></div><span className="switch"><input type="checkbox" checked={settings.reducedMotion} onChange={() => toggle("reducedMotion")} /><span /></span></label></section>
      <section className="panel settings-section"><header><span className="settings-icon"><Icon name="bell" /></span><div><h3>Notifications</h3><p>Choose which task and system alerts are emphasized.</p></div></header><label className="setting-row"><div><strong>Workspace notifications</strong><span>Highlight live task, comment, and member activity.</span></div><span className="switch"><input type="checkbox" checked={settings.desktopNotifications} onChange={() => toggle("desktopNotifications")} /><span /></span></label><label className="setting-row"><div><strong>Email summaries</strong><span>Remember your preference for future email integration.</span></div><span className="switch"><input type="checkbox" checked={settings.emailUpdates} onChange={() => toggle("emailUpdates")} /><span /></span></label></section>
      <section className="panel settings-section account-settings"><header><span className="settings-icon"><Icon name={adminMode ? "admin" : "profile"} /></span><div><h3>{adminMode ? "Administrator account" : "Account"}</h3><p>Current authenticated identity and access level.</p></div></header><dl><div><dt>Name</dt><dd>{user.displayName}</dd></div><div><dt>Username</dt><dd>{user.username}</dd></div><div><dt>Role</dt><dd>{user.role}</dd></div><div><dt>Department</dt><dd>{user.department || "Project Team"}</dd></div></dl>{!adminMode && <Link className="button secondary" to="/profile">Edit profile details</Link>}</section>
    </div>
    <div className="settings-actions"><button className="button primary" onClick={save}>Save settings</button></div>
  </section>;
}
