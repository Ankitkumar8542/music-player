// import { useState, useEffect, useRef, useCallback } from "react";

// // ─── API CONFIG ───────────────────────────────────────────────────────────────
// const BASE_URL = "https://music-app-lu25.onrender.com";
// const api = {
//   headers: (isFormData = false) => {
//     const h = {};
//     const t = localStorage.getItem("mp_token");
//     if (t) h["Authorization"] = `Bearer ${t}`;
//     if (!isFormData) h["Content-Type"] = "application/json";
//     return h;
//   },
//   async get(path) {
//     const r = await fetch(`${BASE_URL}${path}`, { headers: api.headers() });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
//   async post(path, body) {
//     const r = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: api.headers(), body: JSON.stringify(body) });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
//   async put(path, body) {
//     const r = await fetch(`${BASE_URL}${path}`, { method: "PUT", headers: api.headers(), body: JSON.stringify(body) });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
//   async delete(path) {
//     const r = await fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: api.headers() });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
//   async postForm(path, formData) {
//     const r = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: api.headers(true), body: formData });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
//   async putForm(path, formData) {
//     const r = await fetch(`${BASE_URL}${path}`, { method: "PUT", headers: api.headers(true), body: formData });
//     const d = await r.json();
//     if (!r.ok) throw new Error(d.message || "Request failed");
//     return d.data ?? d;
//   },
// };

// // ─── UTILS ────────────────────────────────────────────────────────────────────
// const fmtDur = (s) => {
//   if (!s && s !== 0) return "0:00";
//   const m = Math.floor(s / 60), sec = Math.floor(s % 60);
//   return `${m}:${String(sec).padStart(2, "0")}`;
// };

// // ─── ICONS ────────────────────────────────────────────────────────────────────
// const Icon = ({ name, size = 20, className = "", color }) => {
//   const icons = {
//     play: <polygon points="5,3 19,12 5,21" fill="currentColor"/>,
//     pause: <><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></>,
//     skip_next: <><polygon points="5,4 15,12 5,20" fill="currentColor"/><rect x="17" y="4" width="2" height="16" fill="currentColor"/></>,
//     skip_prev: <><polygon points="19,4 9,12 19,20" fill="currentColor"/><rect x="5" y="4" width="2" height="16" fill="currentColor"/></>,
//     shuffle: <><polyline points="16,3 21,3 21,8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/><polyline points="21,16 21,21 16,21" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="4" x2="9" y2="9" stroke="currentColor" strokeWidth="2"/></>,
//     repeat: <><polyline points="17,1 21,5 17,9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="7,23 3,19 7,15" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     heart_fill: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>,
//     volume: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     volume_mute: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2"/></>,
//     search: <><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></>,
//     home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     plus: <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></>,
//     music: <><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/></>,
//     album: <><rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     history: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     crown: <><path d="M2 20h20l-3-9-5 5-2-8-2 8-5-5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     trash: <><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     x: <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/></>,
//     check: <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     list_music: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/></>,
//     tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2"/></>,
//     shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     chevron_down: <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     chevron_left: <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     lyrics: <><line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/></>,
//     queue: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="3"/></>,
//     mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/></>,
//     bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     clock: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     trending: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     bar_chart: <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/></>,
//     sleep: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none"/>,
//     speed: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,10" stroke="currentColor" strokeWidth="2" fill="none"/></>,
//     equalizer: <><line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="2"/></>,
//     share: <><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/></>,
//     add_playlist: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="16" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="19" y1="2" x2="19" y2="8" stroke="currentColor" strokeWidth="2"/></>,
//   };
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ flexShrink: 0, color }}>
//       {icons[name] || null}
//     </svg>
//   );
// };

// // ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
// const GlobalStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
//     html, body, #root { height: 100%; overflow: hidden; }
//     body { font-family: 'Inter', sans-serif; background: #0a0a0f; color: #f0eeff; overscroll-behavior: none; }
//     ::-webkit-scrollbar { display: none; }
//     input, select, textarea { outline: none !important; font-family: inherit; }
//     button { font-family: inherit; }

//     @keyframes spin { to { transform: rotate(360deg); } }
//     @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//     @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
//     @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
//     @keyframes scaleIn { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
//     @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
//     @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//     @keyframes barsAnim {
//       0%, 100% { height: 6px; }
//       25% { height: 14px; }
//       50% { height: 10px; }
//       75% { height: 18px; }
//     }

//     .range-track {
//       -webkit-appearance: none; appearance: none;
//       height: 3px; border-radius: 99px; cursor: pointer;
//       background: rgba(255,255,255,.12);
//     }
//     .range-track::-webkit-slider-thumb {
//       -webkit-appearance: none; width: 14px; height: 14px;
//       border-radius: 50%; background: #fff; cursor: pointer;
//       box-shadow: 0 2px 8px rgba(0,0,0,.4);
//     }

//     .t { transition: all .15s ease; }
//     .tap:active { transform: scale(.93); }
//     .song-row:hover { background: rgba(255,255,255,.04); }
//     .song-row:active { background: rgba(255,255,255,.07); }

//     .slide-up { animation: slideUp .3s cubic-bezier(.22,1,.36,1); }
//     .fade-up { animation: fadeUp .35s ease; }
//     .fade-in { animation: fadeIn .2s ease; }
//     .scale-in { animation: scaleIn .2s ease; }

//     .playing-bars {
//       display: flex; align-items: flex-end; gap: 2px; height: 18px;
//     }
//     .playing-bars span {
//       width: 3px; border-radius: 2px; background: #a855f7;
//       animation: barsAnim .8s ease-in-out infinite;
//     }
//     .playing-bars span:nth-child(2) { animation-delay: .2s; }
//     .playing-bars span:nth-child(3) { animation-delay: .4s; }

//     .pill {
//       display: inline-flex; align-items: center; gap: 6px;
//       padding: 8px 16px; border-radius: 99px; border: none; cursor: pointer;
//       font-size: 13px; font-weight: 600; font-family: inherit;
//       transition: all .15s; white-space: nowrap;
//     }
//     .pill:active { transform: scale(.95); }
//     .pill-solid { background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; box-shadow: 0 4px 16px rgba(124,58,237,.35); }
//     .pill-ghost { background: rgba(255,255,255,.06); color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.1); }
//     .pill-danger { background: rgba(239,68,68,.1); color: #ef4444; border: 1px solid rgba(239,68,68,.15); }

//     .icon-btn {
//       background: none; border: none; cursor: pointer;
//       display: flex; align-items: center; justify-content: center;
//       border-radius: 50%; transition: all .15s;
//     }
//     .icon-btn:active { background: rgba(255,255,255,.1); transform: scale(.88); }

//     .card {
//       background: rgba(255,255,255,.04);
//       border: 1px solid rgba(255,255,255,.07);
//       border-radius: 16px;
//     }

//     .shimmer {
//       background: linear-gradient(90deg, rgba(255,255,255,.02) 25%, rgba(255,255,255,.07) 50%, rgba(255,255,255,.02) 75%);
//       background-size: 200% 100%;
//       animation: shimmer 1.4s infinite;
//     }

//     .bottom-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 8px); }
//   `}</style>
// );

// // ─── PRIMITIVES ───────────────────────────────────────────────────────────────
// const Spinner = ({ size = 24 }) => (
//   <div style={{ width: size, height: size, border: `2px solid rgba(255,255,255,.1)`, borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }}/>
// );

// const CoverArt = ({ src, alt, size = 48, radius = 10 }) => (
//   <div style={{ width: size, height: size, borderRadius: radius, overflow: "hidden", background: "linear-gradient(135deg,#1a1028,#2a1545)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//     {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="music" size={Math.round(size * 0.36)} color="rgba(255,255,255,.2)"/>}
//   </div>
// );

// const Toast = ({ toasts, remove }) => (
//   <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
//     {toasts.map(t => (
//       <div key={t.id} style={{
//         background: t.type === "error" ? "#c0392b" : t.type === "warning" ? "#d97706" : "#047857",
//         color: "#fff", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500,
//         display: "flex", alignItems: "center", gap: 10,
//         animation: "scaleIn .2s ease", boxShadow: "0 8px 32px rgba(0,0,0,.5)",
//         pointerEvents: "all",
//       }} className="scale-in">
//         <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
//         <button onClick={() => remove(t.id)} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", cursor: "pointer", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <Icon name="x" size={11}/>
//         </button>
//       </div>
//     ))}
//   </div>
// );

// const Field = ({ label, value, onChange, placeholder, type = "text", onEnter }) => (
//   <div style={{ marginBottom: 14 }}>
//     {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</label>}
//     <input
//       type={type} value={value} onChange={e => onChange(e.target.value)}
//       placeholder={placeholder} onKeyDown={e => e.key === "Enter" && onEnter?.()}
//       style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "12px 14px", color: "#f0eeff", fontSize: 15 }}
//     />
//   </div>
// );

// // ─── SLEEP TIMER ─────────────────────────────────────────────────────────────
// function SleepTimerBadge({ minutes, onClear }) {
//   const [remaining, setRemaining] = useState(minutes * 60);
//   useEffect(() => {
//     const t = setInterval(() => setRemaining(r => r - 1), 1000);
//     return () => clearInterval(t);
//   }, []);
//   const m = Math.floor(remaining / 60), s = remaining % 60;
//   return (
//     <div onClick={onClear} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(168,85,247,.15)", border: "1px solid rgba(168,85,247,.3)", cursor: "pointer" }}>
//       <Icon name="sleep" size={12} color="#a855f7"/>
//       <span style={{ fontSize: 12, fontWeight: 600, color: "#c084fc" }}>{m}:{String(s).padStart(2,"0")}</span>
//     </div>
//   );
// }

// // ─── LIKE BUTTON ─────────────────────────────────────────────────────────────
// function LikeBtn({ songId, liked: init, toast, size = 20 }) {
//   const [liked, setLiked] = useState(init);
//   const toggle = async (e) => {
//     e.stopPropagation();
//     try { const r = await api.post(`/api/songs/${songId}/like`); setLiked(r.liked); }
//     catch (err) { toast(err.message, "error"); }
//   };
//   return (
//     <button className="icon-btn tap" onClick={toggle} style={{ width: size + 16, height: size + 16, color: liked ? "#f43f5e" : "rgba(255,255,255,.35)" }}>
//       <Icon name={liked ? "heart_fill" : "heart"} size={size}/>
//     </button>
//   );
// }

// // ─── SONG ROW ─────────────────────────────────────────────────────────────────
// function SongRow({ song, idx, songs, playSong, toast, currentSong, isPlaying, onAddToPlaylist }) {
//   const isActive = currentSong?.id === song.id;
//   return (
//     <div
//       className="song-row t"
//       style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", borderRadius: 10, cursor: "pointer" }}
//       onClick={() => playSong(song, songs, idx)}
//     >
//       <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//         {isActive && isPlaying ? (
//           <div className="playing-bars"><span/><span/><span/></div>
//         ) : (
//           <span style={{ fontSize: 13, color: isActive ? "#a855f7" : "rgba(255,255,255,.25)", fontWeight: isActive ? 700 : 400 }}>{idx + 1}</span>
//         )}
//       </div>
//       <CoverArt src={song.coverImage} alt={song.title} size={44} radius={8}/>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 600, fontSize: 14, color: isActive ? "#c084fc" : "#f0eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
//         <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
//           <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</span>
//           {song.premium && <span style={{ fontSize: 9, background: "rgba(251,191,36,.15)", color: "#fbbf24", padding: "2px 5px", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>PRO</span>}
//         </div>
//       </div>
//       <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)", flexShrink: 0 }}>{fmtDur(song.durationSeconds)}</span>
//       <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={17}/>
//       {onAddToPlaylist && (
//         <button className="icon-btn t" onClick={e => { e.stopPropagation(); onAddToPlaylist(song); }} style={{ width: 32, height: 32, color: "rgba(255,255,255,.3)" }}>
//           <Icon name="add_playlist" size={15}/>
//         </button>
//       )}
//     </div>
//   );
// }

// // ─── MINI PLAYER ─────────────────────────────────────────────────────────────
// function MiniPlayer({ song, isPlaying, progress, duration, onExpand, onPlay, onNext, toast }) {
//   const pct = duration ? (progress / duration) * 100 : 0;
//   return (
//     <div style={{
//       position: "absolute", bottom: 68, left: 10, right: 10,
//       borderRadius: 16, overflow: "hidden",
//       background: "rgba(22,16,44,.97)", backdropFilter: "blur(28px)",
//       boxShadow: "0 4px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.07)",
//       zIndex: 90,
//     }}>
//       <div style={{ height: 2, background: "rgba(255,255,255,.08)" }}>
//         <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#c084fc)", borderRadius: 2, transition: "width .2s linear" }}/>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 12 }}>
//         <div style={{ cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }} onClick={onExpand}>
//           <CoverArt src={song.coverImage} alt={song.title} size={42} radius={8}/>
//           <div style={{ minWidth: 0 }}>
//             <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
//             <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</div>
//           </div>
//         </div>
//         <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={18}/>
//         <button className="icon-btn tap" onClick={onPlay} style={{ width: 40, height: 40, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", borderRadius: "50%" }}>
//           <Icon name={isPlaying ? "pause" : "play"} size={17}/>
//         </button>
//         <button className="icon-btn tap" onClick={onNext} style={{ width: 36, height: 36, color: "rgba(255,255,255,.5)" }}>
//           <Icon name="skip_next" size={22}/>
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── FULL PLAYER ─────────────────────────────────────────────────────────────
// function FullPlayer({
//   song, queue, queueIdx, isPlaying, progress, duration, volume, muted,
//   shuffle, repeat, sleepTimer, playbackRate,
//   onClose, onSeek, onPlay, onNext, onPrev, onShuffle, onRepeat,
//   onVolume, onMute, onSleepTimer, onPlaybackRate, toast
// }) {
//   const [tab, setTab] = useState(null); // null | "lyrics" | "queue" | "settings"
//   const [lyrics, setLyrics] = useState(null);
//   const [lyricsLoading, setLyricsLoading] = useState(false);
//   const progressPct = duration ? (progress / duration) * 100 : 0;
//   const barRef = useRef(null);

//   useEffect(() => {
//     if (tab !== "lyrics" || !song?.id) return;
//     setLyricsLoading(true);
//     api.get(`/api/songs/${song.id}/lyrics`)
//       .then(r => setLyrics(r?.lyrics || r?.content || (typeof r === "string" ? r : null)))
//       .catch(() => setLyrics(null))
//       .finally(() => setLyricsLoading(false));
//   }, [tab, song?.id]);

//   const handleSeek = (e) => {
//     const bar = barRef.current;
//     if (!bar || !duration) return;
//     const rect = bar.getBoundingClientRect();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
//     if (barRef.current) {
//       const synth = { currentTarget: bar, clientX };
//       onSeek(synth);
//     }
//   };

//   const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
//   const sleepOptions = [5, 10, 15, 30, 45, 60];

//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", background: "#08080f" }} className="slide-up">
//       {song.coverImage && (
//         <div style={{
//           position: "absolute", inset: 0,
//           backgroundImage: `url(${song.coverImage})`,
//           backgroundSize: "cover", backgroundPosition: "center",
//           filter: "blur(70px) saturate(1.6) brightness(.25)",
//           transform: "scale(1.12)",
//         }}/>
//       )}
//       <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,15,.5) 0%, rgba(8,8,15,.75) 55%, rgba(8,8,15,.97) 100%)" }}/>

