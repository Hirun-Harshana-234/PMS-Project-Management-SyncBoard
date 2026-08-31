import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";

const colors = ["#3d73ff", "#21bfd1", "#39bd84", "#8061ff", "#f1a53a"];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ displayName: "", email: "", avatarColor: "#3d73ff", avatarData: "" });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ displayName: user.displayName, email: user.email, avatarColor: user.avatarColor || "#3d73ff", avatarData: user.avatarData || "" });
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    setStatus("");
    setSaving(true);
    try { await updateProfile(form); setStatus("Profile saved successfully."); }
    catch (error) { setStatus(error.message); }
    finally { setSaving(false); }
  }

  return <section className="content-section narrow profile-page">
    <header className="page-heading"><div><span className="eyebrow">Personal settings</span><h2>Your profile</h2><p>Keep your identity recognizable to the people collaborating with you.</p></div></header>
    <div className="profile-layout">
      <aside className="profile-preview"><Avatar user={{ ...user, ...form }} size="xlarge" /><h3>{form.displayName || user.username}</h3><p>@{user.username}</p><span>{user.role}</span></aside>
      <form className="panel form-stack profile-form" onSubmit={submit}>
        {status && <div className={status.includes("successfully") ? "success-alert" : "form-alert"}>{status}</div>}
        <ProfilePhotoPicker user={user} value={form.avatarData} onChange={(avatarData) => { setForm({ ...form, avatarData }); setStatus(""); }} />
        <label>Display name<input value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} /></label>
        <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <fieldset className="color-field"><legend>Avatar fallback color</legend><div>{colors.map((color) => <button type="button" key={color} style={{ background: color }} className={form.avatarColor === color ? "selected" : ""} onClick={() => setForm({ ...form, avatarColor: color })} aria-label={`Use ${color}`} />)}</div></fieldset>
        <div className="account-facts"><div><span>Username</span><strong>@{user.username}</strong></div><div><span>Account role</span><strong>{user.role}</strong></div><div><span>Member since</span><strong>{new Date(user.createdAt).toLocaleDateString()}</strong></div></div>
        <div className="form-actions"><span /><button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></div>
      </form>
    </div>
  </section>;
}
