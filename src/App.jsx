import { useState, useEffect, useRef, useCallback } from "react";

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const BASE_URL = "https://music-app-lu25.onrender.com";
const api = {
  headers: (isFormData = false) => {
    const h = {};
    const t = localStorage.getItem("mp_token");
    if (t) h["Authorization"] = `Bearer ${t}`;
    if (!isFormData) h["Content-Type"] = "application/json";
    return h;
  },
  async get(path) {
    const r = await fetch(`${BASE_URL}${path}`, { headers: api.headers() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
  async post(path, body) {
    const r = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: api.headers(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
  async put(path, body) {
    const r = await fetch(`${BASE_URL}${path}`, { method: "PUT", headers: api.headers(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
  async delete(path) {
    const r = await fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: api.headers() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
  async postForm(path, formData) {
    const r = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: api.headers(true), body: formData });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
  async putForm(path, formData) {
    const r = await fetch(`${BASE_URL}${path}`, { method: "PUT", headers: api.headers(true), body: formData });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Request failed");
    return d.data ?? d;
  },
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtDur = (s) => {
  if (!s && s !== 0) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

function generateQR(canvas, text) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000";
  const data = btoa(text);
  const cells = 21;
  const cell = size / cells;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const charCode = data.charCodeAt((i * cells + j) % data.length);
      if (charCode % 2 === 0) ctx.fillRect(j * cell, i * cell, cell, cell);
    }
  }
  const drawFinder = (x, y) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y, cell * 7, cell * 7);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + cell, y + cell, cell * 5, cell * 5);
    ctx.fillStyle = "#000";
    ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
  };
  drawFinder(0, 0);
  drawFinder(size - cell * 7, 0);
  drawFinder(0, size - cell * 7);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "", color }) => {
  const icons = {
    play: <polygon points="5,3 19,12 5,21" fill="currentColor"/>,
    pause: <><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></>,
    skip_next: <><polygon points="5,4 15,12 5,20" fill="currentColor"/><rect x="17" y="4" width="2" height="16" fill="currentColor"/></>,
    skip_prev: <><polygon points="19,4 9,12 19,20" fill="currentColor"/><rect x="5" y="4" width="2" height="16" fill="currentColor"/></>,
    shuffle: <><polyline points="16,3 21,3 21,8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/><polyline points="21,16 21,21 16,21" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="4" x2="9" y2="9" stroke="currentColor" strokeWidth="2"/></>,
    repeat: <><polyline points="17,1 21,5 17,9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="7,23 3,19 7,15" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none"/>,
    heart_fill: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>,
    volume: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    volume_mute: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2"/></>,
    search: <><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></>,
    music: <><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    settings: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/></>,
    trending: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    album: <><rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    history: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    crown: <><path d="M2 20h20l-3-9-5 5-2-8-2 8-5-5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    trash: <><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    upload: <><polyline points="16,16 12,12 8,16" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    check: <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>,
    more: <><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></>,
    list_music: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2"/></>,
    bar_chart: <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/></>,
    qr: <><rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="4" y="4" width="3" height="3" fill="currentColor"/><rect x="17" y="4" width="3" height="3" fill="currentColor"/><rect x="4" y="17" width="3" height="3" fill="currentColor"/><line x1="16" y1="16" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="2"/></>,
    chevron_up: <polyline points="18,15 12,9 6,15" stroke="currentColor" strokeWidth="2" fill="none"/>,
    chevron_down: <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" fill="none"/>,
    chevron_left: <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" fill="none"/>,
    lyrics: <><line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    queue: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="3"/></>,
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ flexShrink: 0, color }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body, #root { height: 100%; overflow: hidden; }
    body { font-family: 'DM Sans', sans-serif; background: #080810; color: #f0eeff; overscroll-behavior: none; }
    ::-webkit-scrollbar { display: none; }
    input, select, textarea { outline: none !important; font-family: inherit; }
    button { font-family: inherit; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes slideDown { from { transform:translateY(0); } to { transform:translateY(100%); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
    @keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

    .vinyl-spin { animation: vinylSpin 3s linear infinite; animation-play-state: paused; }
    .vinyl-spin.playing { animation-play-state: running; }

    .range-track {
      -webkit-appearance: none; appearance: none;
      height: 3px; border-radius: 99px; cursor: pointer;
      background: rgba(255,255,255,.15);
    }
    .range-track::-webkit-slider-thumb {
      -webkit-appearance: none; width: 16px; height: 16px;
      border-radius: 50%; background: #fff; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.4);
    }

    .tap-scale { transition: transform .12s cubic-bezier(.34,1.56,.64,1); }
    .tap-scale:active { transform: scale(.93); }

    .song-item { transition: background .15s; }
    .song-item:active { background: rgba(255,255,255,.06) !important; }

    .bottom-sheet { animation: slideUp .32s cubic-bezier(.22,1,.36,1); }

    .glass {
      background: rgba(22,18,40,.85);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
    }

    .pill-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 99px; border: none; cursor: pointer;
      font-size: 13px; font-weight: 600; transition: all .15s;
    }
    .pill-btn:active { transform: scale(.95); }
    .pill-btn-primary { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; }
    .pill-btn-ghost { background: rgba(255,255,255,.08); color: #c4b5fd; border: 1px solid rgba(255,255,255,.1); }

    .icon-btn {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; transition: all .15s;
    }
    .icon-btn:active { background: rgba(255,255,255,.1); transform: scale(.9); }

    .nav-pill { transition: all .2s cubic-bezier(.34,1.56,.64,1); }

    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,.03) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.03) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Spinner = ({ size = 24 }) => (
  <div style={{ width: size, height: size, border: `2.5px solid rgba(255,255,255,.15)`, borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }}/>
);

const CoverImg = ({ src, alt, size = 48, radius = 10, style = {} }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: "hidden", background: "linear-gradient(135deg,#1e1532,#2d1f4e)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="music" size={typeof size === "number" ? size * 0.38 : 18} color="rgba(255,255,255,.25)"/>}
  </div>
);

const Toast = ({ toasts, remove }) => (
  <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "error" ? "#ff3b5c" : t.type === "warning" ? "#f59e0b" : "#10b981",
        color: "#fff", padding: "13px 16px", borderRadius: 14, fontSize: 13, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 10,
        animation: "scaleIn .25s ease", boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        pointerEvents: "all",
      }}>
        <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
        <button onClick={() => remove(t.id)} style={{ background: "rgba(255,255,255,.2)", border: "none", color: "#fff", cursor: "pointer", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={12}/>
        </button>
      </div>
    ))}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text", onEnter }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>{label}</label>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} onKeyDown={e => e.key === "Enter" && onEnter?.()}
      style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontSize: 15 }}
    />
  </div>
);

// ─── MINI PLAYER BAR ──────────────────────────────────────────────────────────
function MiniPlayer({ song, isPlaying, progress, duration, onExpand, onPlay, onNext, toast }) {
  const pct = duration ? (progress / duration) * 100 : 0;
  return (
    <div
      style={{
        position: "absolute", bottom: 72, left: 12, right: 12,
        borderRadius: 18, overflow: "hidden",
        background: "rgba(30,20,55,.96)", backdropFilter: "blur(24px)",
        boxShadow: "0 8px 40px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08)",
        zIndex: 90,
      }}
    >
      {/* thin progress */}
      <div style={{ height: 2, background: "rgba(255,255,255,.1)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#c084fc)", borderRadius: 2, transition: "width .2s linear" }}/>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 12 }}>
        <div style={{ cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }} onClick={onExpand}>
          <div className={`vinyl-spin ${isPlaying ? "playing" : ""}`} style={{
            width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
            border: "2px solid rgba(168,85,247,.3)",
            boxShadow: isPlaying ? "0 0 16px rgba(168,85,247,.5)" : "none",
          }}>
            <CoverImg src={song.coverImage} alt={song.title} size={44} radius={50}/>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</div>
          </div>
        </div>
        <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={20}/>
        <button className="icon-btn tap-scale" onClick={onPlay} style={{ width: 42, height: 42, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" }}>
          <Icon name={isPlaying ? "pause" : "play"} size={18}/>
        </button>
        <button className="icon-btn tap-scale" onClick={onNext} style={{ width: 36, height: 36, color: "rgba(255,255,255,.6)" }}>
          <Icon name="skip_next" size={22}/>
        </button>
      </div>
    </div>
  );
}

// ─── FULL PLAYER SHEET ────────────────────────────────────────────────────────
function FullPlayer({
  song, queue, queueIdx, isPlaying, progress, duration, volume, muted,
  shuffle, repeat, showLyrics, showQueue,
  onClose, onSeek, onPlay, onNext, onPrev, onShuffle, onRepeat,
  onVolume, onMute, onToggleLyrics, onToggleQueue, onQueuePlay, onDownload, toast
}) {
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const progressPct = duration ? (progress / duration) * 100 : 0;
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!showLyrics || !song?.id) return;
    setLyricsLoading(true);
    api.get(`/api/songs/${song.id}/lyrics`)
      .then(r => setLyrics(r?.lyrics || r?.content || (typeof r === "string" ? r : null)))
      .catch(() => setLyrics(null))
      .finally(() => setLyricsLoading(false));
  }, [showLyrics, song?.id]);

  const handleProgressTouch = (e) => {
    const bar = progressBarRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const syntheticEvent = { currentTarget: bar, clientX };
    onSeek(syntheticEvent);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column",
      background: "#080810",
    }} className="bottom-sheet">
      {/* Blurred BG art */}
      {song.coverImage && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${song.coverImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(60px) saturate(1.8) brightness(.35)",
          transform: "scale(1.1)",
        }}/>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,16,.4) 0%, rgba(8,8,16,.7) 60%, rgba(8,8,16,.95) 100%)" }}/>

      {/* Content */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <button className="icon-btn tap-scale" onClick={onClose} style={{ width: 40, height: 40, color: "rgba(255,255,255,.7)" }}>
            <Icon name="chevron_down" size={24}/>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase" }}>Now Playing</div>
          </div>
          <button className="icon-btn tap-scale" onClick={onDownload} style={{ width: 40, height: 40, color: "rgba(255,255,255,.7)" }}>
            <Icon name="download" size={20}/>
          </button>
        </div>

        {/* Artwork */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 40px 16px" }}>
          <div
            className={`vinyl-spin ${isPlaying ? "playing" : ""}`}
            style={{
              width: "min(72vw, 280px)", height: "min(72vw, 280px)",
              borderRadius: "50%", overflow: "hidden",
              boxShadow: isPlaying
                ? "0 0 80px rgba(168,85,247,.45), 0 24px 60px rgba(0,0,0,.7)"
                : "0 24px 60px rgba(0,0,0,.6)",
              border: "3px solid rgba(255,255,255,.08)",
              transition: "box-shadow .5s",
            }}
          >
            <CoverImg src={song.coverImage} alt={song.title} size={"100%"} radius={0} style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
          </div>
        </div>

        {/* Song info */}
        <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-.3px" }}>{song.title}</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,.55)", marginTop: 3 }}>{song.artist?.name || "Unknown"}</div>
          </div>
          <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={24}/>
        </div>

        {/* Progress */}
        <div style={{ padding: "20px 24px 8px" }}>
          <div
            ref={progressBarRef}
            onClick={onSeek}
            onTouchStart={handleProgressTouch}
            style={{ height: 4, background: "rgba(255,255,255,.15)", borderRadius: 99, cursor: "pointer", position: "relative", marginBottom: 8 }}
          >
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#7c3aed,#c084fc)", borderRadius: 99, transition: "width .15s linear" }}/>
            <div style={{
              position: "absolute", top: "50%", left: `${progressPct}%`,
              transform: "translate(-50%,-50%)",
              width: 16, height: 16, borderRadius: "50%", background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,.4)", transition: "left .15s linear",
            }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.4)", fontVariantNumeric: "tabular-nums" }}>
            <span>{fmtDur(Math.floor(progress))}</span>
            <span>{fmtDur(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Main controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 28px" }}>
          <button className="icon-btn tap-scale" onClick={onShuffle} style={{ width: 44, height: 44, color: shuffle ? "#c084fc" : "rgba(255,255,255,.4)" }}>
            <Icon name="shuffle" size={22}/>
          </button>
          <button className="icon-btn tap-scale" onClick={onPrev} style={{ width: 52, height: 52, color: "#f0eeff" }}>
            <Icon name="skip_prev" size={32}/>
          </button>
          <button
            className="tap-scale"
            onClick={onPlay}
            style={{
              width: 70, height: 70, borderRadius: "50%",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", boxShadow: "0 8px 32px rgba(124,58,237,.6)",
            }}
          >
            <Icon name={isPlaying ? "pause" : "play"} size={30}/>
          </button>
          <button className="icon-btn tap-scale" onClick={onNext} style={{ width: 52, height: 52, color: "#f0eeff" }}>
            <Icon name="skip_next" size={32}/>
          </button>
          <button className="icon-btn tap-scale" onClick={onRepeat} style={{ width: 44, height: 44, color: repeat ? "#c084fc" : "rgba(255,255,255,.4)" }}>
            <Icon name="repeat" size={22}/>
          </button>
        </div>

        {/* Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 28px 12px" }}>
          <button className="icon-btn" onClick={onMute} style={{ color: "rgba(255,255,255,.4)", width: 32, height: 32 }}>
            <Icon name={muted ? "volume_mute" : "volume"} size={18}/>
          </button>
          <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume}
            onChange={e => onVolume(+e.target.value)}
            className="range-track" style={{ flex: 1, accentColor: "#a855f7" }}/>
        </div>

        {/* Lyrics / Queue / extra buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "0 24px 20px" }}>
          <button
            onClick={onToggleLyrics}
            className="pill-btn"
            style={{ background: showLyrics ? "rgba(168,85,247,.25)" : "rgba(255,255,255,.06)", color: showLyrics ? "#c084fc" : "rgba(255,255,255,.55)", border: showLyrics ? "1px solid rgba(168,85,247,.4)" : "1px solid rgba(255,255,255,.08)" }}
          >
            <Icon name="lyrics" size={14}/> Lyrics
          </button>
          <button
            onClick={onToggleQueue}
            className="pill-btn"
            style={{ background: showQueue ? "rgba(168,85,247,.25)" : "rgba(255,255,255,.06)", color: showQueue ? "#c084fc" : "rgba(255,255,255,.55)", border: showQueue ? "1px solid rgba(168,85,247,.4)" : "1px solid rgba(255,255,255,.08)" }}
          >
            <Icon name="queue" size={14}/> Queue ({queue.length})
          </button>
        </div>

        {/* Lyrics panel */}
        {showLyrics && (
          <div style={{ margin: "0 16px 16px", background: "rgba(255,255,255,.05)", borderRadius: 16, padding: 16, maxHeight: 180, overflowY: "auto" }}>
            {lyricsLoading ? <div style={{ display: "flex", justifyContent: "center" }}><Spinner/></div> : (
              lyrics
                ? <pre style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 2, color: "rgba(255,255,255,.8)", whiteSpace: "pre-wrap", textAlign: "center" }}>{lyrics}</pre>
                : <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, textAlign: "center" }}>No lyrics available</p>
            )}
          </div>
        )}

        {/* Queue panel */}
        {showQueue && (
          <div style={{ margin: "0 16px 16px", background: "rgba(255,255,255,.04)", borderRadius: 16, padding: "12px 0", maxHeight: 200, overflowY: "auto" }}>
            <div style={{ padding: "0 16px 8px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".08em", textTransform: "uppercase" }}>Up Next</div>
            {queue.map((s, i) => (
              <div
                key={`${s.id}-${i}`} onClick={() => onQueuePlay(s, i)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", cursor: "pointer", background: i === queueIdx ? "rgba(168,85,247,.12)" : "none", transition: "background .15s" }}
              >
                <CoverImg src={s.coverImage} alt={s.title} size={38} radius={8}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: i === queueIdx ? 700 : 500, color: i === queueIdx ? "#c084fc" : "#f0eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{s.artist?.name}</div>
                </div>
                {i === queueIdx && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7" }}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIKE BUTTON ──────────────────────────────────────────────────────────────
function LikeBtn({ songId, liked: initLiked, toast, size = 20 }) {
  const [liked, setLiked] = useState(initLiked);
  const toggle = async (e) => {
    e.stopPropagation();
    try {
      const r = await api.post(`/api/songs/${songId}/like`);
      setLiked(r.liked);
    } catch (err) { toast(err.message, "error"); }
  };
  return (
    <button className="icon-btn tap-scale" onClick={toggle} style={{ width: size + 16, height: size + 16, color: liked ? "#f43f5e" : "rgba(255,255,255,.4)" }}>
      <Icon name={liked ? "heart_fill" : "heart"} size={size}/>
    </button>
  );
}

// ─── SONG ROW ─────────────────────────────────────────────────────────────────
function SongRow({ song, idx, songs, playSong, toast, downloadSong, showNumber = true }) {
  return (
    <div
      className="song-item"
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }} onClick={() => playSong(song, songs, idx)}>
        {showNumber && <span style={{ width: 20, textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 13, flexShrink: 0 }}>{idx + 1}</span>}
        <CoverImg src={song.coverImage} alt={song.title} size={46} radius={10}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</span>
            {song.premium && <span style={{ fontSize: 9, background: "rgba(251,191,36,.2)", color: "#fbbf24", padding: "2px 5px", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>PRO</span>}
          </div>
        </div>
      </div>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", flexShrink: 0 }}>{fmtDur(song.durationSeconds)}</span>
      <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={18}/>
      {downloadSong && (
        <button className="icon-btn tap-scale" onClick={e => { e.stopPropagation(); downloadSong(song); }} style={{ width: 32, height: 32, color: "rgba(255,255,255,.4)" }}>
          <Icon name="download" size={16}/>
        </button>
      )}
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ login, toast, toasts, removeToast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", country: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        const r = await api.post("/api/auth/login", { email: form.email, password: form.password });
        login(r);
      } else {
        const r = await api.post("/api/auth/register", form);
        login(r);
        toast("Welcome to Melodiq!");
      }
    } catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#080810", display: "flex", flexDirection: "column", justifyContent: "flex-end", fontFamily: "'DM Sans',sans-serif" }}>
      <GlobalStyles/>
      <Toast toasts={toasts} remove={removeToast}/>

      {/* Hero art */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.45) 0%, transparent 70%)", top: "8%", left: "50%", transform: "translateX(-50%)" }}/>
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,.25) 0%, transparent 70%)", top: "20%", right: "10%" }}/>
        <div style={{ position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 16px 48px rgba(124,58,237,.6)" }}>
            <Icon name="music" size={36} color="#fff"/>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#f0eeff", letterSpacing: "-1px" }}>Melodiq</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.45)", marginTop: 6 }}>Your music, everywhere</div>
        </div>
      </div>

      {/* Card */}
      <div style={{ position: "relative", background: "rgba(16,12,30,.97)", borderRadius: "28px 28px 0 0", padding: "28px 24px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,.5)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.15)", margin: "0 auto 24px" }}/>
        <div style={{ display: "flex", background: "rgba(255,255,255,.05)", borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "11px", borderRadius: 11, background: mode === m ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "none", border: "none", cursor: "pointer", color: mode === m ? "#fff" : "rgba(255,255,255,.5)", fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all .2s" }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        {mode === "register" && <InputField label="Full Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>}
        <InputField label="Email" type="email" value={form.email} onChange={v => setForm(p => ({...p, email: v}))} placeholder="you@example.com"/>
        <InputField label="Password" type="password" value={form.password} onChange={v => setForm(p => ({...p, password: v}))} placeholder="Min 8 characters" onEnter={submit}/>
        {mode === "register" && <InputField label="Country (optional)" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>}
        <button
          onClick={submit} disabled={loading}
          style={{ width: "100%", padding: "16px", borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 28px rgba(124,58,237,.5)", marginTop: 4 }}
          className="tap-scale"
        >
          {loading ? <Spinner size={20}/> : (mode === "login" ? "Sign In" : "Create Account")}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("mp_user") || "null"); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem("mp_token") || "");
  const [view, setView] = useState("home");
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const audioRef = useRef(null);
  const toastId = useRef(0);
  const queueRef = useRef(queue);
  const queueIdxRef = useRef(queueIdx);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIdxRef.current = queueIdx; }, [queueIdx]);

  const toast = useCallback((msg, type = "success") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const login = (data) => {
    localStorage.setItem("mp_token", data.accessToken);
    localStorage.setItem("mp_user", JSON.stringify(data.user));
    setToken(data.accessToken); setUser(data.user);
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch {}
    localStorage.removeItem("mp_token"); localStorage.removeItem("mp_user");
    setToken(""); setUser(null); setCurrentSong(null); setIsPlaying(false);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentSong) return;
    if (!currentSong.audioUrl) { toast("No audio URL for this song", "error"); return; }
    a.src = currentSong.audioUrl;
    a.volume = muted ? 0 : volume;
    a.play().then(() => setIsPlaying(true)).catch(() => toast("Could not play audio", "error"));
    api.post(`/api/songs/${currentSong.id}/play`).catch(() => {});
  }, [currentSong]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = muted ? 0 : volume; }, [volume, muted]);

  const playSong = useCallback(async (song, songs = [], idx = 0) => {
    let s = song;
    if (!s.audioUrl) {
      try { const full = await api.get(`/api/songs/${s.id}`); s = full; } catch {}
    }
    if (!s.audioUrl) { toast("Audio not available", "error"); return; }
    setCurrentSong(s);
    setQueue(songs.length ? songs : [s]);
    setQueueIdx(idx);
  }, [toast]);

  const handleEnded = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    if (repeat) { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); } return; }
    const nextIdx = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
    if (nextIdx < q.length) { setQueueIdx(nextIdx); setCurrentSong(q[nextIdx]); } else { setIsPlaying(false); }
  }, [repeat, shuffle]);

  const skipNext = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    const nextIdx = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
    if (nextIdx < q.length) { setQueueIdx(nextIdx); setCurrentSong(q[nextIdx]); }
  }, [shuffle]);

  const skipPrev = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    if (audioRef.current && audioRef.current.currentTime > 3) { audioRef.current.currentTime = 0; return; }
    if (idx > 0) { setQueueIdx(idx - 1); setCurrentSong(q[idx - 1]); }
  }, []);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (audioRef.current && duration) audioRef.current.currentTime = pct * duration;
  };

  const downloadSong = async (song) => {
    if (!song.audioUrl) { toast("No audio URL available", "error"); return; }
    const a = document.createElement("a");
    a.href = song.audioUrl; a.download = `${song.title}.mp3`; a.target = "_blank";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast("Download started");
  };

  if (!user) return <AuthScreen login={login} toast={toast} toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))}/>;

  const isAdmin = user.role === "ADMIN";
  const bottomNavH = 72;
  const miniPlayerH = currentSong ? 76 : 0;

  return (
    <div style={{ height: "100dvh", background: "#080810", color: "#f0eeff", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <GlobalStyles/>

      <audio
        ref={audioRef}
        onTimeUpdate={() => { const a = audioRef.current; if (a) { setProgress(a.currentTime || 0); setDuration(a.duration || 0); } }}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Toast toasts={toasts} remove={(id) => setToasts(p => p.filter(t => t.id !== id))}/>

      {/* Full Player Sheet */}
      {playerOpen && currentSong && (
        <FullPlayer
          song={currentSong} queue={queue} queueIdx={queueIdx}
          isPlaying={isPlaying} progress={progress} duration={duration}
          volume={volume} muted={muted} shuffle={shuffle} repeat={repeat}
          showLyrics={showLyrics} showQueue={showQueue}
          onClose={() => setPlayerOpen(false)}
          onSeek={seek} onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
          onNext={skipNext} onPrev={skipPrev}
          onShuffle={() => setShuffle(s => !s)} onRepeat={() => setRepeat(r => !r)}
          onVolume={(v) => { setVolume(v); setMuted(false); }} onMute={() => setMuted(m => !m)}
          onToggleLyrics={() => { setShowLyrics(l => !l); setShowQueue(false); }}
          onToggleQueue={() => { setShowQueue(q => !q); setShowLyrics(false); }}
          onQueuePlay={(song, idx) => { setQueueIdx(idx); setCurrentSong(song); }}
          onDownload={() => downloadSong(currentSong)}
          toast={toast}
        />
      )}

      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: bottomNavH + miniPlayerH + 8 }}>
        {view === "home" && <HomeView playSong={playSong} toast={toast} user={user} downloadSong={downloadSong}/>}
        {view === "search" && <SearchView playSong={playSong} toast={toast} downloadSong={downloadSong}/>}
        {view === "library" && <LibraryView playSong={playSong} toast={toast}/>}
        {view === "liked" && <LikedView playSong={playSong} toast={toast} downloadSong={downloadSong}/>}
        {view === "profile" && <ProfileView user={user} setUser={(u) => { setUser(u); localStorage.setItem("mp_user", JSON.stringify(u)); }} toast={toast} logout={logout} isAdmin={isAdmin}/>}
        {view === "admin" && isAdmin && <AdminPanel toast={toast} adminTab={adminTab} setAdminTab={setAdminTab}/>}
      </div>

      {/* Mini Player */}
      {currentSong && !playerOpen && (
        <MiniPlayer
          song={currentSong} isPlaying={isPlaying} progress={progress} duration={duration}
          onExpand={() => setPlayerOpen(true)}
          onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
          onNext={skipNext} toast={toast}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav view={view} setView={setView} isAdmin={isAdmin}/>
    </div>
  );
}

// ─── BOTTOM NAVIGATION ────────────────────────────────────────────────────────
function BottomNav({ view, setView, isAdmin }) {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "search", icon: "search", label: "Search" },
    { id: "library", icon: "library", label: "Library" },
    { id: "liked", icon: "heart", label: "Liked" },
    { id: "profile", icon: "user", label: "Profile" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
      background: "rgba(10,8,22,.97)", backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,.06)", zIndex: 80,
      display: "flex", alignItems: "center", paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {tabs.map(t => {
        const active = view === t.id;
        return (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", gap: 4, padding: "8px 0",
            color: active ? "#c084fc" : "rgba(255,255,255,.4)", transition: "color .2s",
          }}>
            <div style={{
              width: 36, height: 28, borderRadius: 99,
              background: active ? "rgba(168,85,247,.2)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
              transform: active ? "scale(1.08)" : "scale(1)",
            }}>
              <Icon name={t.id === "liked" && active ? "heart_fill" : t.icon} size={20}/>
            </div>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, letterSpacing: ".01em" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: "-.3px" }}>{title}</h2>
        {action && <button onClick={action.fn} style={{ background: "none", border: "none", cursor: "pointer", color: "#a855f7", fontSize: 13, fontWeight: 600 }}>{action.label}</button>}
      </div>
      {children}
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ playSong, toast, user, downloadSong }) {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/songs/top?limit=10"),
      api.get("/api/songs/latest?limit=10"),
      api.get("/api/categories"),
      api.get("/api/albums/new-releases"),
    ]).then(([t, l, c, a]) => {
      setTrending(Array.isArray(t) ? t : (t?.content || []));
      setLatest(Array.isArray(l) ? l : (l?.content || []));
      setCategories(Array.isArray(c) ? c : (c?.content || []));
      setAlbums(Array.isArray(a) ? a : (a?.content || []));
    }).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><Spinner size={40}/></div>;

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 16px" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 500 }}>{greeting} 👋</div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: "-.5px", marginTop: 2 }}>{user.name.split(" ")[0]}</div>
        {user.premium && <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(251,191,36,.12)", border: "1px solid rgba(251,191,36,.25)", borderRadius: 99, padding: "3px 10px" }}>
          <Icon name="crown" size={12} color="#fbbf24"/> <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>Premium</span>
        </div>}
      </div>

      {/* Categories horizontal scroll */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: "0 16px", marginBottom: 10 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Browse</h2>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "2px 16px 4px", scrollbarWidth: "none" }}>
            {categories.map(c => (
              <div key={c.id} style={{
                flexShrink: 0, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                background: c.color ? `${c.color}22` : "rgba(255,255,255,.06)",
                border: `1px solid ${c.color ? c.color + "44" : "rgba(255,255,255,.1)"}`,
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: c.color || "#f0eeff" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <Section title="🔥 Trending">
          {trending.slice(0, 6).map((s, i) => (
            <SongRow key={s.id} song={s} idx={i} songs={trending} playSong={playSong} toast={toast} downloadSong={downloadSong}/>
          ))}
        </Section>
      )}

      {/* New Releases */}
      {albums.length > 0 && (
        <Section title="New Releases">
          <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 4px", scrollbarWidth: "none" }}>
            {albums.map(a => (
              <div key={a.id} style={{ flexShrink: 0, width: 140, cursor: "pointer" }}>
                <CoverImg src={a.coverImage} alt={a.title} size={140} radius={14} style={{ width: 140, height: 140, marginBottom: 8 }}/>
                <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{a.artist?.name}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Latest */}
      {latest.length > 0 && (
        <Section title="Latest">
          {latest.slice(0, 8).map((s, i) => (
            <SongRow key={s.id} song={s} idx={i} songs={latest} playSong={playSong} toast={toast} downloadSong={downloadSong}/>
          ))}
        </Section>
      )}
    </div>
  );
}

// ─── SEARCH VIEW ──────────────────────────────────────────────────────────────
function SearchView({ playSong, toast, downloadSong }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (query) => {
    if (!query.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      let songs = [], albums = [];
      try {
        const r = await api.get(`/api/search?query=${encodeURIComponent(query)}&size=20`);
        songs = r?.songs?.content || r?.songs || [];
        albums = r?.albums?.content || r?.albums || [];
        if (Array.isArray(r)) songs = r;
      } catch {
        const r = await api.get(`/api/songs/search?query=${encodeURIComponent(query)}&size=20`);
        songs = r?.content || (Array.isArray(r) ? r : []);
      }
      setResults({ songs, albums });
    } catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(q), 500);
    return () => clearTimeout(debounceRef.current);
  }, [q, doSearch]);

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      {/* Search bar */}
      <div style={{ padding: "20px 16px 12px", position: "sticky", top: 0, background: "#080810", zIndex: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 14 }}>Search</h1>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.35)" }}><Icon name="search" size={18}/></div>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Songs, artists, albums..."
            style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "13px 14px 13px 44px", color: "#f0eeff", fontSize: 15 }}
          />
          {loading && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}><Spinner size={18}/></div>}
          {q && !loading && <button onClick={() => setQ("")} className="icon-btn" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, color: "rgba(255,255,255,.4)" }}><Icon name="x" size={14}/></button>}
        </div>
      </div>

      {results && (() => {
        const songs = results.songs || [], albums = results.albums || [];
        if (!songs.length && !albums.length) return (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,.35)" }}>
            <Icon name="search" size={44}/><p style={{ marginTop: 12, fontSize: 16 }}>No results for "{q}"</p>
          </div>
        );
        return (
          <>
            {songs.length > 0 && <Section title={`Songs (${songs.length})`}>{songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} downloadSong={downloadSong}/>)}</Section>}
            {albums.length > 0 && (
              <Section title={`Albums (${albums.length})`}>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 4px" }}>
                  {albums.map(a => (
                    <div key={a.id} style={{ flexShrink: 0, width: 130 }}>
                      <CoverImg src={a.coverImage} alt={a.title} size={130} radius={12} style={{ width: 130, height: 130, marginBottom: 8 }}/>
                      <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{a.artist?.name}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </>
        );
      })()}

      {!results && !loading && (
        <div style={{ textAlign: "center", paddingTop: 60, color: "rgba(255,255,255,.3)" }}>
          <Icon name="mic" size={44}/><p style={{ marginTop: 12, fontSize: 14 }}>Search for your favorite music</p>
        </div>
      )}
    </div>
  );
}

