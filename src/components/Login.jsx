import React, { useState } from "react";
import { Building2, Loader2, LogIn } from "lucide-react";
import { login } from "../utils/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await login(username.trim(), password));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <div className="logo-icon">
            <Building2 size={22} />
          </div>
          <strong>E-MULK</strong>
        </div>

        <h1>Tizimga kirish</h1>
        <p>Ma'lumotlarni ko'rish uchun avtorizatsiyadan o'ting.</p>

        <label htmlFor="username">Login</label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Parol</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="global-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="search-button login-button"
          type="submit"
          disabled={loading || !username || !password}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="spin" />
              Tekshirilmoqda...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Kirish
            </>
          )}
        </button>
      </form>
    </div>
  );
}
