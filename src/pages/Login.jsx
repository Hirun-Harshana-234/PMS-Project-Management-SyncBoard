import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(username, password);

    if (result.success) {
      navigate("/", { replace: true });
      return;
    }

    setError(result.message);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6fa",
        padding: "24px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          padding: "32px"
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Login</h1>
        <p style={{ marginBottom: "24px", color: "#555" }}>
          Sign in to access the task board and assigned tables.
        </p>
        {error && (
          <div
            style={{
              marginBottom: "16px",
              color: "#912b2b",
              background: "#ffecec",
              borderRadius: "8px",
              padding: "12px"
            }}
          >
            {error}
          </div>
        )}
        <label style={{ display: "block", marginBottom: "12px" }}>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d3d7e1",
            marginBottom: "18px"
          }}
        />
        <label style={{ display: "block", marginBottom: "12px" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #d3d7e1",
            marginBottom: "24px"
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "#3842f5",
            color: "white",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
