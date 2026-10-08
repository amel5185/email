"use client";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (r.ok) location.href = "/"; else { setErr((await r.json().catch(() => ({}))).error || "Terjadi kesalahan."); setBusy(false); }
  }
  return (
    <div className="login"><div className="card">
      <div className="brand"><i className="fa-solid fa-envelope-circle-check" />Mail Center</div>
      <label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      <label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" onKeyDown={(e) => e.key === "Enter" && go()} />
      {err && <div className="err">{err}</div>}
      <button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={busy} onClick={go}>{busy ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-right-to-bracket" />}Masuk</button>
    </div></div>
  );
}