// ─── LIBRARY VIEW ─────────────────────────────────────────────────────────────
function LibraryView({ playSong, toast }) {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await api.get("/api/playlists/me?size=50"); setPlaylists(r.content || []); }
    catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({ name: newName, isPublic: false })], { type: "application/json" }));
      const r = await api.postForm("/api/playlists", fd);
      setPlaylists(p => [r, ...p]); setCreating(false); setNewName(""); toast("Playlist created!");
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const deletePlaylist = async (id, e) => {
    e.stopPropagation();
    try { await api.delete(`/api/playlists/${id}`); setPlaylists(p => p.filter(pl => pl.id !== id)); toast("Deleted"); }
    catch (err) { toast(err.message, "error"); }
  };

  if (selected) return <PlaylistDetail playlist={selected} back={() => { setSelected(null); load(); }} playSong={playSong} toast={toast}/>;

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ padding: "20px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>My Library</h1>
        <button onClick={() => setCreating(c => !c)} className="pill-btn pill-btn-primary tap-scale" style={{ padding: "9px 16px" }}>
          <Icon name={creating ? "x" : "plus"} size={16}/> {creating ? "Cancel" : "New"}
        </button>
      </div>

      {creating && (
        <div style={{ margin: "0 16px 16px", background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16 }}>
          <InputField label="Playlist Name" value={newName} onChange={setNewName} placeholder="My Playlist"/>
          <button onClick={create} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
            {saving ? <Spinner size={16}/> : "Create"}
          </button>
        </div>
      )}

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36}/></div> : (
        <div style={{ padding: "0 16px" }}>
          {playlists.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.3)" }}>
              <Icon name="library" size={48}/><p style={{ marginTop: 12 }}>No playlists yet</p>
            </div>
          )}
          {playlists.map(pl => (
            <div key={pl.id} onClick={() => setSelected(pl)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)", cursor: "pointer" }}>
              <CoverImg src={pl.coverImage} alt={pl.name} size={54} radius={12} style={{ background: "linear-gradient(135deg,#2d1f4e,#1e1532)" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Syne',sans-serif" }}>{pl.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{pl.totalTracks ?? 0} songs</div>
              </div>
              <button onClick={e => deletePlaylist(pl.id, e)} className="icon-btn tap-scale" style={{ width: 34, height: 34, color: "rgba(255,255,255,.3)" }}>
                <Icon name="trash" size={16}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaylistDetail({ playlist, back, playSong, toast }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api.get(`/api/playlists/${playlist.id}`).then(setDetail).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, [playlist.id]);

  const searchSongs = async () => {
    if (!searchQ.trim()) return;
    setSearching(true);
    try {
      const r = await api.get(`/api/songs/search?query=${encodeURIComponent(searchQ)}&size=5`);
      setSearchResults(r?.content || (Array.isArray(r) ? r : []));
    } catch (err) { toast(err.message, "error"); }
    finally { setSearching(false); }
  };

  const addSong = async (songId) => {
    try {
      await api.post(`/api/playlists/${playlist.id}/songs`, { songId });
      const r = await api.get(`/api/playlists/${playlist.id}`);
      setDetail(r); setSearchResults([]); setSearchQ(""); toast("Song added!");
    } catch (err) { toast(err.message, "error"); }
  };

  const removeSong = async (songId) => {
    try {
      await api.delete(`/api/playlists/${playlist.id}/songs/${songId}`);
      setDetail(d => ({ ...d, songs: (d.songs || []).filter(s => s.id !== songId) }));
      toast("Removed");
    } catch (err) { toast(err.message, "error"); }
  };

  const songs = detail?.songs || [];

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 8px" }}>
        <button className="icon-btn tap-scale" onClick={back} style={{ width: 40, height: 40, color: "#f0eeff" }}><Icon name="chevron_left" size={24}/></button>
        <h1 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{detail?.name || playlist.name}</h1>
      </div>
      <div style={{ display: "flex", gap: 16, padding: "12px 16px 20px", alignItems: "center" }}>
        <CoverImg src={detail?.coverImage} alt={detail?.name} size={80} radius={14} style={{ background: "linear-gradient(135deg,#2d1f4e,#1e1532)" }}/>
        <div>
          {detail?.description && <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>{detail.description}</p>}
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginTop: 4 }}>{songs.length} songs</p>
          {songs.length > 0 && (
            <button onClick={() => playSong(songs[0], songs, 0)} className="pill-btn pill-btn-primary tap-scale" style={{ marginTop: 10 }}>
              <Icon name="play" size={14}/> Play All
            </button>
          )}
        </div>
      </div>

      {/* Add songs */}
      <div style={{ margin: "0 16px 16px", background: "rgba(255,255,255,.04)", borderRadius: 16, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".05em" }}>Add Songs</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && searchSongs()} placeholder="Search to add..." style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 13px", color: "#f0eeff", fontSize: 14 }}/>
          <button onClick={searchSongs} className="pill-btn pill-btn-ghost tap-scale" style={{ padding: "10px 14px" }}>
            {searching ? <Spinner size={14}/> : <Icon name="search" size={16}/>}
          </button>
        </div>
        {searchResults.map(s => (
          <div key={s.id} onClick={() => addSong(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <CoverImg src={s.coverImage} alt={s.title} size={38} radius={8}/>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.artist?.name}</div></div>
            <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 700 }}>+ Add</span>
          </div>
        ))}
      </div>

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner/></div> : (
        songs.length === 0
          ? <p style={{ color: "rgba(255,255,255,.35)", fontSize: 14, textAlign: "center", padding: 40 }}>No songs yet. Add some above!</p>
          : songs.map((s, i) => (
            <div key={s.id} className="song-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer" }} onClick={() => playSong(s, songs, i)}>
              <span style={{ width: 20, color: "rgba(255,255,255,.3)", fontSize: 13 }}>{i+1}</span>
              <CoverImg src={s.coverImage} alt={s.title} size={44} radius={10}/>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.artist?.name}</div></div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>{fmtDur(s.durationSeconds)}</span>
              <button className="icon-btn tap-scale" onClick={e => { e.stopPropagation(); removeSong(s.id); }} style={{ width: 32, height: 32, color: "rgba(255,255,255,.3)" }}><Icon name="x" size={15}/></button>
            </div>
          ))
      )}
    </div>
  );
}