//       <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0" }}>
//           <button className="icon-btn tap" onClick={onClose} style={{ width: 40, height: 40, color: "rgba(255,255,255,.6)" }}>
//             <Icon name="chevron_down" size={24}/>
//           </button>
//           <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase" }}>Now Playing</div>
//           <div style={{ width: 40 }}/>
//         </div>

//         {/* Art */}
//         <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 48px 12px" }}>
//           <div style={{
//             width: "min(70vw, 268px)", height: "min(70vw, 268px)",
//             borderRadius: 20,
//             boxShadow: isPlaying
//               ? "0 0 70px rgba(168,85,247,.4), 0 20px 60px rgba(0,0,0,.7)"
//               : "0 20px 50px rgba(0,0,0,.6)",
//             transition: "box-shadow .6s, transform .3s",
//             transform: isPlaying ? "scale(1.03)" : "scale(0.97)",
//             overflow: "hidden",
//           }}>
//             <CoverArt src={song.coverImage} alt={song.title} size={"100%"} radius={0} />
//           </div>
//         </div>

//         {/* Info + Like */}
//         <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-.2px" }}>{song.title}</div>
//             <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginTop: 3 }}>{song.artist?.name || "Unknown"}</div>
//           </div>
//           <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={22}/>
//         </div>

//         {/* Progress */}
//         <div style={{ padding: "18px 24px 8px" }}>
//           <div ref={barRef} onClick={handleSeek} onTouchStart={handleSeek}
//             style={{ height: 4, background: "rgba(255,255,255,.12)", borderRadius: 99, cursor: "pointer", position: "relative" }}>
//             <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#7c3aed,#c084fc)", borderRadius: 99, transition: "width .15s linear" }}/>
//             <div style={{ position: "absolute", top: "50%", left: `${progressPct}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.4)", transition: "left .15s linear" }}/>
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
//             <span>{fmtDur(Math.floor(progress))}</span>
//             <span>{fmtDur(Math.floor(duration))}</span>
//           </div>
//         </div>

//         {/* Controls */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 28px" }}>
//           <button className="icon-btn tap" onClick={onShuffle} style={{ width: 44, height: 44, color: shuffle ? "#c084fc" : "rgba(255,255,255,.35)" }}>
//             <Icon name="shuffle" size={20}/>
//           </button>
//           <button className="icon-btn tap" onClick={onPrev} style={{ width: 50, height: 50, color: "#f0eeff" }}>
//             <Icon name="skip_prev" size={30}/>
//           </button>
//           <button className="tap" onClick={onPlay} style={{
//             width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)",
//             border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//             color: "#fff", boxShadow: "0 8px 28px rgba(124,58,237,.55)", transition: "all .15s",
//           }}>
//             <Icon name={isPlaying ? "pause" : "play"} size={28}/>
//           </button>
//           <button className="icon-btn tap" onClick={onNext} style={{ width: 50, height: 50, color: "#f0eeff" }}>
//             <Icon name="skip_next" size={30}/>
//           </button>
//           <button className="icon-btn tap" onClick={onRepeat} style={{ width: 44, height: 44, color: repeat ? "#c084fc" : "rgba(255,255,255,.35)" }}>
//             <Icon name="repeat" size={20}/>
//           </button>
//         </div>

//         {/* Volume */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 28px 10px" }}>
//           <button className="icon-btn" onClick={onMute} style={{ color: "rgba(255,255,255,.35)", width: 30, height: 30 }}>
//             <Icon name={muted ? "volume_mute" : "volume"} size={17}/>
//           </button>
//           <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume}
//             onChange={e => onVolume(+e.target.value)}
//             className="range-track" style={{ flex: 1, accentColor: "#a855f7" }}/>
//         </div>

//         {/* Tab bar */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "0 20px 14px" }}>
//           {[
//             { id: "lyrics", icon: "lyrics", label: "Lyrics" },
//             { id: "queue", icon: "queue", label: `Queue (${queue.length})` },
//             { id: "settings", icon: "equalizer", label: "Options" },
//           ].map(t => (
//             <button key={t.id} onClick={() => setTab(v => v === t.id ? null : t.id)} className="pill t"
//               style={{ background: tab === t.id ? "rgba(168,85,247,.2)" : "rgba(255,255,255,.05)", color: tab === t.id ? "#c084fc" : "rgba(255,255,255,.45)", border: `1px solid ${tab === t.id ? "rgba(168,85,247,.35)" : "rgba(255,255,255,.07)"}` }}>
//               <Icon name={t.icon} size={13}/>{t.label}
//             </button>
//           ))}
//         </div>

//         {/* Panels */}
//         {tab === "lyrics" && (
//           <div className="fade-in" style={{ margin: "0 16px 14px", background: "rgba(255,255,255,.04)", borderRadius: 14, padding: 16, maxHeight: 170, overflowY: "auto" }}>
//             {lyricsLoading ? <div style={{ display: "flex", justifyContent: "center" }}><Spinner/></div> : (
//               lyrics
//                 ? <pre style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.9, color: "rgba(255,255,255,.78)", whiteSpace: "pre-wrap", textAlign: "center" }}>{lyrics}</pre>
//                 : <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, textAlign: "center" }}>No lyrics available</p>
//             )}
//           </div>
//         )}

//         {tab === "queue" && (
//           <div className="fade-in" style={{ margin: "0 16px 14px", background: "rgba(255,255,255,.03)", borderRadius: 14, maxHeight: 190, overflowY: "auto" }}>
//             <div style={{ padding: "10px 14px 6px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase" }}>Up Next</div>
//             {queue.map((s, i) => (
//               <div key={`${s.id}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", background: i === queueIdx ? "rgba(168,85,247,.1)" : "none", cursor: "pointer" }}>
//                 <CoverArt src={s.coverImage} alt={s.title} size={36} radius={6}/>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 13, fontWeight: i === queueIdx ? 600 : 400, color: i === queueIdx ? "#c084fc" : "#f0eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
//                   <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{s.artist?.name}</div>
//                 </div>
//                 {i === queueIdx && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a855f7" }}/>}
//               </div>
//             ))}
//           </div>
//         )}

//         {tab === "settings" && (
//           <div className="fade-in" style={{ margin: "0 16px 14px", background: "rgba(255,255,255,.03)", borderRadius: 14, padding: 14 }}>
//             <div style={{ marginBottom: 14 }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Playback Speed</div>
//               <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                 {speeds.map(s => (
//                   <button key={s} onClick={() => onPlaybackRate(s)} className="pill t" style={{ padding: "5px 12px", fontSize: 12, background: playbackRate === s ? "rgba(168,85,247,.2)" : "rgba(255,255,255,.05)", color: playbackRate === s ? "#c084fc" : "rgba(255,255,255,.5)", border: `1px solid ${playbackRate === s ? "rgba(168,85,247,.3)" : "transparent"}` }}>
//                     {s}x
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Sleep Timer</div>
//               <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                 {sleepOptions.map(m => (
//                   <button key={m} onClick={() => onSleepTimer(m)} className="pill t" style={{ padding: "5px 12px", fontSize: 12, background: sleepTimer?.minutes === m ? "rgba(168,85,247,.2)" : "rgba(255,255,255,.05)", color: sleepTimer?.minutes === m ? "#c084fc" : "rgba(255,255,255,.5)", border: `1px solid ${sleepTimer?.minutes === m ? "rgba(168,85,247,.3)" : "transparent"}` }}>
//                     {m}m
//                   </button>
//                 ))}
//                 {sleepTimer && <button onClick={() => onSleepTimer(null)} className="pill t" style={{ padding: "5px 12px", fontSize: 12, background: "rgba(239,68,68,.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,.15)" }}>Off</button>}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── ADD TO PLAYLIST SHEET ────────────────────────────────────────────────────
// function AddToPlaylistSheet({ song, toast, onClose }) {
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(null);

//   useEffect(() => {
//     api.get("/api/playlists/me?size=50")
//       .then(r => setPlaylists(r.content || []))
//       .catch(err => toast(err.message, "error"))
//       .finally(() => setLoading(false));
//   }, []);

//   const add = async (plId) => {
//     setAdding(plId);
//     try {
//       await api.post(`/api/playlists/${plId}/songs`, { songId: song.id });
//       toast("Added to playlist"); onClose();
//     } catch (err) { toast(err.message, "error"); }
//     finally { setAdding(null); }
//   };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "flex-end", zIndex: 500 }} onClick={onClose}>
//       <div className="slide-up" style={{ background: "#131020", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", width: "100%", maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
//         <div style={{ width: 34, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)", margin: "0 auto 16px" }}/>
//         <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Add to playlist</div>
//         <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 16 }}>{song.title}</div>
//         <div style={{ overflowY: "auto" }}>
//           {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Spinner/></div> : (
//             playlists.length === 0
//               ? <p style={{ color: "rgba(255,255,255,.3)", textAlign: "center", padding: 30 }}>No playlists yet. Create one in Library.</p>
//               : playlists.map(pl => (
//                 <div key={pl.id} onClick={() => add(pl.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: "1px solid rgba(255,255,255,.05)", cursor: "pointer" }}>
//                   <CoverArt src={pl.coverImage} alt={pl.name} size={44} radius={8}/>
//                   <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{pl.name}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>{pl.totalTracks ?? 0} songs</div></div>
//                   {adding === pl.id ? <Spinner size={18}/> : <Icon name="plus" size={18} color="rgba(255,255,255,.3)"/>}
//                 </div>
//               ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
// function AuthScreen({ login, toast, toasts, removeToast }) {
//   const [mode, setMode] = useState("login");
//   const [form, setForm] = useState({ email: "", password: "", name: "", country: "" });
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setLoading(true);
//     try {
//       if (mode === "login") {
//         const r = await api.post("/api/auth/login", { email: form.email, password: form.password });
//         login(r);
//       } else {
//         const r = await api.post("/api/auth/register", form);
//         login(r); toast("Welcome to Melodiq!");
//       }
//     } catch (err) { toast(err.message, "error"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div style={{ minHeight: "100dvh", background: "#0a0a0f", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
//       <GlobalStyles/>
//       <Toast toasts={toasts} remove={removeToast}/>
//       <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
//         <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.35) 0%, transparent 70%)", top: "6%", left: "50%", transform: "translateX(-50%)" }}/>
//         <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
//           <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#6d28d9,#a855f7)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 12px 40px rgba(109,40,217,.6)" }}>
//             <Icon name="music" size={32} color="#fff"/>
//           </div>
//           <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#f0eeff", letterSpacing: "-1px" }}>Melodiq</div>
//           <div style={{ fontSize: 14, color: "rgba(255,255,255,.38)", marginTop: 5 }}>Your music, everywhere.</div>
//         </div>
//       </div>
//       <div style={{ position: "relative", background: "rgba(13,10,24,.98)", borderRadius: "24px 24px 0 0", padding: "24px 22px 36px", boxShadow: "0 -6px 40px rgba(0,0,0,.5)" }}>
//         <div style={{ width: 32, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)", margin: "0 auto 22px" }}/>
//         <div style={{ display: "flex", background: "rgba(255,255,255,.04)", borderRadius: 12, padding: 4, marginBottom: 22 }}>
//           {["login","register"].map(m => (
//             <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 9, background: mode === m ? "linear-gradient(135deg,#6d28d9,#a855f7)" : "none", border: "none", cursor: "pointer", color: mode === m ? "#fff" : "rgba(255,255,255,.4)", fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all .2s" }}>
//               {m === "login" ? "Sign In" : "Register"}
//             </button>
//           ))}
//         </div>
//         {mode === "register" && <Field label="Full Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>}
//         <Field label="Email" type="email" value={form.email} onChange={v => setForm(p => ({...p, email: v}))} placeholder="you@example.com"/>
//         <Field label="Password" type="password" value={form.password} onChange={v => setForm(p => ({...p, password: v}))} placeholder="Min 8 characters" onEnter={submit}/>
//         {mode === "register" && <Field label="Country (optional)" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>}
//         <button onClick={submit} disabled={loading} className="tap" style={{ width: "100%", padding: "15px", borderRadius: 12, background: "linear-gradient(135deg,#6d28d9,#a855f7)", border: "none", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px rgba(109,40,217,.45)" }}>
//           {loading ? <Spinner size={20}/> : (mode === "login" ? "Sign In" : "Create Account")}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── MAIN APP ─────────────────────────────────────────────────────────────────
// export default function App() {
//   const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("mp_user") || "null"); } catch { return null; } });
//   const [view, setView] = useState("home");
//   const [currentSong, setCurrentSong] = useState(null);
//   const [queue, setQueue] = useState([]);
//   const [queueIdx, setQueueIdx] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.8);
//   const [muted, setMuted] = useState(false);
//   const [shuffle, setShuffle] = useState(false);
//   const [repeat, setRepeat] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [sleepTimer, setSleepTimer] = useState(null); // { minutes, endsAt }
//   const [playerOpen, setPlayerOpen] = useState(false);
//   const [addToPlaylistSong, setAddToPlaylistSong] = useState(null);
//   const [toasts, setToasts] = useState([]);
//   const audioRef = useRef(null);
//   const toastId = useRef(0);
//   const queueRef = useRef(queue);
//   const queueIdxRef = useRef(queueIdx);
//   const sleepRef = useRef(null);
//   useEffect(() => { queueRef.current = queue; }, [queue]);
//   useEffect(() => { queueIdxRef.current = queueIdx; }, [queueIdx]);

//   const toast = useCallback((msg, type = "success") => {
//     const id = ++toastId.current;
//     setToasts(p => [...p, { id, msg, type }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
//   }, []);

//   const login = (data) => {
//     localStorage.setItem("mp_token", data.accessToken);
//     localStorage.setItem("mp_user", JSON.stringify(data.user));
//     setUser(data.user);
//   };

//   const logout = async () => {
//     try { await api.post("/api/auth/logout"); } catch {}
//     localStorage.removeItem("mp_token"); localStorage.removeItem("mp_user");
//     setUser(null); setCurrentSong(null); setIsPlaying(false);
//   };

//   // Set audio src & play when currentSong changes
//   useEffect(() => {
//     const a = audioRef.current;
//     if (!a || !currentSong) return;
//     if (!currentSong.audioUrl) { toast("No audio URL", "error"); return; }
//     a.src = currentSong.audioUrl;
//     a.volume = muted ? 0 : volume;
//     a.playbackRate = playbackRate;
//     a.play().then(() => setIsPlaying(true)).catch(() => toast("Could not play audio", "error"));
//     api.post(`/api/songs/${currentSong.id}/play`).catch(() => {});
//   }, [currentSong]);

//   useEffect(() => { if (audioRef.current) audioRef.current.volume = muted ? 0 : volume; }, [volume, muted]);
//   useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate; }, [playbackRate]);

//   // Sleep timer
//   useEffect(() => {
//     if (sleepRef.current) clearTimeout(sleepRef.current);
//     if (!sleepTimer) return;
//     const ms = sleepTimer.minutes * 60 * 1000;
//     sleepRef.current = setTimeout(() => {
//       audioRef.current?.pause();
//       setIsPlaying(false);
//       setSleepTimer(null);
//       toast("Sleep timer ended. Good night 🌙");
//     }, ms);
//     return () => clearTimeout(sleepRef.current);
//   }, [sleepTimer]);

//   const playSong = useCallback(async (song, songs = [], idx = 0) => {
//     let s = song;
//     if (!s.audioUrl) {
//       try { const full = await api.get(`/api/songs/${s.id}`); s = full; } catch {}
//     }
//     if (!s.audioUrl) { toast("Audio not available", "error"); return; }
//     setCurrentSong(s);
//     setQueue(songs.length ? songs : [s]);
//     setQueueIdx(idx);
//   }, [toast]);

