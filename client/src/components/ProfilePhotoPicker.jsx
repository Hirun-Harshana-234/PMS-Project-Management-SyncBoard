import { useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) return reject(new Error("Choose a PNG, JPG, or WebP image."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The selected image could not be opened."));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / image.width, maxSize / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePhotoPicker({ user, value, onChange, compact = false }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try { onChange(await compressImage(file)); }
    catch (imageError) { setError(imageError.message); }
    finally { setBusy(false); }
  }

  return <div className={`profile-photo-picker ${compact ? "compact" : ""}`}>
    <Avatar user={{ ...user, avatarData: value }} size={compact ? "large" : "xlarge"} />
    <div className="profile-photo-copy"><strong>{value ? "Profile photo ready" : "Add a profile photo"}</strong><span>{busy ? "Preparing image…" : "Choose an image from your desktop. It will be resized for the workspace."}</span><div className="profile-photo-actions"><label className="button secondary photo-button"><Icon name="upload" size={16} />{value ? "Change image" : "Choose image"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} /></label>{value && <button type="button" className="button danger-ghost" onClick={() => { setError(""); onChange(""); }}>Remove</button>}</div>{error && <small className="photo-error">{error}</small>}</div>
  </div>;
}