// ─── LIKED VIEW ───────────────────────────────────────────────────────────────
function LikedView({ playSong, toast, downloadSong }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/songs/liked?size=100").then(r => setSongs(r?.content || (Array.isArray(r) ? r : []))).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, []);
  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 54, height: 54, background: "linear-gradient(135deg,#be185d,#f43f5e)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="heart_fill" size={26} color="#fff"/>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Liked Songs</h1>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>{songs.length} songs</p>
          </div>
        </div>
        {songs.length > 0 && (
          <button onClick={() => playSong(songs[0], songs, 0)} className="pill-btn pill-btn-primary tap-scale">
            <Icon name="play" size={14}/> Play All
          </button>
        )}
      </div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36}/></div> : (
        songs.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.3)" }}><Icon name="heart" size={48}/><p style={{ marginTop: 12 }}>No liked songs yet</p></div>
          : songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} downloadSong={downloadSong}/>)
      )}
    </div>
  );
}

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
function ProfileView({ user, setUser, toast, logout, isAdmin }) {
  const [tab, setTab] = useState("account");
  const [form, setForm] = useState({ name: user.name || "", bio: user.bio || "", country: user.country || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.profileImage || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let r;
      if (profileImageFile) {
        const fd = new FormData();
        fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
        fd.append("image", profileImageFile);
        r = await api.putForm("/api/users/me", fd);
      } else { r = await api.put("/api/users/me", form); }
      setUser(r); toast("Profile updated!");
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast("All fields required", "warning"); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast("Passwords don't match", "warning"); return; }
    if (pwForm.newPassword.length < 8) { toast("Min 8 characters", "warning"); return; }
    setPwSaving(true);
    try {
      await api.post("/api/auth/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast("Password changed!"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast(err.message, "error"); }
    finally { setPwSaving(false); }
  };

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      {/* Profile header */}
      <div style={{ padding: "24px 16px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid rgba(168,85,247,.3)" }}>
            {imagePreview ? <img src={imagePreview} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="user" size={32} color="#fff"/>}
          </div>
          <button onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#7c3aed", border: "2px solid #080810", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="tap-scale">
            <Icon name="edit" size={11} color="#fff"/>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }}/>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{user.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 2 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: user.role === "ADMIN" ? "rgba(251,191,36,.15)" : "rgba(168,85,247,.15)", color: user.role === "ADMIN" ? "#fbbf24" : "#c084fc", fontWeight: 700 }}>{user.role}</span>
            {user.premium && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(251,191,36,.15)", color: "#fbbf24", fontWeight: 700 }}>✦ Premium</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 16px 20px", overflowX: "auto" }}>
        {["account","security","subscription"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 18px", borderRadius: 99, border: "none", cursor: "pointer",
            background: tab === t ? "rgba(168,85,247,.2)" : "none",
            color: tab === t ? "#c084fc" : "rgba(255,255,255,.45)",
            fontWeight: 700, fontSize: 13, fontFamily: "inherit", whiteSpace: "nowrap",
            borderBottom: tab === t ? "2px solid #a855f7" : "2px solid transparent", borderRadius: 0,
            transition: "all .2s",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        {tab === "account" && (
          <div>
            <InputField label="Display Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} placeholder="Tell us about yourself..." rows={3} style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontSize: 15, fontFamily: "inherit", resize: "none" }}/>
            </div>
            <InputField label="Country" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>
            <button onClick={saveProfile} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
              {saving ? <Spinner size={18}/> : <><Icon name="check" size={16}/> Save Changes</>}
            </button>
          </div>
        )}

        {tab === "security" && (
          <div>
            <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Change Password</div>
              <InputField label="Current Password" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(p => ({...p, currentPassword: v}))} placeholder="Current password"/>
              <InputField label="New Password" type="password" value={pwForm.newPassword} onChange={v => setPwForm(p => ({...p, newPassword: v}))} placeholder="New password"/>
              <InputField label="Confirm New Password" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(p => ({...p, confirmPassword: v}))} placeholder="Repeat password"/>
              <button onClick={changePassword} disabled={pwSaving} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                {pwSaving ? <Spinner size={18}/> : <><Icon name="shield" size={16}/> Update Password</>}
              </button>
            </div>
            <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 16, padding: 16 }}>
              {[["Email", user.email], ["Status", "Active"], ["Since", user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  <span style={{ color: "rgba(255,255,255,.45)", fontSize: 14 }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "subscription" && <SubscriptionTab user={user} toast={toast}/>}
      </div>

      {/* Bottom actions */}
      <div style={{ padding: "0 16px 24px", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {isAdmin && (
          <button style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", cursor: "pointer", color: "#fbbf24", fontWeight: 700, fontSize: 15, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            className="tap-scale"
            onClick={() => {/* navigate to admin - handled via setView in parent */}}
          >
            <Icon name="shield" size={18}/> Admin Panel
          </button>
        )}
        <button onClick={logout} className="pill-btn tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#ef4444", borderRadius: 14 }}>
          <Icon name="logout" size={18}/> Log Out
        </button>
      </div>
    </div>
  );
}

function SubscriptionTab({ user, toast }) {
  const [qrData, setQrData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const canvasRef = useRef(null);

  const fetchQr = async () => {
    setLoadingQr(true);
    try {
      const r = await api.get("/api/subscription/qr-token");
      const code = r?.qrCode || r?.token || r?.url || JSON.stringify(r);
      setQrData(code);
    } catch (err) { toast(err.message, "error"); }
    finally { setLoadingQr(false); }
  };

  useEffect(() => { if (qrData && canvasRef.current) generateQR(canvasRef.current, qrData); }, [qrData]);

  return (
    <div>
      <div style={{ background: user.premium ? "rgba(251,191,36,.08)" : "rgba(255,255,255,.04)", border: `1px solid ${user.premium ? "rgba(251,191,36,.25)" : "rgba(255,255,255,.08)"}`, borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: user.premium ? "linear-gradient(135deg,#d97706,#fbbf24)" : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="crown" size={22} color={user.premium ? "#fff" : "rgba(255,255,255,.5)"}/>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, fontFamily: "'Syne',sans-serif" }}>{user.premium ? "Premium Member" : "Free Plan"}</div>
            <div style={{ color: "rgba(255,255,255,.45)", fontSize: 13 }}>{user.premium ? "Enjoy unlimited music" : "Upgrade for full access"}</div>
          </div>
        </div>
        {user.premium ? (
          ["Unlimited ad-free listening","High quality audio","Offline downloads","Early access"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8, color: "#fbbf24" }}>
              <Icon name="check" size={14}/><span style={{ color: "#f0eeff" }}>{f}</span>
            </div>
          ))
        ) : (
          <>
            {["Unlimited ad-free listening","High quality audio","Offline downloads","Priority support"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8, color: "rgba(255,255,255,.45)" }}>
                <Icon name="check" size={14}/>{f}
              </div>
            ))}
            <button onClick={fetchQr} disabled={loadingQr} className="pill-btn pill-btn-primary tap-scale" style={{ marginTop: 12, width: "100%", justifyContent: "center", padding: "14px", borderRadius: 14 }}>
              {loadingQr ? <Spinner size={16}/> : <><Icon name="qr" size={16}/> Scan QR to Upgrade</>}
            </button>
            {qrData && (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <canvas ref={canvasRef} width={180} height={180} style={{ borderRadius: 10, background: "#fff", padding: 8 }}/>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 8 }}>Scan with your phone to upgrade</p>
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 16, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Plan Comparison</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 0", color: "rgba(255,255,255,.4)", fontWeight: 600 }}>Feature</th>
              <th style={{ textAlign: "center", padding: "6px 0", color: "rgba(255,255,255,.4)", fontWeight: 600 }}>Free</th>
              <th style={{ textAlign: "center", padding: "6px 0", color: "#fbbf24", fontWeight: 600 }}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {[["Ad-free","✗","✓"],["Unlimited skips","✗","✓"],["Hi-fi audio","✗","✓"],["Downloads","✗","✓"],["Exclusives","✗","✓"]].map(([feat, free, prem]) => (
              <tr key={feat} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 0" }}>{feat}</td>
                <td style={{ textAlign: "center", color: free === "✓" ? "#10b981" : "#ef4444" }}>{free}</td>
                <td style={{ textAlign: "center", color: prem === "✓" ? "#fbbf24" : "#ef4444" }}>{prem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ toast, adminTab, setAdminTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "bar_chart" },
    { id: "songs", label: "Songs", icon: "music" },
    { id: "artists", label: "Artists", icon: "user" },
    { id: "albums", label: "Albums", icon: "album" },
    { id: "categories", label: "Categories", icon: "tag" },
    { id: "users", label: "Users", icon: "users" },
    { id: "qr", label: "QR Codes", icon: "qr" },
  ];
  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ padding: "20px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#d97706,#fbbf24)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={18} color="#fff"/>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Admin Panel</h1>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 16px 16px", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
            background: adminTab === t.id ? "rgba(168,85,247,.2)" : "rgba(255,255,255,.05)",
            color: adminTab === t.id ? "#c084fc" : "rgba(255,255,255,.5)",
            fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            transition: "all .2s",
          }}>
            <Icon name={t.icon} size={14}/>{t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 16px" }}>
        {adminTab === "dashboard" && <AdminDashboard toast={toast}/>}
        {adminTab === "songs" && <AdminSongs toast={toast}/>}
        {adminTab === "artists" && <AdminArtists toast={toast}/>}
        {adminTab === "albums" && <AdminAlbums toast={toast}/>}
        {adminTab === "categories" && <AdminCategories toast={toast}/>}
        {adminTab === "users" && <AdminUsers toast={toast}/>}
        {adminTab === "qr" && <AdminQRCodes toast={toast}/>}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</p>
          <p style={{ fontWeight: 800, fontSize: 26, color, fontFamily: "'Syne',sans-serif" }}>{value ?? "—"}</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
          <Icon name={icon} size={20}/>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ toast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/admin/analytics/dashboard").then(setStats).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, []);
  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={40}/></div>;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        <StatCard label="Users" value={stats?.totalUsers} icon="users" color="#a78bfa"/>
        <StatCard label="Songs" value={stats?.totalSongs} icon="music" color="#34d399"/>
        <StatCard label="Albums" value={stats?.totalAlbums} icon="album" color="#60a5fa"/>
        <StatCard label="Plays" value={stats?.totalPlays} icon="trending" color="#fb923c"/>
        <StatCard label="Premium" value={stats?.premiumUsers} icon="crown" color="#fbbf24"/>
        <StatCard label="Active Today" value={stats?.activeUsers} icon="bar_chart" color="#f472b6"/>
      </div>
      {stats?.topSongs?.length > 0 && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>Top Songs</div>
          {stats.topSongs.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <span style={{ width: 20, color: "rgba(255,255,255,.3)", fontSize: 13 }}>{i+1}</span>
              <CoverImg src={s.coverImage} alt={s.title} size={38} radius={8}/>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.artist?.name}</div></div>
              <span style={{ fontSize: 13, color: "#a855f7", fontWeight: 600 }}>{s.playCount?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminSongs({ toast }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", artistId: "", albumId: "", durationSeconds: "", language: "", releaseYear: new Date().getFullYear(), premium: false, categoryIds: [], lyrics: "" });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showLyricsForm, setShowLyricsForm] = useState(null);
  const [lyricsText, setLyricsText] = useState("");
  const [lyricsSaving, setLyricsSaving] = useState(false);

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const r = await api.get(`/api/songs?page=${p}&size=20&sortBy=createdAt&sortDir=desc`);
      setSongs(r.content || []); setTotalPages(r.totalPages || 0);
    } catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const loadMeta = async () => {
    try {
      const [art, alb, cat] = await Promise.all([
        api.get("/api/artists?size=100").then(r => Array.isArray(r) ? r : (r.content || [])).catch(() => []),
        api.get("/api/albums?size=100").then(r => Array.isArray(r) ? r : (r.content || [])).catch(() => []),
        api.get("/api/categories").then(r => Array.isArray(r) ? r : (r.content || [])).catch(() => []),
      ]);
      setArtists(art); setAlbums(alb); setCategories(cat);
    } catch {}
  };

  useEffect(() => { load(); loadMeta(); }, []);

  const resetForm = () => {
    setForm({ title: "", artistId: "", albumId: "", durationSeconds: "", language: "", releaseYear: new Date().getFullYear(), premium: false, categoryIds: [], lyrics: "" });
    setAudioFile(null); setCoverFile(null); setEditSong(null);
  };

  const uploadSong = async () => {
    if (!form.title || !form.artistId || (!audioFile && !editSong)) { toast("Title, artist and audio required", "warning"); return; }
    setSaving(true);
    try {
      const data = { ...form, artistId: +form.artistId, albumId: form.albumId ? +form.albumId : undefined, durationSeconds: form.durationSeconds ? +form.durationSeconds : undefined, releaseYear: +form.releaseYear, categoryIds: form.categoryIds.length ? form.categoryIds.map(Number) : undefined };
      const fd = new FormData();
      if (audioFile) fd.append("audio", audioFile);
      if (coverFile) fd.append("cover", coverFile);
      fd.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
      if (editSong) { await api.putForm(`/api/songs/${editSong.id}`, fd); toast("Song updated!"); }
      else { await api.postForm("/api/songs/upload", fd); toast("Song uploaded!"); }
      setShowForm(false); resetForm(); load(0);
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const deleteSong = async (id) => {
    if (!confirm("Delete this song?")) return;
    try { await api.delete(`/api/songs/${id}`); toast("Song deleted"); load(page); }
    catch (err) { toast(err.message, "error"); }
  };

  const saveLyrics = async (songId) => {
    setLyricsSaving(true);
    try {
      try { await api.post(`/api/songs/${songId}/lyrics`, { lyrics: lyricsText }); }
      catch { await api.put(`/api/songs/${songId}/lyrics`, { lyrics: lyricsText }); }
      toast("Lyrics saved!"); setShowLyricsForm(null); setLyricsText("");
    } catch (err) { toast(err.message, "error"); }
    finally { setLyricsSaving(false); }
  };

  const openLyrics = async (song) => {
    setShowLyricsForm(song.id);
    try { const r = await api.get(`/api/songs/${song.id}/lyrics`); setLyricsText(r?.lyrics || r?.content || (typeof r === "string" ? r : "")); }
    catch { setLyricsText(""); }
  };

  const selStyle = { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 14, marginBottom: 14 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Manage Songs</div>
        <button onClick={() => { resetForm(); setShowForm(s => !s); }} className="pill-btn pill-btn-primary tap-scale" style={{ padding: "9px 14px" }}>
          <Icon name={showForm ? "x" : "upload"} size={14}/>{showForm ? "Cancel" : "Upload"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>{editSong ? "Edit Song" : "Upload New Song"}</div>
          <InputField label="Song Title *" value={form.title} onChange={v => setForm(p => ({...p, title: v}))} placeholder="Song title"/>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Artist *</label>
          <select value={form.artistId} onChange={e => setForm(p => ({...p, artistId: e.target.value}))} style={selStyle}>
            <option value="">Select artist</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Album</label>
          <select value={form.albumId} onChange={e => setForm(p => ({...p, albumId: e.target.value}))} style={selStyle}>
            <option value="">No album</option>
            {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
          <InputField label="Duration (seconds)" value={form.durationSeconds} onChange={v => setForm(p => ({...p, durationSeconds: v}))} placeholder="240"/>
          <InputField label="Language" value={form.language} onChange={v => setForm(p => ({...p, language: v}))} placeholder="Hindi, English..."/>
          <InputField label="Release Year" value={form.releaseYear} onChange={v => setForm(p => ({...p, releaseYear: v}))} placeholder="2024"/>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Audio File{editSong ? " (optional)" : " *"}</label>
            <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} style={{ width: "100%", color: "#f0eeff", fontSize: 13 }}/>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Cover Image</label>
            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={{ width: "100%", color: "#f0eeff", fontSize: 13 }}/>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Lyrics</label>
            <textarea value={form.lyrics} onChange={e => setForm(p => ({...p, lyrics: e.target.value}))} placeholder="Paste lyrics..." rows={4} style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 13, resize: "vertical" }}/>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>
            <input type="checkbox" checked={form.premium} onChange={e => setForm(p => ({...p, premium: e.target.checked}))} style={{ width: 16, height: 16, accentColor: "#a855f7" }}/>
            Premium only song
          </label>
          {categories.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>Categories</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories.map(c => (
                  <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: form.categoryIds.includes(String(c.id)) ? "rgba(168,85,247,.2)" : "rgba(255,255,255,.05)", border: `1px solid ${form.categoryIds.includes(String(c.id)) ? "#a855f7" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, transition: "all .15s" }}>
                    <input type="checkbox" checked={form.categoryIds.includes(String(c.id))} onChange={e => setForm(p => ({ ...p, categoryIds: e.target.checked ? [...p.categoryIds, String(c.id)] : p.categoryIds.filter(x => x !== String(c.id)) }))} style={{ display: "none" }}/>
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button onClick={uploadSong} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {saving ? <Spinner size={18}/> : <><Icon name="upload" size={16}/>{editSong ? " Update" : " Upload"}</>}
          </button>
        </div>
      )}

      {/* Lyrics modal */}
      {showLyricsForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", display: "flex", alignItems: "flex-end", zIndex: 500 }}>
          <div style={{ background: "#141020", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%" }} className="bottom-sheet">
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.15)", margin: "0 auto 20px" }}/>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Edit Lyrics</div>
            <textarea value={lyricsText} onChange={e => setLyricsText(e.target.value)} rows={8} placeholder="Paste song lyrics..." style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 14, resize: "vertical" }}/>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => saveLyrics(showLyricsForm)} disabled={lyricsSaving} className="pill-btn pill-btn-primary tap-scale" style={{ flex: 1, justifyContent: "center", padding: "14px" }}>
                {lyricsSaving ? <Spinner size={16}/> : <><Icon name="check" size={14}/> Save</>}
              </button>
              <button onClick={() => { setShowLyricsForm(null); setLyricsText(""); }} className="pill-btn pill-btn-ghost tap-scale" style={{ flex: 1, justifyContent: "center", padding: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36}/></div> : (
        <>
          {songs.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <CoverImg src={s.coverImage} alt={s.title} size={44} radius={10}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", display: "flex", gap: 8 }}>
                  <span>{s.artist?.name || "—"}</span>
                  {s.premium && <span style={{ color: "#fbbf24" }}>PRO</span>}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button onClick={() => openLyrics(s)} style={{ background: "rgba(52,211,153,.12)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#34d399", fontSize: 11, fontWeight: 700 }}>Lyrics</button>
                  <button onClick={() => deleteSong(s.id)} style={{ background: "rgba(239,68,68,.12)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>Delete</button>
                </div>
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", flexShrink: 0 }}>{fmtDur(s.durationSeconds)}</span>
            </div>
          ))}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
              <button onClick={() => { const p = Math.max(0, page-1); setPage(p); load(p); }} disabled={page === 0} className="pill-btn pill-btn-ghost tap-scale">Prev</button>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: 13, lineHeight: "38px" }}>{page+1}/{totalPages}</span>
              <button onClick={() => { const p = Math.min(totalPages-1, page+1); setPage(p); load(p); }} disabled={page >= totalPages-1} className="pill-btn pill-btn-ghost tap-scale">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AdminArtists({ toast }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editArtist, setEditArtist] = useState(null);
  const [form, setForm] = useState({ name: "", bio: "", country: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const load = async (p = 0) => {
    setLoading(true);
    try { const r = await api.get(`/api/artists?page=${p}&size=20`); setArtists(Array.isArray(r) ? r : (r.content || [])); }
    catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: "", bio: "", country: "" }); setImageFile(null); setEditArtist(null); setShowForm(false); if (fileRef.current) fileRef.current.value = ""; };

  const save = async () => {
    if (!form.name.trim()) { toast("Name required", "warning"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (imageFile) fd.append("image", imageFile);
      if (editArtist) { const r = await api.putForm(`/api/artists/${editArtist.id}`, fd); setArtists(p => p.map(a => a.id === editArtist.id ? r : a)); toast("Artist updated!"); }
      else { const r = await api.postForm("/api/artists", fd); setArtists(p => [r, ...p]); toast("Artist created!"); }
      resetForm();
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const deleteArtist = async (id) => {
    if (!confirm("Delete this artist?")) return;
    try { await api.delete(`/api/artists/${id}`); setArtists(p => p.filter(a => a.id !== id)); toast("Deleted"); }
    catch (err) { toast(err.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Artists</div>
        <button onClick={() => { if (showForm) resetForm(); else { resetForm(); setShowForm(true); } }} className="pill-btn pill-btn-primary tap-scale" style={{ padding: "9px 14px" }}>
          <Icon name={showForm ? "x" : "plus"} size={14}/>{showForm ? "Cancel" : "Add"}
        </button>
      </div>
      {showForm && (
        <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <InputField label="Artist Name *" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Artist name"/>
          <InputField label="Country" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India..."/>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} rows={2} style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 14, resize: "none" }}/>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: "100%", color: "#f0eeff", fontSize: 13 }}/>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ flex: 1, justifyContent: "center", padding: "13px" }}>
              {saving ? <Spinner size={16}/> : <><Icon name="check" size={14}/>{editArtist ? " Update" : " Create"}</>}
            </button>
            <button onClick={resetForm} className="pill-btn pill-btn-ghost tap-scale" style={{ flex: 1, justifyContent: "center", padding: "13px" }}>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36}/></div> : (
        artists.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.06)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {a.imageUrl ? <img src={a.imageUrl} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="user" size={22} color="rgba(255,255,255,.3)"/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
              {a.country && <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>📍 {a.country}</div>}
            </div>
            <button onClick={() => { setEditArtist(a); setForm({ name: a.name||"", bio: a.bio||"", country: a.country||"" }); setShowForm(true); }} className="icon-btn tap-scale" style={{ width: 34, height: 34, color: "#a855f7" }}><Icon name="edit" size={16}/></button>
            <button onClick={() => deleteArtist(a.id)} className="icon-btn tap-scale" style={{ width: 34, height: 34, color: "#ef4444" }}><Icon name="trash" size={16}/></button>
          </div>
        ))
      )}
      {!loading && artists.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,.3)" }}><Icon name="user" size={40}/><p style={{ marginTop: 10 }}>No artists yet</p></div>}
    </div>
  );
}

function AdminAlbums({ toast }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", artistId: "", releaseDate: "", type: "ALBUM", description: "" });
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [artists, setArtists] = useState([]);

  const loadAlbums = () => {
    api.get("/api/albums?size=50").then(r => setAlbums(Array.isArray(r) ? r : (r.content || []))).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  };
  useEffect(() => { loadAlbums(); api.get("/api/artists?size=100").then(r => setArtists(Array.isArray(r) ? r : (r.content || []))).catch(() => {}); }, []);

  const create = async () => {
    if (!form.title || !form.artistId) { toast("Title and artist required", "warning"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({ ...form, artistId: +form.artistId })], { type: "application/json" }));
      if (coverFile) fd.append("cover", coverFile);
      const r = await api.postForm("/api/albums", fd);
      setAlbums(p => [r, ...p]); setShowForm(false); setForm({ title: "", artistId: "", releaseDate: "", type: "ALBUM", description: "" }); setCoverFile(null); toast("Album created!");
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const deleteAlbum = async (id) => {
    if (!confirm("Delete this album?")) return;
    try { await api.delete(`/api/albums/${id}`); setAlbums(p => p.filter(a => a.id !== id)); toast("Album deleted"); }
    catch (err) { toast(err.message, "error"); }
  };

  const selStyle = { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 14, marginBottom: 14 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Albums</div>
        <button onClick={() => setShowForm(s => !s)} className="pill-btn pill-btn-primary tap-scale" style={{ padding: "9px 14px" }}>
          <Icon name={showForm ? "x" : "plus"} size={14}/>{showForm ? "Cancel" : "Create"}
        </button>
      </div>
      {showForm && (
        <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <InputField label="Album Title *" value={form.title} onChange={v => setForm(p => ({...p, title: v}))} placeholder="Album title"/>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Artist *</label>
          <select value={form.artistId} onChange={e => setForm(p => ({...p, artistId: e.target.value}))} style={selStyle}>
            <option value="">Select artist</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Type</label>
          <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} style={selStyle}>
            {["ALBUM","EP","SINGLE","COMPILATION"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Release Date</label>
            <input type="date" value={form.releaseDate} onChange={e => setForm(p => ({...p, releaseDate: e.target.value}))} style={{ ...selStyle, colorScheme: "dark" }}/>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Cover Image</label>
            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={{ width: "100%", color: "#f0eeff", fontSize: 13 }}/>
          </div>
          <button onClick={create} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {saving ? <Spinner size={16}/> : "Create Album"}
          </button>
        </div>
      )}
      {loading ? <Spinner size={36}/> : (
        <>
          {albums.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <CoverImg src={a.coverImage} alt={a.title} size={50} radius={10}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{a.artist?.name} • {a.totalTracks||0} tracks • {a.type}</div>
              </div>
              <button onClick={() => deleteAlbum(a.id)} className="icon-btn tap-scale" style={{ width: 34, height: 34, color: "#ef4444" }}><Icon name="trash" size={16}/></button>
            </div>
          ))}
          {albums.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,.3)" }}>No albums yet</div>}
        </>
      )}
    </div>
  );
}

function AdminCategories({ toast }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#a855f7");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/api/categories").then(r => setCats(Array.isArray(r) ? r : (r.content || []))).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({ name, color })], { type: "application/json" }));
      const r = await api.postForm("/api/categories", fd);
      setCats(p => [...p, r]); setName(""); toast("Category created!");
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    try { await api.delete(`/api/categories/${id}`); setCats(p => p.filter(c => c.id !== id)); toast("Deleted"); }
    catch (err) { toast(err.message, "error"); }
  };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif", marginBottom: 16 }}>Categories</div>
      <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><InputField label="Category Name" value={name} onChange={setName} placeholder="Pop, Bollywood..."/></div>
          <div style={{ marginBottom: 14 }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 44, height: 44, borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", cursor: "pointer", background: "none" }}/>
          </div>
          <button onClick={create} disabled={saving} className="pill-btn pill-btn-primary tap-scale" style={{ marginBottom: 14, padding: "12px 16px" }}>
            {saving ? <Spinner size={14}/> : <Icon name="plus" size={16}/>}
          </button>
        </div>
      </div>
      {loading ? <Spinner size={36}/> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {cats.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: `${c.color || "#a855f7"}22`, border: `1px solid ${c.color || "#a855f7"}44` }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: c.color || "#f0eeff" }}>{c.name}</span>
              <button onClick={() => del(c.id)} className="icon-btn tap-scale" style={{ width: 20, height: 20, color: "#ef4444" }}><Icon name="x" size={12}/></button>
            </div>
          ))}
          {cats.length === 0 && <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No categories yet</div>}
        </div>
      )}
    </div>
  );
}

function AdminUsers({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = async (p = 0) => {
    setLoading(true);
    try { const r = await api.get(`/api/users?page=${p}&size=20`); setUsers(r.content || []); setTotalPages(r.totalPages || 0); }
    catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateUser = async (id, update) => {
    try { const r = await api.put(`/api/users/${id}`, update); setUsers(p => p.map(u => u.id === id ? r : u)); toast("Updated"); }
    catch (err) { toast(err.message, "error"); }
  };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif", marginBottom: 16 }}>Users</div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36}/></div> : (
        <>
          {users.map(u => (
            <div key={u.id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.06)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {u.profileImage ? <img src={u.profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="user" size={16} color="rgba(255,255,255,.4)"/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {u.role === "ADMIN" && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(251,191,36,.15)", color: "#fbbf24", fontWeight: 700 }}>ADMIN</span>}
                  {u.premium && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(251,191,36,.15)", color: "#fbbf24", fontWeight: 700 }}>PRO</span>}
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: u.accountStatus === "ACTIVE" ? "rgba(52,211,153,.15)" : "rgba(239,68,68,.15)", color: u.accountStatus === "ACTIVE" ? "#34d399" : "#ef4444", fontWeight: 700 }}>{u.accountStatus}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => updateUser(u.id, { role: u.role === "ADMIN" ? "USER" : "ADMIN" })} style={{ background: "rgba(168,85,247,.12)", border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: "#c084fc", fontSize: 12, fontWeight: 600 }} className="tap-scale">
                  {u.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                </button>
                <button onClick={() => updateUser(u.id, { premium: !u.premium })} style={{ background: "rgba(251,191,36,.12)", border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: "#fbbf24", fontSize: 12, fontWeight: 600 }} className="tap-scale">
                  {u.premium ? "Revoke Pro" : "Grant Pro"}
                </button>
                <button onClick={() => updateUser(u.id, { accountStatus: u.accountStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE" })} style={{ background: u.accountStatus === "ACTIVE" ? "rgba(239,68,68,.12)" : "rgba(52,211,153,.12)", border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: u.accountStatus === "ACTIVE" ? "#ef4444" : "#34d399", fontSize: 12, fontWeight: 600 }} className="tap-scale">
                  {u.accountStatus === "ACTIVE" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
              <button onClick={() => { const p = Math.max(0, page-1); setPage(p); load(p); }} disabled={page === 0} className="pill-btn pill-btn-ghost tap-scale">Prev</button>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: 13, lineHeight: "38px" }}>{page+1}/{totalPages}</span>
              <button onClick={() => { const p = Math.min(totalPages-1, page+1); setPage(p); load(p); }} disabled={page >= totalPages-1} className="pill-btn pill-btn-ghost tap-scale">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AdminQRCodes({ toast }) {
  const [qrType, setQrType] = useState("premium");
  const [customValue, setCustomValue] = useState("");
  const [generatedQr, setGeneratedQr] = useState(null);
  const canvasRef = useRef(null);
  const [qrList, setQrList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/api/admin/qr-codes").then(r => setQrList(Array.isArray(r) ? r : (r.content || []))).catch(() => setQrList([])).finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    const value = customValue || `PREMIUM_UPGRADE_${Date.now()}`;
    try {
      const r = await api.post("/api/admin/qr-codes", { type: qrType, value }).catch(() => ({ value }));
      const qrValue = r?.value || value;
      setGeneratedQr(qrValue);
      setQrList(p => [{ id: Date.now(), type: qrType, value: qrValue, createdAt: new Date() }, ...p]);
      toast("QR generated!");
    } catch { setGeneratedQr(value); }
  };

  useEffect(() => { if (generatedQr && canvasRef.current) generateQR(canvasRef.current, generatedQr); }, [generatedQr]);

  const selStyle = { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#f0eeff", fontFamily: "inherit", fontSize: 14, marginBottom: 14 };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Syne',sans-serif", marginBottom: 16 }}>QR Code Manager</div>
      <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 14 }}>Generate QR Code</div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Type</label>
        <select value={qrType} onChange={e => setQrType(e.target.value)} style={selStyle}>
          <option value="premium">Premium Upgrade</option>
          <option value="discount">Discount Code</option>
          <option value="free_trial">Free Trial</option>
          <option value="custom">Custom</option>
        </select>
        <InputField label="Custom Value (optional)" value={customValue} onChange={setCustomValue} placeholder="Auto-generate if blank"/>
        <button onClick={generate} className="pill-btn pill-btn-primary tap-scale" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
          <Icon name="qr" size={16}/> Generate QR
        </button>
        {generatedQr && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <canvas ref={canvasRef} width={160} height={160} style={{ borderRadius: 10, background: "#fff", padding: 8 }}/>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 8, wordBreak: "break-all" }}>{generatedQr.length > 40 ? generatedQr.slice(0,40)+"..." : generatedQr}</p>
            <button onClick={() => { const a = document.createElement("a"); a.download = `qr-${qrType}.png`; a.href = canvasRef.current?.toDataURL(); a.click(); }} className="pill-btn pill-btn-ghost tap-scale" style={{ marginTop: 10 }}>
              <Icon name="download" size={14}/> Download
            </button>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Generated QR Codes</div>
        {loading ? <Spinner size={28}/> : (
          qrList.length === 0
            ? <p style={{ color: "rgba(255,255,255,.35)", fontSize: 14 }}>No QR codes yet</p>
            : qrList.slice(0,10).map((q, i) => (
              <div key={q.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(168,85,247,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="qr" size={18} color="#a855f7"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{q.type || "premium"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.value}</div>
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "now"}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