//   const handleEnded = useCallback(() => {
//     const q = queueRef.current; const idx = queueIdxRef.current;
//     if (repeat) { audioRef.current && (audioRef.current.currentTime = 0) && audioRef.current.play(); return; }
//     const next = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
//     if (next < q.length) { setQueueIdx(next); setCurrentSong(q[next]); }
//     else setIsPlaying(false);
//   }, [repeat, shuffle]);

//   const skipNext = useCallback(() => {
//     const q = queueRef.current; const idx = queueIdxRef.current;
//     const next = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
//     if (next < q.length) { setQueueIdx(next); setCurrentSong(q[next]); }
//   }, [shuffle]);

//   const skipPrev = useCallback(() => {
//     const q = queueRef.current; const idx = queueIdxRef.current;
//     if (audioRef.current?.currentTime > 3) { audioRef.current.currentTime = 0; return; }
//     if (idx > 0) { setQueueIdx(idx - 1); setCurrentSong(q[idx - 1]); }
//   }, []);

//   const seek = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
//     if (audioRef.current && duration) audioRef.current.currentTime = pct * duration;
//   };

//   const handleSleepTimer = (minutes) => {
//     if (!minutes) { setSleepTimer(null); return; }
//     setSleepTimer({ minutes }); toast(`Sleep timer set for ${minutes} min`);
//   };

//   if (!user) return <AuthScreen login={login} toast={toast} toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))}/>;

//   const contentPb = 68 + (currentSong ? 72 : 0) + 8;

//   return (
//     <div style={{ height: "100dvh", background: "#0a0a0f", color: "#f0eeff", fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
//       <GlobalStyles/>
//       <audio
//         ref={audioRef}
//         onTimeUpdate={() => { const a = audioRef.current; if (a) { setProgress(a.currentTime || 0); setDuration(a.duration || 0); } }}
//         onEnded={handleEnded}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//       />
//       <Toast toasts={toasts} remove={id => setToasts(p => p.filter(t => t.id !== id))}/>

//       {playerOpen && currentSong && (
//         <FullPlayer
//           song={currentSong} queue={queue} queueIdx={queueIdx}
//           isPlaying={isPlaying} progress={progress} duration={duration}
//           volume={volume} muted={muted} shuffle={shuffle} repeat={repeat}
//           sleepTimer={sleepTimer} playbackRate={playbackRate}
//           onClose={() => setPlayerOpen(false)}
//           onSeek={seek}
//           onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
//           onNext={skipNext} onPrev={skipPrev}
//           onShuffle={() => setShuffle(s => !s)} onRepeat={() => setRepeat(r => !r)}
//           onVolume={v => { setVolume(v); setMuted(false); }} onMute={() => setMuted(m => !m)}
//           onSleepTimer={handleSleepTimer}
//           onPlaybackRate={r => setPlaybackRate(r)}
//           toast={toast}
//         />
//       )}

//       {addToPlaylistSong && (
//         <AddToPlaylistSheet song={addToPlaylistSong} toast={toast} onClose={() => setAddToPlaylistSong(null)}/>
//       )}

//       <div style={{ flex: 1, overflowY: "auto", paddingBottom: contentPb }}>
//         {view === "home" && <HomeView playSong={playSong} toast={toast} user={user} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
//         {view === "search" && <SearchView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
//         {view === "library" && <LibraryView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>}
//         {view === "liked" && <LikedView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
//         {view === "history" && <HistoryView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>}
//         {view === "profile" && <ProfileView user={user} setUser={u => { setUser(u); localStorage.setItem("mp_user", JSON.stringify(u)); }} toast={toast} logout={logout}/>}
//       </div>

//       {currentSong && !playerOpen && (
//         <MiniPlayer
//           song={currentSong} isPlaying={isPlaying} progress={progress} duration={duration}
//           onExpand={() => setPlayerOpen(true)}
//           onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
//           onNext={skipNext} toast={toast}
//         />
//       )}

//       <BottomNav view={view} setView={setView} sleepTimer={sleepTimer}/>
//     </div>
//   );
// }

// // ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
// function BottomNav({ view, setView, sleepTimer }) {
//   const tabs = [
//     { id: "home", icon: "home", label: "Home" },
//     { id: "search", icon: "search", label: "Search" },
//     { id: "library", icon: "library", label: "Library" },
//     { id: "liked", icon: "heart", label: "Liked" },
//     { id: "history", icon: "clock", label: "History" },
//     { id: "profile", icon: "user", label: "You" },
//   ];
//   return (
//     <div style={{
//       position: "absolute", bottom: 0, left: 0, right: 0, height: 68,
//       background: "rgba(8,8,15,.97)", backdropFilter: "blur(20px)",
//       borderTop: "1px solid rgba(255,255,255,.05)", zIndex: 80,
//       display: "flex", alignItems: "center",
//     }}>
//       {tabs.map(t => {
//         const active = view === t.id;
//         return (
//           <button key={t.id} onClick={() => setView(t.id)} style={{
//             flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//             background: "none", border: "none", cursor: "pointer", gap: 3, padding: "6px 0",
//             color: active ? "#a855f7" : "rgba(255,255,255,.32)", transition: "color .2s",
//           }}>
//             <div style={{
//               width: 34, height: 26, borderRadius: 99,
//               background: active ? "rgba(168,85,247,.15)" : "none",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               transition: "all .2s",
//             }}>
//               <Icon name={t.id === "liked" && active ? "heart_fill" : t.icon} size={19}/>
//             </div>
//             <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{t.label}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// // ─── SECTION ──────────────────────────────────────────────────────────────────
// function Section({ title, children }) {
//   return (
//     <div style={{ marginBottom: 26 }}>
//       <div style={{ padding: "0 16px", marginBottom: 10 }}>
//         <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif", letterSpacing: "-.2px" }}>{title}</h2>
//       </div>
//       {children}
//     </div>
//   );
// }

// // ─── HOME VIEW ────────────────────────────────────────────────────────────────
// function HomeView({ playSong, toast, user, currentSong, isPlaying, onAddToPlaylist }) {
//   const [trending, setTrending] = useState([]);
//   const [latest, setLatest] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [albums, setAlbums] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCat, setSelectedCat] = useState(null);
//   const [catSongs, setCatSongs] = useState([]);
//   const [catLoading, setCatLoading] = useState(false);

//   useEffect(() => {
//     Promise.all([
//       api.get("/api/songs/top?limit=10"),
//       api.get("/api/songs/latest?limit=10"),
//       api.get("/api/categories"),
//       api.get("/api/albums/new-releases"),
//     ]).then(([t, l, c, a]) => {
//       setTrending(Array.isArray(t) ? t : (t?.content || []));
//       setLatest(Array.isArray(l) ? l : (l?.content || []));
//       setCategories(Array.isArray(c) ? c : (c?.content || []));
//       setAlbums(Array.isArray(a) ? a : (a?.content || []));
//     }).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
//   }, []);

//   const pickCategory = async (cat) => {
//     if (selectedCat?.id === cat.id) { setSelectedCat(null); setCatSongs([]); return; }
//     setSelectedCat(cat); setCatLoading(true);
//     try {
//       const r = await api.get(`/api/songs/search?categoryId=${cat.id}&size=20`);
//       setCatSongs(r?.content || (Array.isArray(r) ? r : []));
//     } catch { setCatSongs([]); }
//     finally { setCatLoading(false); }
//   };

//   const hour = new Date().getHours();
//   const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

//   if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><Spinner size={36}/></div>;

//   return (
//     <div className="fade-up">
//       <div style={{ padding: "22px 16px 20px" }}>
//         <div style={{ fontSize: 13, color: "rgba(255,255,255,.38)", fontWeight: 500 }}>{greeting} 👋</div>
//         <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", letterSpacing: "-.4px", marginTop: 2 }}>{user.name.split(" ")[0]}</div>
//         {user.premium && (
//           <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 99, padding: "3px 10px" }}>
//             <Icon name="crown" size={12} color="#fbbf24"/>
//             <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>Premium</span>
//           </div>
//         )}
//       </div>

//       {categories.length > 0 && (
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ padding: "0 16px 10px" }}><h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Browse</h2></div>
//           <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 16px 4px", scrollbarWidth: "none" }}>
//             {categories.map(c => (
//               <button key={c.id} onClick={() => pickCategory(c)} style={{
//                 flexShrink: 0, padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer",
//                 background: selectedCat?.id === c.id ? (c.color || "#a855f7") : `${c.color || "#a855f7"}18`,
//                 color: selectedCat?.id === c.id ? "#fff" : (c.color || "#e9d5ff"),
//                 fontWeight: 600, fontSize: 13, fontFamily: "inherit", transition: "all .18s",
//               }}>
//                 {c.name}
//               </button>
//             ))}
//           </div>
//           {selectedCat && (
//             <div className="fade-in" style={{ marginTop: 10 }}>
//               {catLoading
//                 ? <div style={{ display: "flex", justifyContent: "center", padding: 20 }}><Spinner size={24}/></div>
//                 : catSongs.length === 0
//                   ? <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, padding: "10px 16px" }}>No songs in this category.</p>
//                   : catSongs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={catSongs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)
//               }
//             </div>
//           )}
//         </div>
//       )}

//       {trending.length > 0 && (
//         <Section title="🔥 Trending">
//           {trending.slice(0, 6).map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={trending} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
//         </Section>
//       )}

//       {albums.length > 0 && (
//         <Section title="New Releases">
//           <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 4px", scrollbarWidth: "none" }}>
//             {albums.map(a => (
//               <div key={a.id} style={{ flexShrink: 0, width: 130, cursor: "pointer" }}>
//                 <CoverArt src={a.coverImage} alt={a.title} size={130} radius={12}/>
//                 <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
//                 <div style={{ fontSize: 12, color: "rgba(255,255,255,.38)", marginTop: 2 }}>{a.artist?.name}</div>
//               </div>
//             ))}
//           </div>
//         </Section>
//       )}

//       {latest.length > 0 && (
//         <Section title="Just Added">
//           {latest.slice(0, 8).map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={latest} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
//         </Section>
//       )}
//     </div>
//   );
// }

// // ─── SEARCH VIEW ──────────────────────────────────────────────────────────────
// function SearchView({ playSong, toast, currentSong, isPlaying, onAddToPlaylist }) {
//   const [q, setQ] = useState("");
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const debRef = useRef(null);

//   const search = useCallback(async (query) => {
//     if (!query.trim()) { setResults(null); return; }
//     setLoading(true);
//     try {
//       let songs = [], albums = [];
//       try {
//         const r = await api.get(`/api/search?query=${encodeURIComponent(query)}&size=20`);
//         songs = r?.songs?.content || r?.songs || [];
//         albums = r?.albums?.content || r?.albums || [];
//         if (Array.isArray(r)) songs = r;
//       } catch {
//         const r = await api.get(`/api/songs/search?query=${encodeURIComponent(query)}&size=20`);
//         songs = r?.content || (Array.isArray(r) ? r : []);
//       }
//       setResults({ songs, albums });
//     } catch (err) { toast(err.message, "error"); }
//     finally { setLoading(false); }
//   }, [toast]);

//   useEffect(() => {
//     clearTimeout(debRef.current);
//     debRef.current = setTimeout(() => search(q), 420);
//     return () => clearTimeout(debRef.current);
//   }, [q, search]);

//   return (
//     <div className="fade-up">
//       <div style={{ padding: "20px 16px 12px", position: "sticky", top: 0, background: "#0a0a0f", zIndex: 10 }}>
//         <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: 14 }}>Search</h1>
//         <div style={{ position: "relative" }}>
//           <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }}><Icon name="search" size={17}/></div>
//           <input
//             value={q} onChange={e => setQ(e.target.value)} placeholder="Songs, artists, albums..."
//             style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 12, padding: "12px 14px 12px 42px", color: "#f0eeff", fontSize: 15 }}
//           />
//           {loading && <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)" }}><Spinner size={17}/></div>}
//           {q && !loading && <button onClick={() => setQ("")} className="icon-btn" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, color: "rgba(255,255,255,.35)" }}><Icon name="x" size={13}/></button>}
//         </div>
//       </div>

//       {results && (() => {
//         const songs = results.songs || [], albums = results.albums || [];
//         if (!songs.length && !albums.length) return (
//           <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,.3)" }}>
//             <Icon name="search" size={40}/><p style={{ marginTop: 10, fontSize: 15 }}>No results for "{q}"</p>
//           </div>
//         );
//         return (
//           <>
//             {songs.length > 0 && (
//               <Section title={`Songs (${songs.length})`}>
//                 {songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
//               </Section>
//             )}
//             {albums.length > 0 && (
//               <Section title={`Albums (${albums.length})`}>
//                 <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 4px" }}>
//                   {albums.map(a => (
//                     <div key={a.id} style={{ flexShrink: 0, width: 120 }}>
//                       <CoverArt src={a.coverImage} alt={a.title} size={120} radius={10}/>
//                       <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
//                       <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{a.artist?.name}</div>
//                     </div>
//                   ))}
//                 </div>
//               </Section>
//             )}
//           </>
//         );
//       })()}

//       {!results && !loading && (
//         <div style={{ textAlign: "center", paddingTop: 60, color: "rgba(255,255,255,.25)" }}>
//           <Icon name="mic" size={40}/><p style={{ marginTop: 10, fontSize: 13 }}>Search for your favorite music</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── LIBRARY VIEW ─────────────────────────────────────────────────────────────
// function LibraryView({ playSong, toast, currentSong, isPlaying }) {
//   const [playlists, setPlaylists] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     setLoading(true);
//     try { const r = await api.get("/api/playlists/me?size=50"); setPlaylists(r.content || []); }
//     catch (err) { toast(err.message, "error"); }
//     finally { setLoading(false); }
//   };
//   useEffect(() => { load(); }, []);

//   const create = async () => {
//     if (!newName.trim()) return;
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("data", new Blob([JSON.stringify({ name: newName, isPublic: false })], { type: "application/json" }));
//       const r = await api.postForm("/api/playlists", fd);
//       setPlaylists(p => [r, ...p]); setCreating(false); setNewName(""); toast("Playlist created!");
//     } catch (err) { toast(err.message, "error"); }
//     finally { setSaving(false); }
//   };

//   const del = async (id, e) => {
//     e.stopPropagation();
//     try { await api.delete(`/api/playlists/${id}`); setPlaylists(p => p.filter(pl => pl.id !== id)); toast("Deleted"); }
//     catch (err) { toast(err.message, "error"); }
//   };

//   if (selected) return <PlaylistDetail playlist={selected} back={() => { setSelected(null); load(); }} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>;

//   return (
//     <div className="fade-up">
//       <div style={{ padding: "22px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Library</h1>
//         <button onClick={() => setCreating(c => !c)} className="pill pill-solid tap" style={{ padding: "8px 14px" }}>
//           <Icon name={creating ? "x" : "plus"} size={15}/>{creating ? "Cancel" : "New"}
//         </button>
//       </div>

//       {creating && (
//         <div className="scale-in" style={{ margin: "0 16px 16px", padding: 14, borderRadius: 14, background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.2)" }}>
//           <Field label="Playlist name" value={newName} onChange={setNewName} placeholder="My Playlist"/>
//           <button onClick={create} disabled={saving} className="pill pill-solid tap" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
//             {saving ? <Spinner size={16}/> : "Create"}
//           </button>
//         </div>
//       )}

