import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import Modal from "../components/Modal";

const emptyForm = { displayName: "", username: "", email: "", password: "", jobTitle: "", department: "", boardId: "", boardRole: "editor" };

export default function AdminMembersPage() {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const [userData, boardData] = await Promise.all([api.get("/admin/users"), api.get("/boards")]);
      setUsers(userData.users);
      setBoards(boardData.boards);
    } catch (loadError) { setError(loadError.message); }
  }
  useEffect(() => { load(); }, []);

  async function updateUser(user, changes) {
    setError("");
    try {
      const result = await api.patch(`/admin/users/${user.id}`, changes);
      setUsers((current) => current.map((item) => item.id === result.user.id ? result.user : item));
    } catch (updateError) { setError(updateError.message); }
  }

  async function createMember(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const result = await api.post("/admin/users", { ...form, boardId: form.boardId || null });
      setUsers((current) => [result.user, ...current]);
      setForm(emptyForm);
      setModalOpen(false);
      setNotice(`Member account created for @${result.user.username}. Share the login details securely with the member.`);
    } catch (createError) { setError(createError.message); }
    finally { setSaving(false); }
  }

  const filtered = useMemo(() => users.filter((user) => `${user.displayName} ${user.username} ${user.email} ${user.jobTitle} ${user.department}`.toLowerCase().includes(query.toLowerCase())), [users, query]);
  return <section className="content-section admin-members-page">
    <header className="page-heading"><div><span className="eyebrow">People and permissions</span><h2>Member management</h2><p>Create login credentials for each member and review project role, department, progress, and system access.</p></div><div className="heading-actions"><span className="admin-badge">{users.length} accounts</span><button className="button primary" onClick={() => { setError(""); setModalOpen(true); }}><Icon name="plus" size={18} />Add member</button></div></header>
    {error && <div className="form-alert" role="alert">{error}</div>}
    {notice && <div className="success-alert" role="status">{notice}</div>}
    <div className="panel admin-users"><div className="panel-heading"><label className="search-control"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members…" /></label><span>{filtered.length} visible</span></div><div className="responsive-table"><table><thead><tr><th>Member / login</th><th>Project role</th><th>Department</th><th>Progress</th><th>System role</th><th>Access</th><th>Joined</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><div className="table-user"><Avatar user={user} size="small" /><div><strong>{user.displayName}</strong><span>@{user.username} · {user.email}</span></div></div></td><td>{user.jobTitle || "Project Member"}</td><td>{user.department || "Project Team"}</td><td><div className="table-progress"><div><span style={{ width: `${user.progress || 0}%` }} /></div><b>{user.progress || 0}%</b></div></td><td><select value={user.role} onChange={(event) => updateUser(user, { role: event.target.value })}><option value="user">Member</option><option value="admin">Admin</option></select></td><td><label className="switch"><input type="checkbox" checked={user.active} onChange={(event) => updateUser(user, { active: event.target.checked })} /><span /></label></td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>{!filtered.length && <div className="empty-table"><Icon name="team" /><h3>No members found</h3><p>Try another search or create a new member account.</p></div>}</div></div>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a project member" eyebrow="Create login access">
      <form className="form-stack" onSubmit={createMember}><p className="modal-intro">Give the member a username and password so they can sign in and update their assigned task progress.</p>{error && <div className="form-alert">{error}</div>}<div className="form-row"><label>Full name<span>*</span><input required value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} placeholder="Member name" /></label><label>Username<span>*</span><input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="member.username" /></label></div><label>Email address<span>*</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="member@example.com" /></label><label>Login password<span>*</span><input required type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters with a number" /></label><div className="form-row"><label>Job title<input value={form.jobTitle} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} placeholder="Frontend Developer" /></label><label>Department<input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} placeholder="Engineering" /></label></div><div className="form-row"><label>Add to project board<select value={form.boardId} onChange={(event) => setForm({ ...form, boardId: event.target.value })}><option value="">Create account only</option>{boards.map((board) => <option value={board.id} key={board.id}>{board.title}</option>)}</select></label><label>Board access<select value={form.boardRole} onChange={(event) => setForm({ ...form, boardRole: event.target.value })}><option value="editor">Editor — update tasks</option><option value="viewer">Viewer — read only</option></select></label></div><div className="form-actions"><span /><button type="button" className="button secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="button primary" disabled={saving}>{saving ? "Creating…" : "Create member account"}</button></div></form>
    </Modal>
  </section>;
}
