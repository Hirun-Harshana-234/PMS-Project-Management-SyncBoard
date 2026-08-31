import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBoards } from "../context/BoardContext";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";

export default function ContactPage() {
  const { user } = useAuth();
  const { board, onlineUserIds, messages, loadMessages, sendMessage, markMessageRead } = useBoards();
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState("message");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const contacts = useMemo(() => (board?.members || []).map((member) => member.user).filter((member) => member?.id !== user?.id && member?.active !== false), [board, user]);
  const visibleContacts = useMemo(() => contacts.filter((member) => `${member.displayName} ${member.username} ${member.jobTitle}`.toLowerCase().includes(search.toLowerCase())), [contacts, search]);
  const selected = contacts.find((member) => member.id === selectedId) || contacts[0];
  const conversation = useMemo(() => messages.filter((message) => {
    const participantIds = [message.sender?.id || message.sender, message.recipient?.id || message.recipient];
    return selected && participantIds.includes(selected.id);
  }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [messages, selected]);

  useEffect(() => {
    if (!board?.id) return;
    setLoading(true);
    loadMessages().catch((error) => setStatus(error.message)).finally(() => setLoading(false));
  }, [board?.id]);
  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
    if (!selected && selectedId) setSelectedId("");
  }, [selected, selectedId]);
  useEffect(() => {
    if (!selected) return;
    conversation.filter((message) => !message.readAt && (message.recipient?.id || message.recipient) === user?.id).forEach((message) => { markMessageRead(message.id).catch(() => {}); });
  }, [selected?.id, conversation.length]);

  async function submit(event) {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    setStatus("");
    try { await sendMessage(selected.id, draft.trim(), kind); setDraft(""); setKind("message"); }
    catch (error) { setStatus(error.message); }
  }

  if (!board) return <section className="empty-state"><h2>No project selected</h2><p>Choose a project board before contacting another member.</p></section>;
  return <section className="content-section contact-page">
    <header className="page-heading"><div><span className="eyebrow">Project communication</span><h2>Contact members</h2><p>Ask for help, share context, and keep project conversations connected to the team workspace.</p></div><span className="context-chip">{contacts.length} teammates</span></header>
    {status && <div className="form-alert" role="alert">{status}</div>}
    <div className="contact-layout panel">
      <aside className="contact-list"><div className="contact-list-heading"><div><h3>Project members</h3><span>Choose someone to contact</span></div><span>{contacts.filter((member) => onlineUserIds.includes(member.id)).length} online</span></div><label className="search-control contact-search"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members…" /></label><div className="contact-options">{visibleContacts.map((member) => { const unread = messages.filter((message) => (message.sender?.id || message.sender) === member.id && (message.recipient?.id || message.recipient) === user.id && !message.readAt).length; return <button className={`contact-option ${selected?.id === member.id ? "active" : ""}`} key={member.id} onClick={() => setSelectedId(member.id)}><Avatar user={member} size="medium" showStatus online={onlineUserIds.includes(member.id)} /><span><strong>{member.displayName}</strong><small>{member.jobTitle || "Project member"}</small></span>{unread > 0 && <b>{unread}</b>}</button>; })}{!visibleContacts.length && <div className="contact-empty">No matching members.</div>}</div></aside>
      <section className="conversation-panel"><header className="conversation-header">{selected ? <><Avatar user={selected} size="large" showStatus online={onlineUserIds.includes(selected.id)} /><div><h3>{selected.displayName}</h3><span>{selected.jobTitle || "Project member"} · {onlineUserIds.includes(selected.id) ? "Online now" : "Available for project support"}</span></div><a href={`mailto:${selected.email}`} className="icon-button bordered" aria-label={`Email ${selected.displayName}`}><Icon name="mail" size={18} /></a></> : <div><h3>Select a teammate</h3><span>Start a project conversation.</span></div>}</header><div className="conversation-messages">{loading && <div className="conversation-empty">Loading conversation…</div>}{!loading && selected && !conversation.length && <div className="conversation-empty"><span className="empty-visual"><Icon name="message" size={28} /></span><h3>Start the conversation</h3><p>Ask {selected.displayName.split(" ")[0]} for project help or share an update.</p></div>}{conversation.map((message) => { const sent = (message.sender?.id || message.sender) === user.id; return <article className={`message-bubble ${sent ? "sent" : "received"}`} key={message.id}><div className="message-bubble-head">{message.kind === "help" && <span className="help-badge"><Icon name="request" size={13} />Help request</span>}<time>{new Date(message.createdAt).toLocaleString()}</time></div><p>{message.body}</p>{!sent && <small>From {message.sender?.displayName || "teammate"}</small>}</article>; })}</div>{selected && <form className="message-composer" onSubmit={submit}><div className="composer-tools"><select value={kind} onChange={(event) => setKind(event.target.value)} aria-label="Message type"><option value="message">Message</option><option value="help">Ask for help</option></select><span>{draft.length}/2000</span></div><div className="composer-input"><textarea value={draft} maxLength="2000" onChange={(event) => setDraft(event.target.value)} placeholder={`Write to ${selected.displayName.split(" ")[0]}…`} /><button className="button primary" disabled={!draft.trim()}><Icon name="message" size={17} />Send</button></div></form>}</section>
    </div>
  </section>;
}