//       {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div> : (
//         <div style={{ padding: "0 16px" }}>
//           {playlists.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.25)" }}><Icon name="library" size={44}/><p style={{ marginTop: 10 }}>No playlists yet</p></div>}
//           {playlists.map(pl => (
//             <div key={pl.id} onClick={() => setSelected(pl)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.04)", cursor: "pointer" }}>
//               <CoverArt src={pl.coverImage} alt={pl.name} size={52} radius={10}/>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontWeight: 600, fontSize: 14 }}>{pl.name}</div>
//                 <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 2 }}>{pl.totalTracks ?? 0} songs</div>
//               </div>
//               <button onClick={e => del(pl.id, e)} className="icon-btn tap" style={{ width: 32, height: 32, color: "rgba(255,255,255,.25)" }}><Icon name="trash" size={15}/></button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PlaylistDetail({ playlist, back, playSong, toast, currentSong, isPlaying }) {
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQ, setSearchQ] = useState("");
//   const [searchRes, setSearchRes] = useState([]);
//   const [searching, setSearching] = useState(false);

//   useEffect(() => {
//     api.get(`/api/playlists/${playlist.id}`).then(setDetail).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
//   }, [playlist.id]);

//   const doSearch = async () => {
//     if (!searchQ.trim()) return;
//     setSearching(true);
//     try { const r = await api.get(`/api/songs/search?query=${encodeURIComponent(searchQ)}&size=5`); setSearchRes(r?.content || (Array.isArray(r) ? r : [])); }
//     catch (err) { toast(err.message, "error"); }
//     finally { setSearching(false); }
//   };

//   const addSong = async (songId) => {
//     try {
//       await api.post(`/api/playlists/${playlist.id}/songs`, { songId });
//       const r = await api.get(`/api/playlists/${playlist.id}`);
//       setDetail(r); setSearchRes([]); setSearchQ(""); toast("Added!");
//     } catch (err) { toast(err.message, "error"); }
//   };

//   const removeSong = async (songId) => {
//     try {
//       await api.delete(`/api/playlists/${playlist.id}/songs/${songId}`);
//       setDetail(d => ({ ...d, songs: (d.songs || []).filter(s => s.id !== songId) }));
//       toast("Removed");
//     } catch (err) { toast(err.message, "error"); }
//   };

//   const songs = detail?.songs || [];
//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 10px" }}>
//         <button className="icon-btn tap" onClick={back} style={{ width: 38, height: 38, color: "#f0eeff" }}><Icon name="chevron_left" size={22}/></button>
//         <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>{detail?.name || playlist.name}</h1>
//       </div>
//       <div style={{ display: "flex", gap: 16, padding: "8px 16px 18px", alignItems: "center" }}>
//         <CoverArt src={detail?.coverImage} alt={detail?.name} size={76} radius={12}/>
//         <div>
//           <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 4 }}>{songs.length} songs</p>
//           {songs.length > 0 && (
//             <button onClick={() => playSong(songs[0], songs, 0)} className="pill pill-solid tap"><Icon name="play" size={13}/> Play All</button>
//           )}
//         </div>
//       </div>

//       <div style={{ margin: "0 16px 16px", padding: 12, borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
//         <div style={{ display: "flex", gap: 8 }}>
//           <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} placeholder="Search songs to add..." style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "9px 12px", color: "#f0eeff", fontSize: 13 }}/>
//           <button onClick={doSearch} className="pill pill-ghost tap" style={{ padding: "9px 14px" }}>
//             {searching ? <Spinner size={14}/> : <Icon name="search" size={16}/>}
//           </button>
//         </div>
//         {searchRes.map(s => (
//           <div key={s.id} onClick={() => addSong(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
//             <CoverArt src={s.coverImage} alt={s.title} size={36} radius={6}/>
//             <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{s.artist?.name}</div></div>
//             <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>+ Add</span>
//           </div>
//         ))}
//       </div>

//       {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner/></div> : (
//         songs.length === 0
//           ? <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, textAlign: "center", padding: 36 }}>No songs yet.</p>
//           : songs.map((s, i) => (
//             <div key={s.id} className="song-row t" style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", borderRadius: 10, cursor: "pointer" }} onClick={() => playSong(s, songs, i)}>
//               <span style={{ width: 20, textAlign: "center", color: currentSong?.id === s.id ? "#a855f7" : "rgba(255,255,255,.2)", fontSize: 12 }}>{i+1}</span>
//               <CoverArt src={s.coverImage} alt={s.title} size={42} radius={8}/>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ fontWeight: 600, fontSize: 14, color: currentSong?.id === s.id ? "#c084fc" : "#f0eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
//                 <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>{s.artist?.name}</div>
//               </div>
//               <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>{fmtDur(s.durationSeconds)}</span>
//               <button className="icon-btn tap" onClick={e => { e.stopPropagation(); removeSong(s.id); }} style={{ width: 30, height: 30, color: "rgba(255,255,255,.25)" }}><Icon name="x" size={14}/></button>
//             </div>
//           ))
//       )}
//     </div>
//   );
// }

// // ─── LIKED VIEW ───────────────────────────────────────────────────────────────
// function LikedView({ playSong, toast, currentSong, isPlaying, onAddToPlaylist }) {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     api.get("/api/songs/liked?size=100").then(r => setSongs(r?.content || (Array.isArray(r) ? r : []))).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
//   }, []);
//   return (
//     <div className="fade-up">
//       <div style={{ padding: "22px 16px 14px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
//           <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#be185d,#f43f5e)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Icon name="heart_fill" size={24} color="#fff"/>
//           </div>
//           <div>
//             <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Liked Songs</h1>
//             <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>{songs.length} songs</p>
//           </div>
//         </div>
//         {songs.length > 0 && <button onClick={() => playSong(songs[0], songs, 0)} className="pill pill-solid tap"><Icon name="play" size={13}/> Play All</button>}
//       </div>
//       {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div> : (
//         songs.length === 0
//           ? <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.25)" }}><Icon name="heart" size={44}/><p style={{ marginTop: 10 }}>No liked songs yet</p></div>
//           : songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)
//       )}
//     </div>
//   );
// }

// // ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
// function HistoryView({ playSong, toast, currentSong, isPlaying }) {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/api/history?size=50")
//       .then(r => setHistory(r?.content || (Array.isArray(r) ? r : [])))
//       .catch(err => toast(err.message, "error"))
//       .finally(() => setLoading(false));
//   }, []);

//   const clear = async () => {
//     try { await api.delete("/api/history"); setHistory([]); toast("History cleared"); }
//     catch (err) { toast(err.message, "error"); }
//   };

//   const songs = history.map(h => h.song || h).filter(Boolean);

//   return (
//     <div className="fade-up">
//       <div style={{ padding: "22px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{ width: 46, height: 46, background: "rgba(96,165,250,.12)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Icon name="clock" size={22} color="#60a5fa"/>
//           </div>
//           <div>
//             <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>History</h1>
//             <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>{songs.length} played</p>
//           </div>
//         </div>
//         {songs.length > 0 && (
//           <button onClick={clear} className="pill pill-ghost tap" style={{ padding: "7px 14px" }}>
//             <Icon name="trash" size={14}/> Clear
//           </button>
//         )}
//       </div>
//       {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div> : (
//         songs.length === 0
//           ? <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.25)" }}><Icon name="clock" size={44}/><p style={{ marginTop: 10 }}>Nothing played yet</p></div>
//           : songs.map((s, i) => <SongRow key={`${s.id}-${i}`} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>)
//       )}
//     </div>
//   );
// }

// // ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
// function ProfileView({ user, setUser, toast, logout }) {
//   const [tab, setTab] = useState("account");
//   const [form, setForm] = useState({ name: user.name || "", bio: user.bio || "", country: user.country || "" });
//   const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
//   const [saving, setSaving] = useState(false);
//   const [pwSaving, setPwSaving] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imgPreview, setImgPreview] = useState(user.profileImage || null);
//   const fileRef = useRef(null);

//   const handleImg = (e) => {
//     const file = e.target.files[0]; if (!file) return;
//     setImageFile(file);
//     const r = new FileReader();
//     r.onload = ev => setImgPreview(ev.target.result);
//     r.readAsDataURL(file);
//   };

//   const saveProfile = async () => {
//     setSaving(true);
//     try {
//       let r;
//       if (imageFile) {
//         const fd = new FormData();
//         fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
//         fd.append("image", imageFile);
//         r = await api.putForm("/api/users/me", fd);
//       } else { r = await api.put("/api/users/me", form); }
//       setUser(r); toast("Profile updated!");
//     } catch (err) { toast(err.message, "error"); }
//     finally { setSaving(false); }
//   };

//   const changePw = async () => {
//     if (!pwForm.currentPassword || !pwForm.newPassword) { toast("All fields required", "warning"); return; }
//     if (pwForm.newPassword !== pwForm.confirmPassword) { toast("Passwords don't match", "warning"); return; }
//     if (pwForm.newPassword.length < 8) { toast("Min 8 characters", "warning"); return; }
//     setPwSaving(true);
//     try {
//       await api.post("/api/auth/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
//       toast("Password updated!"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) { toast(err.message, "error"); }
//     finally { setPwSaving(false); }
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ padding: "22px 16px 16px", display: "flex", alignItems: "center", gap: 16 }}>
//         <div style={{ position: "relative" }}>
//           <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#6d28d9,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid rgba(168,85,247,.25)" }}>
//             {imgPreview ? <img src={imgPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="user" size={28} color="#fff"/>}
//           </div>
//           <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "#7c3aed", border: "2px solid #0a0a0f", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Icon name="edit" size={10} color="#fff"/>
//           </button>
//           <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }}/>
//         </div>
//         <div>
//           <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>{user.name}</div>
//           <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{user.email}</div>
//           <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
//             <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: user.role === "ADMIN" ? "rgba(251,191,36,.12)" : "rgba(168,85,247,.12)", color: user.role === "ADMIN" ? "#fbbf24" : "#c084fc", fontWeight: 700 }}>{user.role}</span>
//             {user.premium && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "rgba(251,191,36,.12)", color: "#fbbf24", fontWeight: 700 }}>✦ Premium</span>}
//           </div>
//         </div>
//       </div>

//       <div style={{ display: "flex", padding: "0 16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
//         {["account","security","subscription"].map(t => (
//           <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", border: "none", cursor: "pointer", background: "none", color: tab === t ? "#c084fc" : "rgba(255,255,255,.38)", fontWeight: tab === t ? 700 : 500, fontSize: 13, fontFamily: "inherit", borderBottom: tab === t ? "2px solid #a855f7" : "2px solid transparent", transition: "all .18s" }}>
//             {t.charAt(0).toUpperCase() + t.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div style={{ padding: "20px 16px 24px" }}>
//         {tab === "account" && (
//           <>
//             <Field label="Display Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.4)", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>Bio</label>
//               <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} placeholder="About you..." rows={3} style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 10, padding: "12px 14px", color: "#f0eeff", fontSize: 14, fontFamily: "inherit", resize: "none" }}/>
//             </div>
//             <Field label="Country" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>
//             <button onClick={saveProfile} disabled={saving} className="pill pill-solid tap" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
//               {saving ? <Spinner size={17}/> : <><Icon name="check" size={15}/> Save</>}
//             </button>
//           </>
//         )}

//         {tab === "security" && (
//           <div className="card" style={{ padding: 16 }}>
//             <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Change Password</div>
//             <Field label="Current Password" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(p => ({...p, currentPassword: v}))} placeholder="Current password"/>
//             <Field label="New Password" type="password" value={pwForm.newPassword} onChange={v => setPwForm(p => ({...p, newPassword: v}))} placeholder="New password"/>
//             <Field label="Confirm" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(p => ({...p, confirmPassword: v}))} placeholder="Repeat"/>
//             <button onClick={changePw} disabled={pwSaving} className="pill pill-solid tap" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
//               {pwSaving ? <Spinner size={17}/> : <><Icon name="shield" size={15}/> Update Password</>}
//             </button>
//           </div>
//         )}

//         {tab === "subscription" && <SubTab user={user} toast={toast}/>}
//       </div>

//       <div style={{ padding: "0 16px 28px" }}>
//         <button onClick={logout} className="pill pill-danger tap" style={{ width: "100%", justifyContent: "center", padding: "13px", borderRadius: 12 }}>
//           <Icon name="logout" size={17}/> Log Out
//         </button>
//       </div>
//     </div>
//   );
// }

// function SubTab({ user, toast }) {
//   return (
//     <div>
//       <div className="card" style={{ padding: 18, marginBottom: 14, background: user.premium ? "rgba(251,191,36,.06)" : "rgba(255,255,255,.03)", border: user.premium ? "1px solid rgba(251,191,36,.2)" : "1px solid rgba(255,255,255,.07)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
//           <div style={{ width: 44, height: 44, borderRadius: 12, background: user.premium ? "linear-gradient(135deg,#d97706,#fbbf24)" : "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Icon name="crown" size={20} color={user.premium ? "#fff" : "rgba(255,255,255,.4)"}/>
//           </div>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>{user.premium ? "Premium" : "Free Plan"}</div>
//             <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>{user.premium ? "Unlimited music" : "Upgrade for full access"}</div>
//           </div>
//         </div>
//         {["Ad-free listening", "High quality audio", "Offline downloads", "Exclusive tracks"].map(f => (
//           <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 7, color: user.premium ? "#fbbf24" : "rgba(255,255,255,.3)" }}>
//             <Icon name="check" size={13}/><span style={{ color: user.premium ? "#f0eeff" : "rgba(255,255,255,.4)" }}>{f}</span>
//           </div>
//         ))}
//         {!user.premium && (
//           <button onClick={() => toast("Contact admin to upgrade", "warning")} className="pill pill-solid tap" style={{ marginTop: 10, width: "100%", justifyContent: "center", padding: "12px", background: "linear-gradient(135deg,#d97706,#fbbf24)", boxShadow: "0 6px 20px rgba(217,119,6,.3)" }}>
//             <Icon name="crown" size={15}/> Upgrade to Premium
//           </button>
//         )}
//       </div>
//       <div className="card" style={{ padding: 16 }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//           <thead>
//             <tr>
//               <th style={{ textAlign: "left", padding: "5px 0", color: "rgba(255,255,255,.35)", fontWeight: 600 }}>Feature</th>
//               <th style={{ textAlign: "center", color: "rgba(255,255,255,.35)", fontWeight: 600 }}>Free</th>
//               <th style={{ textAlign: "center", color: "#fbbf24", fontWeight: 600 }}>Premium</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[["Ad-free","✗","✓"],["Unlimited skips","✗","✓"],["Hi-fi audio","✗","✓"],["Downloads","✗","✓"],["Exclusives","✗","✓"]].map(([feat, f, p]) => (
//               <tr key={feat} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
//                 <td style={{ padding: "8px 0" }}>{feat}</td>
//                 <td style={{ textAlign: "center", color: f === "✓" ? "#34d399" : "#ef4444" }}>{f}</td>
//                 <td style={{ textAlign: "center", color: p === "✓" ? "#fbbf24" : "#ef4444" }}>{p}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>


//   );
// }







import { useState, useEffect, useRef, useCallback } from "react";

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

