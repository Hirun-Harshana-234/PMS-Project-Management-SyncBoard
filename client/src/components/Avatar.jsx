export default function Avatar({ user, size = "medium", showStatus = false, online = false }) {
  const initials = (user?.displayName || user?.username || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className={`avatar avatar-${size} ${user?.avatarData ? "has-image" : ""}`} style={{ background: user?.avatarColor || "#3d73ff" }} title={user?.displayName || user?.username}>
      {user?.avatarData ? <img src={user.avatarData} alt="" /> : initials}
      {showStatus && <span className={`presence-dot ${online ? "online" : ""}`} />}
    </span>
  );
}