const fmtDur = (s) => {
  if (!s && s !== 0) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const fmtTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
};

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg0: "#04040c",
  bg1: "#0a0818",
  bg2: "#110e20",
  bg3: "#1a1630",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.14)",
  text: "#f0ecff",
  textSub: "rgba(255,255,255,0.52)",
  textMute: "rgba(255,255,255,0.28)",
  accent: "#7c3aed",
  accentLt: "#c4b5fd",
  accentDk: "#5b21b6",
  accentGlow: "rgba(124,58,237,0.4)",
  rose: "#f43f5e",
  roseLt: "#fda4af",
  amber: "#f59e0b",
  amberLt: "#fcd34d",
  teal: "#14b8a6",
  tealLt: "#5eead4",
  indigo: "#6366f1",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body, #root { height: 100%; overflow: hidden; }
    body { font-family: 'Inter', sans-serif; background: ${T.bg0}; color: ${T.text}; overscroll-behavior: none; }
    ::-webkit-scrollbar { display: none; }
    input, select, textarea { outline: none !important; font-family: inherit; }
    button { font-family: inherit; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes slideDown { from { transform:translateY(-8px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    @keyframes scaleIn { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes barsAnim {
      0%, 100% { height: 4px; }
      25% { height: 12px; }
      50% { height: 7px; }
      75% { height: 15px; }
    }
    @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 30px rgba(124,58,237,.3); } 50% { box-shadow: 0 0 70px rgba(124,58,237,.65); } }
    @keyframes nowPlayingPulse { 0%,100% { opacity:.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }

    .range-track {
      -webkit-appearance: none; appearance: none;
      height: 3px; border-radius: 99px; cursor: pointer;
      background: rgba(255,255,255,.1);
    }
    .range-track::-webkit-slider-thumb {
      -webkit-appearance: none; width: 14px; height: 14px;
      border-radius: 50%; background: #fff; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.6);
      transition: transform .15s;
    }
    .range-track:hover::-webkit-slider-thumb { transform: scale(1.2); }

    .t { transition: all .18s ease; }
    .tap:active { transform: scale(.92) !important; }

    .song-row { transition: background .15s; border-radius: 14px; }
    .song-row:hover { background: rgba(255,255,255,.04); }
    .song-row:active { background: rgba(255,255,255,.08); }

    .slide-up { animation: slideUp .34s cubic-bezier(.22,1,.36,1); }
    .fade-up { animation: fadeUp .32s cubic-bezier(.22,1,.36,1); }
    .fade-in { animation: fadeIn .2s ease; }
    .scale-in { animation: scaleIn .2s ease; }

    .playing-bars { display: flex; align-items: flex-end; gap: 2px; height: 18px; }
    .playing-bars span {
      width: 3px; border-radius: 2px; background: ${T.accentLt};
      animation: barsAnim .85s ease-in-out infinite;
    }
    .playing-bars span:nth-child(2) { animation-delay: .18s; }
    .playing-bars span:nth-child(3) { animation-delay: .36s; }

    .icon-btn {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; transition: all .15s;
    }
    .icon-btn:hover { background: rgba(255,255,255,.08); }
    .icon-btn:active { background: rgba(255,255,255,.14); transform: scale(.88); }

    .card {
      background: ${T.surface};
      border: 1px solid ${T.border};
      border-radius: 18px;
    }

    .glass {
      background: rgba(10,8,24,.92);
      backdrop-filter: blur(32px) saturate(1.5);
      -webkit-backdrop-filter: blur(32px) saturate(1.5);
      border: 1px solid rgba(255,255,255,.08);
    }

    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 99px; border: none; cursor: pointer;
      font-size: 13px; font-weight: 600; font-family: inherit;
      transition: all .15s; white-space: nowrap;
    }
    .pill:active { transform: scale(.94); }
    .pill-solid {
      background: linear-gradient(135deg, ${T.accentDk}, ${T.accent});
      color: #fff;
      box-shadow: 0 4px 20px ${T.accentGlow};
    }
    .pill-solid:hover { box-shadow: 0 6px 28px rgba(124,58,237,.55); }
    .pill-ghost { background: rgba(255,255,255,.06); color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.1); }
    .pill-ghost:hover { background: rgba(255,255,255,.1); }
    .pill-rose { background: rgba(244,63,94,.12); color: ${T.rose}; border: 1px solid rgba(244,63,94,.2); }
    .pill-teal { background: rgba(20,184,166,.12); color: ${T.teal}; border: 1px solid rgba(20,184,166,.2); }
    .pill-danger { background: rgba(239,68,68,.1); color: #ef4444; border: 1px solid rgba(239,68,68,.15); }

    .tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer; gap: 3px; padding: 6px 0;
      color: ${T.textMute}; transition: color .2s;
    }
    .tab-btn.active { color: ${T.accent}; }

    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,.02) 25%, rgba(255,255,255,.07) 50%, rgba(255,255,255,.02) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .glow-ring { animation: glow 3s ease-in-out infinite; }

    .progress-bar {
      height: 100%; border-radius: 99px;
      transition: width .15s linear;
    }

    .context-menu {
      position: fixed; z-index: 600;
      background: rgba(14,10,28,.97);
      backdrop-filter: blur(28px);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 18px;
      padding: 8px;
      min-width: 210px;
      box-shadow: 0 24px 64px rgba(0,0,0,.75);
      animation: scaleIn .15s ease;
    }
    .context-item {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 13px; border-radius: 11px;
      font-size: 14px; color: ${T.text};
      cursor: pointer; transition: background .12s;
      border: none; background: none; width: 100%; text-align: left; font-family: inherit;
    }
    .context-item:hover { background: rgba(255,255,255,.07); }
    .context-item.danger { color: #ef4444; }

    /* Queue track row */
    .queue-row { transition: background .15s; border-radius: 12px; cursor: pointer; }
    .queue-row:hover { background: rgba(255,255,255,.05); }
    .queue-row.active { background: rgba(124,58,237,.12); }

    /* Home hero card */
    .hero-card {
      position: relative; overflow: hidden; border-radius: 20px;
      cursor: pointer; transition: transform .2s;
    }
    .hero-card:active { transform: scale(.97); }

    .bottom-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 8px); }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "", color, style: extStyle }) => {
  const icons = {
    play: <polygon points="5,3 19,12 5,21" fill="currentColor"/>,
    pause: <><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></>,
    skip_next: <><polygon points="5,4 15,12 5,20" fill="currentColor"/><rect x="17" y="4" width="2" height="16" fill="currentColor"/></>,
    skip_prev: <><polygon points="19,4 9,12 19,20" fill="currentColor"/><rect x="5" y="4" width="2" height="16" fill="currentColor"/></>,
    shuffle: <><polyline points="16,3 21,3 21,8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/><polyline points="21,16 21,21 16,21" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="4" y1="4" x2="9" y2="9" stroke="currentColor" strokeWidth="2"/></>,
    repeat: <><polyline points="17,1 21,5 17,9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="7,23 3,19 7,15" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    repeat1: <><polyline points="17,1 21,5 17,9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="7,23 3,19 7,15" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" fill="none"/><text x="12" y="14" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">1</text></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none"/>,
    heart_fill: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>,
    volume: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    volume2: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    volume_mute: <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2"/></>,
    search: <><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></>,
    music: <><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/></>,
    history: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    crown: <><path d="M2 20h20l-3-9-5 5-2-8-2 8-5-5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    trash: <><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    check: <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>,
    lyrics: <><line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    queue: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="3"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="3"/></>,
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/></>,
    sleep: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none"/>,
    equalizer: <><line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="2"/></>,
    share: <><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/></>,
    add_playlist: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="16" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="19" y1="2" x2="19" y2="8" stroke="currentColor" strokeWidth="2"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>,
    chevron_down: <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" fill="none"/>,
    chevron_left: <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" fill="none"/>,
    chevron_right: <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" fill="none"/>,
    more: <><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></>,
    sort: <><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="18" x2="9" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" rx="1"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/></>,
    clock: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    trending: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    album: <><rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    fire: <path d="M12 2s4.5 5.5 1.5 9.5c2.5-1 4-3.5 3-6 2.5 2.5 3 7 0 10-1.5 1.5-3.5 2.5-4.5 2.5S8 17 7 15.5C5 12 7.5 8 9 6.5c-.5 2 0 4 1 5.5C10.5 8 12 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" fill="none"/>,
    sparkle: <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    radio: <><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M7.76 7.76a6 6 0 0 0 0 8.49" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ flexShrink: 0, color, ...extStyle }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Spinner = ({ size = 24 }) => (
  <div style={{ width: size, height: size, border: `2px solid rgba(255,255,255,.08)`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }}/>
);

const CoverArt = ({ src, alt, size = 48, radius = 10 }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: "hidden", background: `linear-gradient(135deg,${T.bg3},#2a1a4a)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {src
      ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
      : <Icon name="music" size={Math.round(size * 0.36)} color="rgba(255,255,255,.18)"/>}
  </div>
);

const Toast = ({ toasts, remove }) => (
  <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
    {toasts.map(t => (
      <div key={t.id} className="scale-in" style={{
        background: t.type === "error" ? "rgba(185,28,28,.97)" : t.type === "warning" ? "rgba(180,83,9,.97)" : "rgba(6,95,70,.97)",
        color: "#fff", padding: "12px 16px", borderRadius: 14, fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 10, pointerEvents: "all",
        border: "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
      }}>
        <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
        <button onClick={() => remove(t.id)} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", cursor: "pointer", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={11}/>
        </button>
      </div>
    ))}
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = "text", onEnter }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textMute, marginBottom: 6, letterSpacing: ".07em", textTransform: "uppercase" }}>{label}</label>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} onKeyDown={e => e.key === "Enter" && onEnter?.()}
      style={{ width: "100%", background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", color: T.text, fontSize: 15, transition: "border .15s" }}
      onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  </div>
);

// ─── LIKE BUTTON ─────────────────────────────────────────────────────────────
function LikeBtn({ songId, liked: init, toast, size = 20 }) {
  const [liked, setLiked] = useState(init);
  const [anim, setAnim] = useState(false);
  const toggle = async (e) => {
    e.stopPropagation();
    setAnim(true);
    setTimeout(() => setAnim(false), 400);
    try { const r = await api.post(`/api/songs/${songId}/like`); setLiked(r.liked); }
    catch (err) { toast(err.message, "error"); }
  };
  return (
    <button className="icon-btn" onClick={toggle} style={{
      width: size + 16, height: size + 16,
      color: liked ? T.rose : "rgba(255,255,255,.3)",
      transform: anim ? "scale(1.35)" : "scale(1)",
      transition: "color .2s, transform .2s cubic-bezier(.34,1.56,.64,1)",
    }}>
      <Icon name={liked ? "heart_fill" : "heart"} size={size}/>
    </button>
  );
}

// ─── SONG ROW ─────────────────────────────────────────────────────────────────
function SongRow({ song, idx, songs, playSong, toast, currentSong, isPlaying, onAddToPlaylist, onRemove, showDate }) {
  const isActive = currentSong?.id === song.id;
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showMenu]);

  const openMenu = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ x: Math.min(rect.right, window.innerWidth - 220), y: rect.bottom + 4 });
    setShowMenu(true);
  };

  return (
    <>
      <div
        className="song-row"
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", cursor: "pointer", position: "relative" }}
        onClick={() => playSong(song, songs, idx)}
      >
        <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isActive && isPlaying
            ? <div className="playing-bars"><span/><span/><span/></div>
            : <span style={{ fontSize: 13, color: isActive ? T.accent : T.textMute, fontWeight: isActive ? 700 : 400 }}>{idx + 1}</span>
          }
        </div>
        <CoverArt src={song.coverImage} alt={song.title} size={44} radius={8}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: isActive ? T.accentLt : T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</span>
            {song.premium && <span style={{ fontSize: 9, background: "rgba(245,158,11,.15)", color: T.amber, padding: "2px 5px", borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>PRO</span>}
            {showDate && song.playedAt && <span style={{ fontSize: 10, color: T.textMute, flexShrink: 0 }}>{fmtTimeAgo(song.playedAt)}</span>}
          </div>
        </div>
        <span style={{ fontSize: 12, color: T.textMute, flexShrink: 0 }}>{fmtDur(song.durationSeconds)}</span>
        <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={16}/>
        <button className="icon-btn" onClick={openMenu} style={{ width: 30, height: 30, color: T.textMute, flexShrink: 0 }}>
          <Icon name="more" size={16}/>
        </button>
      </div>
      {showMenu && (
        <div ref={menuRef} className="context-menu" style={{ top: menuPos.y, left: menuPos.x }}>
          <button className="context-item" onClick={() => { playSong(song, songs, idx); setShowMenu(false); }}>
            <Icon name="play" size={16} color={T.accent}/> Play now
          </button>
          {onAddToPlaylist && (
            <button className="context-item" onClick={() => { onAddToPlaylist(song); setShowMenu(false); }}>
              <Icon name="add_playlist" size={16} color={T.teal}/> Add to playlist
            </button>
          )}
          <button className="context-item" onClick={() => { toast("Added to queue"); setShowMenu(false); }}>
            <Icon name="queue" size={16} color={T.textSub}/> Add to queue
          </button>
          {onRemove && (
            <button className="context-item danger" onClick={() => { onRemove(song.id); setShowMenu(false); }}>
              <Icon name="trash" size={16}/> Remove
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── MINI PLAYER ─────────────────────────────────────────────────────────────
function MiniPlayer({ song, isPlaying, progress, duration, onExpand, onPlay, onNext, toast }) {
  const pct = duration ? (progress / duration) * 100 : 0;
  return (
    <div className="glass" style={{
      position: "absolute", bottom: 68, left: 10, right: 10, borderRadius: 18, overflow: "hidden", zIndex: 90,
    }}>
      <div style={{ height: 2, background: "rgba(255,255,255,.07)" }}>
        <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${T.accentDk},${T.accentLt})` }}/>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 12 }}>
        <div style={{ cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }} onClick={onExpand}>
          <div style={{ position: "relative" }}>
            <CoverArt src={song.coverImage} alt={song.title} size={42} radius={9}/>
            {isPlaying && <div style={{ position: "absolute", inset: 0, borderRadius: 9, border: `1.5px solid ${T.accent}`, opacity: 0.6 }}/>}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
            <div style={{ fontSize: 12, color: T.textSub, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.artist?.name || "Unknown"}</div>
          </div>
        </div>
        <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={17}/>
        <button className="icon-btn tap" onClick={onPlay} style={{ width: 40, height: 40, background: `linear-gradient(135deg,${T.accentDk},${T.accent})`, color: "#fff", borderRadius: "50%", boxShadow: `0 4px 16px ${T.accentGlow}` }}>
          <Icon name={isPlaying ? "pause" : "play"} size={17}/>
        </button>
        <button className="icon-btn tap" onClick={onNext} style={{ width: 34, height: 34, color: T.textSub }}>
          <Icon name="skip_next" size={21}/>
        </button>
      </div>
    </div>
  );
}

// ─── QUEUE PANEL (improved with cover art + rich info) ────────────────────────
function QueuePanel({ queue, queueIdx, playSong, onClose }) {
  const listRef = useRef(null);

  useEffect(() => {
    // Scroll active item into view
    if (listRef.current) {
      const active = listRef.current.querySelector(".queue-row.active");
      if (active) active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [queueIdx]);

  return (
    <div className="fade-in" style={{
      margin: "0 14px 12px",
      background: "rgba(255,255,255,.03)",
      borderRadius: 18,
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      maxHeight: 260,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="queue" size={14} color={T.accentLt}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: ".1em", textTransform: "uppercase" }}>Queue</span>
          <span style={{ fontSize: 11, color: T.textMute, background: "rgba(255,255,255,.07)", padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>{queue.length}</span>
        </div>
        <span style={{ fontSize: 11, color: T.textMute }}>{queueIdx + 1} / {queue.length}</span>
      </div>

      {/* Scrollable track list */}
      <div ref={listRef} style={{ overflowY: "auto", flex: 1 }}>
        {queue.map((s, i) => {
          const isActive = i === queueIdx;
          const isBefore = i < queueIdx;
          return (
            <div
              key={`q-${s.id}-${i}`}
              className={`queue-row${isActive ? " active" : ""}`}
              onClick={() => playSong(s, queue, i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "9px 14px",
                opacity: isBefore ? 0.42 : 1,
              }}
            >
              {/* Position / playing indicator */}
              <div style={{ width: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isActive ? (
                  <div className="playing-bars" style={{ height: 16 }}>
                    <span style={{ background: T.accentLt }}/>
                    <span style={{ background: T.accentLt }}/>
                    <span style={{ background: T.accentLt }}/>
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: T.textMute, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                )}
              </div>

              {/* Cover art */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <CoverArt src={s.coverImage} alt={s.title} size={40} radius={8}/>
                {isActive && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: `1.5px solid ${T.accentLt}`, opacity: 0.7 }}/>
                )}
              </div>

              {/* Title + Artist */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? T.accentLt : T.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{s.title}</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.artist?.name || "Unknown"}
                </div>
              </div>

              {/* Duration */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {s.premium && (
                  <span style={{ fontSize: 9, background: "rgba(245,158,11,.15)", color: T.amber, padding: "2px 5px", borderRadius: 4, fontWeight: 700 }}>PRO</span>
                )}
                <span style={{ fontSize: 11, color: T.textMute, fontVariantNumeric: "tabular-nums" }}>{fmtDur(s.durationSeconds)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FULL PLAYER ─────────────────────────────────────────────────────────────
function FullPlayer({
  song, queue, queueIdx, isPlaying, progress, duration, volume, muted,
  shuffle, repeat, sleepTimer, playbackRate,
  onClose, onSeek, onPlay, onNext, onPrev, onShuffle, onRepeat,
  onVolume, onMute, onSleepTimer, onPlaybackRate, playSong, toast
}) {
  const [tab, setTab] = useState(null);
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const progressPct = duration ? (progress / duration) * 100 : 0;
  const barRef = useRef(null);

  useEffect(() => {
    if (tab !== "lyrics" || !song?.id) return;
    setLyricsLoading(true);
    api.get(`/api/songs/${song.id}/lyrics`)
      .then(r => setLyrics(r?.lyrics || r?.content || (typeof r === "string" ? r : null)))
      .catch(() => setLyrics(null))
      .finally(() => setLyricsLoading(false));
  }, [tab, song?.id]);

  const handleSeekBar = (e) => {
    const bar = barRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek({ _pct: pct });
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const sleepOptions = [5, 10, 15, 30, 45, 60];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", background: T.bg0, overflow: "hidden" }} className="slide-up">
      {song.coverImage && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${song.coverImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(80px) saturate(2) brightness(.16)",
          transform: "scale(1.15)",
        }}/>
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(4,4,12,.5) 0%, rgba(4,4,12,.8) 50%, rgba(4,4,12,.97) 100%)` }}/>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0" }}>
          <button className="icon-btn tap" onClick={onClose} style={{ width: 40, height: 40, color: T.textSub, background: "rgba(255,255,255,.07)", borderRadius: 12 }}>
            <Icon name="chevron_down" size={20}/>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: ".12em", textTransform: "uppercase" }}>Now Playing</div>
            {queue.length > 1 && <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{queueIdx + 1} of {queue.length}</div>}
          </div>
          <button className="icon-btn" style={{ width: 40, height: 40, color: T.textSub }}>
            <Icon name="share" size={18}/>
          </button>
        </div>

        {/* Cover Art */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 52px 8px" }}>
          <div className={isPlaying ? "glow-ring" : ""} style={{
            width: "min(72vw,280px)", height: "min(72vw,280px)",
            borderRadius: 22,
            boxShadow: isPlaying ? `0 0 80px ${T.accentGlow}, 0 24px 64px rgba(0,0,0,.7)` : "0 20px 56px rgba(0,0,0,.65)",
            transform: isPlaying ? "scale(1.04)" : "scale(0.96)",
            transition: "transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .6s",
            overflow: "hidden",
          }}>
            {song.coverImage
              ? <img src={song.coverImage} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${T.bg3},#2a1a4a)` }}>
                  <Icon name="music" size={80} color="rgba(255,255,255,.15)"/>
                </div>
            }
          </div>
        </div>

        {/* Info + Like */}
        <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 800, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-.3px" }}>{song.title}</div>
            <div style={{ fontSize: 14, color: T.textSub, marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{song.artist?.name || "Unknown"}</span>
              {song.premium && <span style={{ fontSize: 9, background: "rgba(245,158,11,.15)", color: T.amber, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>PRO</span>}
            </div>
          </div>
          <LikeBtn songId={song.id} liked={song.liked} toast={toast} size={23}/>
        </div>

        {/* Progress */}
        <div style={{ padding: "16px 24px 6px" }}>
          <div ref={barRef} onClick={handleSeekBar} onTouchStart={handleSeekBar}
            style={{ height: 4, background: "rgba(255,255,255,.1)", borderRadius: 99, cursor: "pointer", position: "relative" }}>
            <div className="progress-bar" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg,${T.accentDk},${T.accentLt})` }}/>
            <div style={{ position: "absolute", top: "50%", left: `${progressPct}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.5)", transition: "left .15s linear" }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textMute, marginTop: 8, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
            <span>{fmtDur(Math.floor(progress))}</span>
            <span>{fmtDur(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 26px" }}>
          <button className="icon-btn tap" onClick={onShuffle} style={{ width: 44, height: 44, color: shuffle ? T.accentLt : T.textMute }}>
            <Icon name="shuffle" size={20}/>
          </button>
          <button className="icon-btn tap" onClick={onPrev} style={{ width: 52, height: 52, color: T.text }}>
            <Icon name="skip_prev" size={30}/>
          </button>
          <button onClick={onPlay} className="tap" style={{
            width: 70, height: 70, borderRadius: "50%",
            background: `linear-gradient(135deg,${T.accentDk},${T.accent})`,
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 10px 32px ${T.accentGlow}`, transition: "all .15s",
          }}>
            <Icon name={isPlaying ? "pause" : "play"} size={29}/>
          </button>
          <button className="icon-btn tap" onClick={onNext} style={{ width: 52, height: 52, color: T.text }}>
            <Icon name="skip_next" size={30}/>
          </button>
          <button className="icon-btn tap" onClick={onRepeat} style={{ width: 44, height: 44, color: repeat ? T.accentLt : T.textMute, position: "relative" }}>
            <Icon name={repeat === "one" ? "repeat1" : "repeat"} size={20}/>
            {repeat === "one" && <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.accentLt }}/>}
          </button>
        </div>

        {/* Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 28px 8px" }}>
          <button className="icon-btn" onClick={onMute} style={{ color: T.textMute, width: 30, height: 30 }}>
            <Icon name={muted ? "volume_mute" : volume > 0.5 ? "volume" : "volume2"} size={17}/>
          </button>
          <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume}
            onChange={e => onVolume(+e.target.value)}
            className="range-track" style={{ flex: 1, accentColor: T.accent }}/>
          <Icon name="volume" size={17} color={T.textMute}/>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, padding: "2px 16px 12px" }}>
          {[
            { id: "lyrics", icon: "lyrics", label: "Lyrics" },
            { id: "queue", icon: "queue", label: `Queue ${queue.length > 0 ? `(${queue.length})` : ""}` },
            { id: "settings", icon: "equalizer", label: "Options" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(v => v === t.id ? null : t.id)} className="pill t"
              style={{
                padding: "7px 14px",
                background: tab === t.id ? `rgba(124,58,237,.18)` : "rgba(255,255,255,.05)",
                color: tab === t.id ? T.accentLt : T.textSub,
                border: `1px solid ${tab === t.id ? "rgba(124,58,237,.35)" : T.border}`,
              }}>
              <Icon name={t.icon} size={13}/>{t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === "lyrics" && (
          <div className="fade-in" style={{ margin: "0 14px 12px", background: "rgba(255,255,255,.04)", borderRadius: 16, padding: 16, maxHeight: 168, overflowY: "auto", border: `1px solid ${T.border}` }}>
            {lyricsLoading
              ? <div style={{ display: "flex", justifyContent: "center" }}><Spinner/></div>
              : lyrics
                ? <pre style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.95, color: "rgba(255,255,255,.8)", whiteSpace: "pre-wrap", textAlign: "center" }}>{lyrics}</pre>
                : <p style={{ color: T.textMute, fontSize: 13, textAlign: "center" }}>No lyrics available</p>
            }
          </div>
        )}

        {tab === "queue" && (
          <QueuePanel queue={queue} queueIdx={queueIdx} playSong={playSong}/>
        )}

        {tab === "settings" && (
          <div className="fade-in" style={{ margin: "0 14px 12px", background: "rgba(255,255,255,.03)", borderRadius: 16, padding: 14, border: `1px solid ${T.border}` }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMute, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Playback Speed</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {speeds.map(s => (
                  <button key={s} onClick={() => onPlaybackRate(s)} className="pill t" style={{
                    padding: "5px 12px", fontSize: 12,
                    background: playbackRate === s ? "rgba(124,58,237,.2)" : "rgba(255,255,255,.05)",
                    color: playbackRate === s ? T.accentLt : T.textSub,
                    border: `1px solid ${playbackRate === s ? "rgba(124,58,237,.35)" : "transparent"}`,
                  }}>{s}x</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMute, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Sleep Timer</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sleepOptions.map(m => (
                  <button key={m} onClick={() => onSleepTimer(m)} className="pill t" style={{
                    padding: "5px 12px", fontSize: 12,
                    background: sleepTimer?.minutes === m ? "rgba(20,184,166,.15)" : "rgba(255,255,255,.05)",
                    color: sleepTimer?.minutes === m ? T.tealLt : T.textSub,
                    border: `1px solid ${sleepTimer?.minutes === m ? "rgba(20,184,166,.3)" : "transparent"}`,
                  }}>{m}m</button>
                ))}
                {sleepTimer && <button onClick={() => onSleepTimer(null)} className="pill" style={{ padding: "5px 12px", fontSize: 12, background: "rgba(239,68,68,.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,.15)" }}>Off</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD TO PLAYLIST SHEET ────────────────────────────────────────────────────
function AddToPlaylistSheet({ song, toast, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    api.get("/api/playlists/me?size=50")
      .then(r => setPlaylists(r.content || []))
      .catch(err => toast(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const add = async (plId) => {
    setAdding(plId);
    try { await api.post(`/api/playlists/${plId}/songs`, { songId: song.id }); toast("Added to playlist"); onClose(); }
    catch (err) { toast(err.message, "error"); }
    finally { setAdding(null); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "flex-end", zIndex: 500, backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="slide-up glass" style={{ borderRadius: "22px 22px 0 0", padding: "20px 20px 40px", width: "100%", maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,.15)", margin: "0 auto 16px" }}/>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 3, fontFamily: "'Syne',sans-serif" }}>Add to playlist</div>
        <div style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>{song.title}</div>
        <div style={{ overflowY: "auto" }}>
          {loading
            ? <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Spinner/></div>
            : playlists.length === 0
              ? <p style={{ color: T.textMute, textAlign: "center", padding: 30 }}>No playlists yet. Create one in Library.</p>
              : playlists.map(pl => (
                <div key={pl.id} onClick={() => add(pl.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", borderRadius: 10 }}>
                  <CoverArt src={pl.coverImage} alt={pl.name} size={46} radius={9}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{pl.name}</div>
                    <div style={{ fontSize: 12, color: T.textMute }}>{pl.totalTracks ?? 0} songs</div>
                  </div>
                  {adding === pl.id ? <Spinner size={18}/> : <Icon name="plus" size={18} color={T.textMute}/>}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
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
        login(r); toast("Welcome to Melodiq!");
      }
    } catch (err) { toast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100dvh", background: T.bg0, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <GlobalStyles/>
      <Toast toasts={toasts} remove={removeToast}/>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,.28) 0%, transparent 70%)`, top: "4%", left: "50%", transform: "translateX(-50%)" }}/>
        <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, rgba(244,63,94,.12) 0%, transparent 70%)`, top: "12%", right: "-10%" }}/>
        <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ width: 78, height: 78, background: `linear-gradient(135deg,${T.accentDk},${T.accent})`, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 16px 48px ${T.accentGlow}` }}>
            <Icon name="music" size={34} color="#fff"/>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.text, letterSpacing: "-1.5px" }}>Melodiq</div>
          <div style={{ fontSize: 14, color: T.textMute, marginTop: 5, fontWeight: 400 }}>Your music, everywhere.</div>
        </div>
      </div>
      <div style={{ position: "relative", background: "rgba(10,8,20,.98)", borderRadius: "26px 26px 0 0", padding: "26px 22px 38px", boxShadow: "0 -6px 48px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.06)", borderBottom: "none" }}>
        <div style={{ width: 34, height: 4, borderRadius: 99, background: "rgba(255,255,255,.12)", margin: "0 auto 24px" }}/>
        <div style={{ display: "flex", background: "rgba(255,255,255,.04)", borderRadius: 14, padding: 4, marginBottom: 22 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "10px", borderRadius: 11,
              background: mode === m ? `linear-gradient(135deg,${T.accentDk},${T.accent})` : "none",
              border: "none", cursor: "pointer", color: mode === m ? "#fff" : T.textSub,
              fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all .2s",
              boxShadow: mode === m ? `0 4px 16px ${T.accentGlow}` : "none",
            }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        {mode === "register" && <Field label="Full Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>}
        <Field label="Email" type="email" value={form.email} onChange={v => setForm(p => ({...p, email: v}))} placeholder="you@example.com"/>
        <Field label="Password" type="password" value={form.password} onChange={v => setForm(p => ({...p, password: v}))} placeholder="Min 8 characters" onEnter={submit}/>
        {mode === "register" && <Field label="Country (optional)" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>}
        <button onClick={submit} disabled={loading} className="tap" style={{ width: "100%", padding: "15px", borderRadius: 14, background: `linear-gradient(135deg,${T.accentDk},${T.accent})`, border: "none", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 28px ${T.accentGlow}`, marginTop: 4 }}>
          {loading ? <Spinner size={20}/> : (mode === "login" ? "Sign In" : "Create Account")}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("mp_user") || "null"); } catch { return null; } });
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
  const [repeat, setRepeat] = useState("none");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState(null);
  const [toasts, setToasts] = useState([]);
  const audioRef = useRef(null);
  const toastId = useRef(0);
  const queueRef = useRef(queue);
  const queueIdxRef = useRef(queueIdx);
  const sleepRef = useRef(null);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIdxRef.current = queueIdx; }, [queueIdx]);

  const toast = useCallback((msg, type = "success") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  const login = (data) => {
    localStorage.setItem("mp_token", data.accessToken);
    localStorage.setItem("mp_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch {}
    localStorage.removeItem("mp_token"); localStorage.removeItem("mp_user");
    setUser(null); setCurrentSong(null); setIsPlaying(false);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentSong) return;
    if (!currentSong.audioUrl) { toast("No audio URL", "error"); return; }
    a.src = currentSong.audioUrl;
    a.volume = muted ? 0 : volume;
    a.playbackRate = playbackRate;
    a.play().then(() => setIsPlaying(true)).catch(() => toast("Could not play audio", "error"));
    api.post(`/api/songs/${currentSong.id}/play`).catch(() => {});
  }, [currentSong]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = muted ? 0 : volume; }, [volume, muted]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate; }, [playbackRate]);

  useEffect(() => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    if (!sleepTimer) return;
    sleepRef.current = setTimeout(() => {
      audioRef.current?.pause(); setIsPlaying(false); setSleepTimer(null);
      toast("Sleep timer ended. Good night 🌙");
    }, sleepTimer.minutes * 60000);
    return () => clearTimeout(sleepRef.current);
  }, [sleepTimer]);

  const playSong = useCallback(async (song, songs = [], idx = 0) => {
    let s = song;
    if (!s.audioUrl) {
      try { const full = await api.get(`/api/songs/${s.id}`); s = full; } catch {}
    }
    if (!s.audioUrl) { toast("Audio not available", "error"); return; }
    setCurrentSong(s); setQueue(songs.length ? songs : [s]); setQueueIdx(idx);
  }, [toast]);

  const handleEnded = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    if (repeat === "one") { const a = audioRef.current; if (a) { a.currentTime = 0; a.play(); } return; }
    const next = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
    if (next < q.length) { setQueueIdx(next); setCurrentSong(q[next]); }
    else if (repeat === "all") { setQueueIdx(0); setCurrentSong(q[0]); }
    else setIsPlaying(false);
  }, [repeat, shuffle]);

  const skipNext = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    const next = shuffle ? Math.floor(Math.random() * q.length) : idx + 1;
    if (next < q.length) { setQueueIdx(next); setCurrentSong(q[next]); }
  }, [shuffle]);

  const skipPrev = useCallback(() => {
    const q = queueRef.current; const idx = queueIdxRef.current;
    if (audioRef.current?.currentTime > 3) { audioRef.current.currentTime = 0; return; }
    if (idx > 0) { setQueueIdx(idx - 1); setCurrentSong(q[idx - 1]); }
  }, []);

  const seek = (e) => {
    if (e._pct !== undefined) {
      if (audioRef.current && duration) audioRef.current.currentTime = e._pct * duration;
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (audioRef.current && duration) audioRef.current.currentTime = pct * duration;
  };

  const cycleRepeat = () => setRepeat(r => r === "none" ? "all" : r === "all" ? "one" : "none");

  if (!user) return <AuthScreen login={login} toast={toast} toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))}/>;

  const contentPb = 68 + (currentSong ? 74 : 0) + 8;

  return (
    <div style={{ height: "100dvh", background: T.bg0, color: T.text, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <GlobalStyles/>
      <audio
        ref={audioRef}
        onTimeUpdate={() => { const a = audioRef.current; if (a) { setProgress(a.currentTime || 0); setDuration(a.duration || 0); } }}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <Toast toasts={toasts} remove={id => setToasts(p => p.filter(t => t.id !== id))}/>

      {playerOpen && currentSong && (
        <FullPlayer
          song={currentSong} queue={queue} queueIdx={queueIdx}
          isPlaying={isPlaying} progress={progress} duration={duration}
          volume={volume} muted={muted} shuffle={shuffle} repeat={repeat}
          sleepTimer={sleepTimer} playbackRate={playbackRate}
          onClose={() => setPlayerOpen(false)} onSeek={seek}
          onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
          onNext={skipNext} onPrev={skipPrev}
          onShuffle={() => setShuffle(s => !s)} onRepeat={cycleRepeat}
          onVolume={v => { setVolume(v); setMuted(false); }} onMute={() => setMuted(m => !m)}
          onSleepTimer={(m) => { if (!m) { setSleepTimer(null); return; } setSleepTimer({ minutes: m }); toast(`Sleep timer: ${m}min`); }}
          onPlaybackRate={r => setPlaybackRate(r)}
          playSong={playSong}
          toast={toast}
        />
      )}

      {addToPlaylistSong && (
        <AddToPlaylistSheet song={addToPlaylistSong} toast={toast} onClose={() => setAddToPlaylistSong(null)}/>
      )}

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: contentPb }}>
        {view === "home" && <HomeView playSong={playSong} toast={toast} user={user} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
        {view === "search" && <SearchView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
        {view === "library" && <LibraryView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>}
        {view === "liked" && <LikedView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={setAddToPlaylistSong}/>}
        {view === "history" && <HistoryView playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>}
        {view === "profile" && <ProfileView user={user} setUser={u => { setUser(u); localStorage.setItem("mp_user", JSON.stringify(u)); }} toast={toast} logout={logout}/>}
      </div>

      {currentSong && !playerOpen && (
        <MiniPlayer
          song={currentSong} isPlaying={isPlaying} progress={progress} duration={duration}
          onExpand={() => setPlayerOpen(true)}
          onPlay={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
          onNext={skipNext} toast={toast}
        />
      )}

      <BottomNav view={view} setView={setView} sleepTimer={sleepTimer}/>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ view, setView, sleepTimer }) {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "search", icon: "search", label: "Search" },
    { id: "library", icon: "library", label: "Library" },
    { id: "liked", icon: "heart", label: "Liked" },
    { id: "history", icon: "clock", label: "History" },
    { id: "profile", icon: "user", label: "You" },
  ];
  return (
    <div className="glass" style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 68,
      borderTop: `1px solid ${T.border}`, zIndex: 80,
      display: "flex", alignItems: "center",
    }}>
      {sleepTimer && (
        <div style={{ position: "absolute", top: -10, right: 12, display: "flex", alignItems: "center", gap: 4, background: "rgba(20,184,166,.15)", border: "1px solid rgba(20,184,166,.3)", borderRadius: 99, padding: "3px 10px" }}>
          <Icon name="sleep" size={11} color={T.teal}/>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.tealLt }}>Timer on</span>
        </div>
      )}
      {tabs.map(t => {
        const active = view === t.id;
        return (
          <button key={t.id} className="tab-btn" onClick={() => setView(t.id)} style={{ color: active ? T.accent : T.textMute }}>
            <div style={{
              width: 36, height: 26, borderRadius: 99,
              background: active ? `rgba(124,58,237,.18)` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}>
              <Icon name={t.id === "liked" && active ? "heart_fill" : t.icon} size={18}/>
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── HOME VIEW v5 ─────────────────────────────────────────────────────────────
function HomeView({ playSong, toast, user, currentSong, isPlaying, onAddToPlaylist }) {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catSongs, setCatSongs] = useState([]);
  const [catLoading, setCatLoading] = useState(false);

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

  const pickCategory = async (cat) => {
    if (selectedCat?.id === cat.id) { setSelectedCat(null); setCatSongs([]); return; }
    setSelectedCat(cat); setCatLoading(true);
    try { const r = await api.get(`/api/songs/search?categoryId=${cat.id}&size=20`); setCatSongs(r?.content || (Array.isArray(r) ? r : [])); }
    catch { setCatSongs([]); }
    finally { setCatLoading(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 18 ? "🎵" : "🌙";
  const firstName = user.name?.split(" ")[0] || "there";

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 14 }}>
      <Spinner size={36}/>
      <span style={{ fontSize: 13, color: T.textMute }}>Loading your music…</span>
    </div>
  );

  // Hero: pick first trending song
  const heroSong = trending[0];

  return (
    <div className="fade-up">
      {/* ── Header ── */}
      <div style={{ padding: "24px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: T.textMute, fontWeight: 500 }}>{greeting} {greetEmoji}</div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: "-.6px", marginTop: 2 }}>{firstName}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user.premium && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.22)", borderRadius: 99, padding: "5px 10px" }}>
              <Icon name="crown" size={13} color={T.amber}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.amber }}>Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Hero Banner ── */}
      {heroSong && (
        <div style={{ padding: "0 16px 24px" }}>
          <div className="hero-card" onClick={() => playSong(heroSong, trending, 0)}
            style={{ height: 168, background: `linear-gradient(135deg, ${T.bg3}, #2d1a5a)` }}>
            {/* Background cover */}
            {heroSong.coverImage && (
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${heroSong.coverImage})`,
                backgroundSize: "cover", backgroundPosition: "center",
                filter: "blur(8px) brightness(.4) saturate(1.6)",
                transform: "scale(1.05)",
              }}/>
            )}
            {/* Gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(4,4,12,.7) 0%, rgba(4,4,12,.2) 60%)" }}/>
            {/* Content */}
            <div style={{ position: "relative", padding: "20px 18px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(124,58,237,.35)", border: "1px solid rgba(124,58,237,.5)", borderRadius: 99, padding: "4px 10px", marginBottom: 8 }}>
                  <Icon name="fire" size={11} color={T.accentLt}/>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.accentLt, letterSpacing: ".07em", textTransform: "uppercase" }}>Trending #1</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: "-.3px", lineHeight: 1.2, maxWidth: "70%" }}>{heroSong.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 4 }}>{heroSong.artist?.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="radio" size={12} color="rgba(255,255,255,.4)"/>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500 }}>
                    {heroSong.playCount ? `${(heroSong.playCount / 1000).toFixed(0)}K plays` : fmtDur(heroSong.durationSeconds)}
                  </span>
                </div>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${T.accentDk},${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 22px ${T.accentGlow}` }}>
                  <Icon name={currentSong?.id === heroSong.id && isPlaying ? "pause" : "play"} size={19} color="#fff"/>
                </div>
              </div>
            </div>
            {/* Album art thumbnail */}
            <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,.6)", border: "2px solid rgba(255,255,255,.12)" }}>
              <CoverArt src={heroSong.coverImage} alt={heroSong.title} size={84} radius={12}/>
            </div>
          </div>
        </div>
      )}

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Browse</h2>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 16px 4px", scrollbarWidth: "none" }}>
            {categories.map(c => (
              <button key={c.id} onClick={() => pickCategory(c)} style={{
                flexShrink: 0, padding: "8px 18px", borderRadius: 99, border: "none", cursor: "pointer",
                background: selectedCat?.id === c.id ? (c.color || T.accent) : `rgba(255,255,255,0.07)`,
                color: selectedCat?.id === c.id ? "#fff" : T.textSub,
                fontWeight: 600, fontSize: 13, fontFamily: "inherit", transition: "all .18s",
                boxShadow: selectedCat?.id === c.id ? `0 4px 20px rgba(0,0,0,.5)` : "none",
              }}>{c.name}</button>
            ))}
          </div>
          {selectedCat && (
            <div className="fade-in" style={{ marginTop: 12 }}>
              {catLoading
                ? <div style={{ display: "flex", justifyContent: "center", padding: 20 }}><Spinner size={24}/></div>
                : catSongs.length === 0
                  ? <p style={{ color: T.textMute, fontSize: 13, padding: "12px 18px" }}>No songs in this category.</p>
                  : catSongs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={catSongs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)
              }
            </div>
          )}
        </div>
      )}

      {/* ── New Releases ── */}
      {albums.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: "0 16px 12px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>New Releases</h2>
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 6px", scrollbarWidth: "none" }}>
            {albums.map(a => (
              <div key={a.id} style={{ flexShrink: 0, width: 140, cursor: "pointer" }}>
                <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)", position: "relative" }}>
                  <CoverArt src={a.coverImage} alt={a.title} size={140} radius={0}/>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,.5) 0%, transparent 50%)" }}/>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{a.artist?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trending ── */}
      {trending.length > 1 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: "0 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="fire" size={16} color={T.rose}/>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Trending Now</h2>
          </div>
          {trending.slice(1, 7).map((s, i) => <SongRow key={s.id} song={s} idx={i + 1} songs={trending} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
        </div>
      )}

      {/* ── Just Added ── */}
      {latest.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: "0 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="sparkle" size={16} color={T.accentLt}/>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>Just Added</h2>
          </div>
          {latest.slice(0, 8).map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={latest} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
        </div>
      )}
    </div>
  );
}

// ─── SEARCH VIEW ──────────────────────────────────────────────────────────────
function SearchView({ playSong, toast, currentSong, isPlaying, onAddToPlaylist }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const debRef = useRef(null);

  const search = useCallback(async (query) => {
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
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => search(q), 420);
    return () => clearTimeout(debRef.current);
  }, [q, search]);

  return (
    <div className="fade-up">
      <div style={{ padding: "22px 16px 12px", position: "sticky", top: 0, background: T.bg0, zIndex: 10, borderBottom: q ? `1px solid ${T.border}` : "none" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 14, letterSpacing: "-.5px" }}>Search</h1>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textMute }}><Icon name="search" size={17}/></div>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Songs, artists, albums..."
            style={{ width: "100%", background: "rgba(255,255,255,.06)", border: `1px solid ${T.border}`, borderRadius: 14, padding: "12px 14px 12px 44px", color: T.text, fontSize: 15, transition: "border .15s" }}
            onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          {loading && <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)" }}><Spinner size={17}/></div>}
          {q && !loading && <button onClick={() => setQ("")} className="icon-btn" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 26, height: 26, color: T.textSub }}><Icon name="x" size={13}/></button>}
        </div>
      </div>

      {results && (() => {
        const songs = results.songs || [], albums = results.albums || [];
        if (!songs.length && !albums.length) return (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMute }}>
            <Icon name="search" size={40}/><p style={{ marginTop: 10, fontSize: 15 }}>No results for "{q}"</p>
          </div>
        );
        return (
          <>
            {songs.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ padding: "12px 16px 8px" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: T.textSub }}>Songs ({songs.length})</h2>
                </div>
                {songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)}
              </div>
            )}
            {albums.length > 0 && (
              <div>
                <div style={{ padding: "12px 16px 8px" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: T.textSub }}>Albums ({albums.length})</h2>
                </div>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 16px 4px" }}>
                  {albums.map(a => (
                    <div key={a.id} style={{ flexShrink: 0, width: 120 }}>
                      <div style={{ borderRadius: 12, overflow: "hidden" }}><CoverArt src={a.coverImage} alt={a.title} size={120} radius={0}/></div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: T.textMute }}>{a.artist?.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      })()}

      {!results && !loading && (
        <div style={{ textAlign: "center", paddingTop: 70, color: T.textMute }}>
          <Icon name="mic" size={44}/><p style={{ marginTop: 12, fontSize: 14 }}>Search for your favorite music</p>
        </div>
      )}
    </div>
  );
}

// ─── LIBRARY VIEW v5 ──────────────────────────────────────────────────────────
function LibraryView({ playSong, toast, currentSong, isPlaying }) {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [showSort, setShowSort] = useState(false);

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

  const del = async (id, e) => {
    e.stopPropagation();
    try { await api.delete(`/api/playlists/${id}`); setPlaylists(p => p.filter(pl => pl.id !== id)); toast("Deleted"); }
    catch (err) { toast(err.message, "error"); }
  };

  const sorted = [...playlists].sort((a, b) => {
    if (sortBy === "alpha") return a.name.localeCompare(b.name);
    if (sortBy === "size") return (b.totalTracks ?? 0) - (a.totalTracks ?? 0);
    return 0;
  });

  if (selected) return <PlaylistDetail playlist={selected} back={() => { setSelected(null); load(); }} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying}/>;

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ padding: "22px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: "-.5px" }}>Library</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowSort(s => !s)} className="icon-btn" style={{ width: 36, height: 36, color: T.textSub, background: "rgba(255,255,255,.06)", borderRadius: 10 }}>
              <Icon name="sort" size={16}/>
            </button>
            <button onClick={() => setCreating(c => !c)} className="pill pill-solid" style={{ padding: "8px 14px" }}>
              <Icon name={creating ? "x" : "plus"} size={14}/>{creating ? "Cancel" : "New"}
            </button>
          </div>
        </div>

        {showSort && (
          <div className="scale-in" style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[["recent","Recent"],["alpha","A–Z"],["size","By Size"]].map(([v,l]) => (
              <button key={v} onClick={() => { setSortBy(v); setShowSort(false); }} className="pill t" style={{ padding: "6px 12px", fontSize: 12, background: sortBy === v ? "rgba(124,58,237,.2)" : "rgba(255,255,255,.05)", color: sortBy === v ? T.accentLt : T.textSub, border: `1px solid ${sortBy === v ? "rgba(124,58,237,.3)" : T.border}` }}>{l}</button>
            ))}
          </div>
        )}

        {creating && (
          <div className="scale-in" style={{ padding: 14, borderRadius: 16, background: "rgba(124,58,237,.07)", border: `1px solid rgba(124,58,237,.18)`, marginBottom: 4 }}>
            <Field label="Playlist name" value={newName} onChange={setNewName} placeholder="My Playlist"/>
            <button onClick={create} disabled={saving} className="pill pill-solid" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
              {saving ? <Spinner size={16}/> : "Create Playlist"}
            </button>
          </div>
        )}
      </div>

      {loading
        ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div>
        : sorted.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMute }}>
              <Icon name="library" size={48}/><p style={{ marginTop: 12, fontSize: 15 }}>No playlists yet</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Create one to organize your music</p>
            </div>
          : <div style={{ padding: "0 16px" }}>
              {sorted.map((pl, i) => (
                <div key={pl.id} onClick={() => setSelected(pl)} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 0",
                  borderBottom: i < sorted.length - 1 ? `1px solid ${T.border}` : "none",
                  cursor: "pointer",
                }}>
                  {/* Cover art */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <CoverArt src={pl.coverImage} alt={pl.name} size={60} radius={13}/>
                    {/* Small song count badge */}
                    {(pl.totalTracks ?? 0) > 0 && (
                      <div style={{ position: "absolute", bottom: -4, right: -4, background: T.bg0, border: `1.5px solid ${T.border}`, borderRadius: 99, padding: "1px 6px", fontSize: 9, fontWeight: 700, color: T.textMute }}>
                        {pl.totalTracks}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{pl.name}</div>
                    <div style={{ fontSize: 12, color: T.textMute, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="music" size={11} color={T.textMute}/>
                      <span>{pl.totalTracks ?? 0} songs</span>
                      {pl.isPublic && <span style={{ fontSize: 10, background: "rgba(20,184,166,.1)", color: T.teal, padding: "1px 7px", borderRadius: 4, fontWeight: 700 }}>Public</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button onClick={e => del(pl.id, e)} className="icon-btn" style={{ width: 32, height: 32, color: "rgba(239,68,68,.5)" }}>
                      <Icon name="trash" size={14}/>
                    </button>
                    <Icon name="chevron_right" size={16} color={T.textMute}/>
                  </div>
                </div>
              ))}
            </div>
      }
    </div>
  );
}

// ─── PLAYLIST DETAIL v5 ───────────────────────────────────────────────────────
function PlaylistDetail({ playlist, back, playSong, toast, currentSong, isPlaying }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api.get(`/api/playlists/${playlist.id}`).then(setDetail).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, [playlist.id]);

  const doSearch = async () => {
    if (!searchQ.trim()) return;
    setSearching(true);
    try { const r = await api.get(`/api/songs/search?query=${encodeURIComponent(searchQ)}&size=6`); setSearchRes(r?.content || (Array.isArray(r) ? r : [])); }
    catch (err) { toast(err.message, "error"); }
    finally { setSearching(false); }
  };

  const addSong = async (songId) => {
    try {
      await api.post(`/api/playlists/${playlist.id}/songs`, { songId });
      const r = await api.get(`/api/playlists/${playlist.id}`);
      setDetail(r); setSearchRes([]); setSearchQ(""); toast("Added!");
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
    <div className="fade-up">
      {/* Back + header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 0" }}>
        <button className="icon-btn tap" onClick={back} style={{ width: 38, height: 38, color: T.text, background: T.surface, borderRadius: 11 }}><Icon name="chevron_left" size={20}/></button>
        <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>{detail?.name || playlist.name}</h1>
      </div>

      {/* Playlist hero */}
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 16, alignItems: "flex-end" }}>
        <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,.55)", flexShrink: 0 }}>
          <CoverArt src={detail?.coverImage} alt={detail?.name} size={96} radius={0}/>
        </div>
        <div style={{ flex: 1, paddingBottom: 4 }}>
          <div style={{ fontSize: 13, color: T.textMute, marginBottom: 8 }}>
            {songs.length} songs{detail?.totalDuration ? ` · ${fmtDur(detail.totalDuration)}` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {songs.length > 0 && (
              <button onClick={() => playSong(songs[0], songs, 0)} className="pill pill-solid" style={{ padding: "9px 16px" }}><Icon name="play" size={13}/> Play All</button>
            )}
            {songs.length > 1 && (
              <button onClick={() => { const i = Math.floor(Math.random() * songs.length); playSong(songs[i], songs, i); }} className="pill pill-ghost"><Icon name="shuffle" size={13}/> Shuffle</button>
            )}
          </div>
        </div>
      </div>

      {/* Song list — improved with album art */}
      {loading
        ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner/></div>
        : (
          <div style={{ marginTop: 16 }}>
            {songs.length === 0
              ? <p style={{ color: T.textMute, fontSize: 13, textAlign: "center", padding: 36 }}>No songs yet. Search below to add some.</p>
              : songs.map((s, i) => (
                  <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onRemove={removeSong}/>
                ))
            }
          </div>
        )
      }

      {/* Add song search — below the list */}
      <div style={{ margin: "16px 16px 16px", padding: 14, borderRadius: 16, background: T.surface, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={12} color={T.textMute}/> Add Songs
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} placeholder="Search to add..." style={{ flex: 1, background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", color: T.text, fontSize: 13 }}
            onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.4)"}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button onClick={doSearch} className="pill pill-ghost" style={{ padding: "9px 14px", flexShrink: 0 }}>
            {searching ? <Spinner size={14}/> : <Icon name="search" size={16}/>}
          </button>
        </div>

        {/* Search results — with album art */}
        {searchRes.map(s => (
          <div key={s.id} onClick={() => addSong(s.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 0", cursor: "pointer", borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
            <CoverArt src={s.coverImage} alt={s.title} size={42} radius={8}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
              <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{s.artist?.name} · {fmtDur(s.durationSeconds)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.22)", borderRadius: 99, padding: "5px 10px", flexShrink: 0 }}>
              <Icon name="plus" size={12} color={T.accentLt}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accentLt }}>Add</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LIKED VIEW ───────────────────────────────────────────────────────────────
function LikedView({ playSong, toast, currentSong, isPlaying, onAddToPlaylist }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/songs/liked?size=100").then(r => setSongs(r?.content || (Array.isArray(r) ? r : []))).catch(err => toast(err.message, "error")).finally(() => setLoading(false));
  }, []);
  return (
    <div className="fade-up">
      <div style={{ padding: "22px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg,#be185d,#f43f5e)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(244,63,94,.3)" }}>
            <Icon name="heart_fill" size={26} color="#fff"/>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Liked Songs</h1>
            <p style={{ color: T.textMute, fontSize: 13, marginTop: 2 }}>{songs.length} songs</p>
          </div>
        </div>
        {songs.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => playSong(songs[0], songs, 0)} className="pill pill-rose"><Icon name="play" size={13}/> Play All</button>
            <button onClick={() => { const i = Math.floor(Math.random() * songs.length); playSong(songs[i], songs, i); }} className="pill pill-ghost"><Icon name="shuffle" size={13}/> Shuffle</button>
          </div>
        )}
      </div>
      {loading
        ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div>
        : songs.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}><Icon name="heart" size={48}/><p style={{ marginTop: 12 }}>No liked songs yet</p></div>
          : songs.map((s, i) => <SongRow key={s.id} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} onAddToPlaylist={onAddToPlaylist}/>)
      }
    </div>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ playSong, toast, currentSong, isPlaying }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/api/history?size=100")
      .then(r => setHistory(r?.content || (Array.isArray(r) ? r : [])))
      .catch(err => toast(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const clear = async () => {
    try { await api.delete("/api/history"); setHistory([]); toast("History cleared"); }
    catch (err) { toast(err.message, "error"); }
  };

  const allSongs = history.map(h => ({ ...(h.song || h), playedAt: h.playedAt || h.createdAt })).filter(s => s.id);
  const now = Date.now();
  const filtered = allSongs.filter(s => {
    if (filter === "today") return now - new Date(s.playedAt).getTime() < 86400000;
    if (filter === "week") return now - new Date(s.playedAt).getTime() < 604800000;
    return true;
  });

  const grouped = {};
  filtered.forEach(s => {
    const d = s.playedAt ? new Date(s.playedAt) : null;
    let label = "Unknown";
    if (d) {
      const diff = Math.floor((now - d.getTime()) / 86400000);
      label = diff === 0 ? "Today" : diff === 1 ? "Yesterday" : d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    }
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  return (
    <div className="fade-up">
      <div style={{ padding: "22px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="history" size={22} color="#818cf8"/>
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>History</h1>
              <p style={{ color: T.textMute, fontSize: 12, marginTop: 1 }}>{allSongs.length} tracks played</p>
            </div>
          </div>
          {allSongs.length > 0 && (
            <button onClick={clear} className="pill pill-danger" style={{ padding: "7px 14px" }}>
              <Icon name="trash" size={13}/> Clear
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {[["all","All time"],["today","Today"],["week","This week"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} className="pill t" style={{
              padding: "6px 13px", fontSize: 12,
              background: filter === v ? "rgba(99,102,241,.18)" : "rgba(255,255,255,.05)",
              color: filter === v ? "#818cf8" : T.textSub,
              border: `1px solid ${filter === v ? "rgba(99,102,241,.3)" : T.border}`,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading
        ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={34}/></div>
        : filtered.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: T.textMute }}><Icon name="clock" size={48}/><p style={{ marginTop: 12 }}>No history for this period</p></div>
          : Object.entries(grouped).map(([label, songs]) => (
            <div key={label}>
              <div style={{ padding: "12px 16px 6px", fontSize: 11, fontWeight: 700, color: T.textMute, textTransform: "uppercase", letterSpacing: ".09em" }}>{label}</div>
              {songs.map((s, i) => (
                <SongRow key={`${s.id}-${i}`} song={s} idx={i} songs={songs} playSong={playSong} toast={toast} currentSong={currentSong} isPlaying={isPlaying} showDate={true}/>
              ))}
            </div>
          ))
      }
    </div>
  );
}

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
function ProfileView({ user, setUser, toast, logout }) {
  const [tab, setTab] = useState("account");
  const [form, setForm] = useState({ name: user.name || "", bio: user.bio || "", country: user.country || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(user.profileImage || null);
  const fileRef = useRef(null);

  const handleImg = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImageFile(file);
    const r = new FileReader();
    r.onload = ev => setImgPreview(ev.target.result);
    r.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let r;
      if (imageFile) {
        const fd = new FormData();
        fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
        fd.append("image", imageFile);
        r = await api.putForm("/api/users/me", fd);
      } else { r = await api.put("/api/users/me", form); }
      setUser(r); toast("Profile updated!");
    } catch (err) { toast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const changePw = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast("All fields required", "warning"); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast("Passwords don't match", "warning"); return; }
    if (pwForm.newPassword.length < 8) { toast("Min 8 characters", "warning"); return; }
    setPwSaving(true);
    try {
      await api.post("/api/auth/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast("Password updated!"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast(err.message, "error"); }
    finally { setPwSaving(false); }
  };

  return (
    <div className="fade-up">
      <div style={{ padding: "22px 16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${T.accentDk},${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `3px solid rgba(124,58,237,.3)` }}>
            {imgPreview ? <img src={imgPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Icon name="user" size={30} color="#fff"/>}
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: T.accent, border: `2px solid ${T.bg0}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="edit" size={11} color="#fff"/>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }}/>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{user.name}</div>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: user.role === "ADMIN" ? "rgba(245,158,11,.12)" : "rgba(124,58,237,.12)", color: user.role === "ADMIN" ? T.amber : T.accentLt, fontWeight: 700 }}>{user.role}</span>
            {user.premium && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(245,158,11,.12)", color: T.amber, fontWeight: 700 }}>✦ Premium</span>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "0 16px 0", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
        {["account","security","subscription"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 16px", border: "none", cursor: "pointer", background: "none",
            color: tab === t ? T.accentLt : T.textSub,
            fontWeight: tab === t ? 700 : 500, fontSize: 13, fontFamily: "inherit",
            borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent",
            transition: "all .18s",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        {tab === "account" && (
          <>
            <Field label="Display Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Your name"/>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textMute, marginBottom: 6, letterSpacing: ".07em", textTransform: "uppercase" }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} placeholder="About you..." rows={3} style={{ width: "100%", background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", color: T.text, fontSize: 14, fontFamily: "inherit", resize: "none" }}/>
            </div>
            <Field label="Country" value={form.country} onChange={v => setForm(p => ({...p, country: v}))} placeholder="India"/>
            <button onClick={saveProfile} disabled={saving} className="pill pill-solid" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
              {saving ? <Spinner size={17}/> : <><Icon name="check" size={15}/> Save Changes</>}
            </button>
          </>
        )}
        {tab === "security" && (
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Change Password</div>
            <Field label="Current Password" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(p => ({...p, currentPassword: v}))} placeholder="Current password"/>
            <Field label="New Password" type="password" value={pwForm.newPassword} onChange={v => setPwForm(p => ({...p, newPassword: v}))} placeholder="New password"/>
            <Field label="Confirm New Password" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(p => ({...p, confirmPassword: v}))} placeholder="Repeat"/>
            <button onClick={changePw} disabled={pwSaving} className="pill pill-solid" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
              {pwSaving ? <Spinner size={17}/> : <><Icon name="shield" size={15}/> Update Password</>}
            </button>
          </div>
        )}
        {tab === "subscription" && <SubTab user={user} toast={toast}/>}
      </div>

      <div style={{ padding: "0 16px 32px" }}>
        <button onClick={logout} className="pill pill-danger" style={{ width: "100%", justifyContent: "center", padding: "13px", borderRadius: 14 }}>
          <Icon name="logout" size={17}/> Sign Out
        </button>
      </div>
    </div>
  );
}

function SubTab({ user, toast }) {
  const features = ["Ad-free listening", "High quality audio", "Offline downloads", "Exclusive tracks", "Unlimited skips"];
  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 14, background: user.premium ? "rgba(245,158,11,.06)" : T.surface, border: user.premium ? "1px solid rgba(245,158,11,.2)" : `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: user.premium ? "linear-gradient(135deg,#d97706,#fbbf24)" : "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: user.premium ? "0 8px 24px rgba(217,119,6,.3)" : "none" }}>
            <Icon name="crown" size={22} color={user.premium ? "#fff" : T.textMute}/>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Syne',sans-serif" }}>{user.premium ? "Premium" : "Free Plan"}</div>
            <div style={{ color: T.textMute, fontSize: 13 }}>{user.premium ? "Unlimited music, everywhere." : "Upgrade for full access"}</div>
          </div>
        </div>
        {features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 9 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: user.premium ? "rgba(245,158,11,.2)" : "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="check" size={12} color={user.premium ? T.amber : T.textMute}/>
            </div>
            <span style={{ color: user.premium ? T.text : T.textSub }}>{f}</span>
          </div>
        ))}
        {!user.premium && (
          <button onClick={() => toast("Contact admin to upgrade", "warning")} className="pill" style={{ marginTop: 12, width: "100%", justifyContent: "center", padding: "13px", background: "linear-gradient(135deg,#d97706,#fbbf24)", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, borderRadius: 13, cursor: "pointer", boxShadow: "0 8px 24px rgba(217,119,6,.3)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="crown" size={16}/> Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
}
