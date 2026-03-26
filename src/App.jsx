import { useState, useEffect, useRef, useCallback } from "react";
import { loadStorage, saveStorage, STORAGE_KEYS } from "./storage.js";
import { TOPICS, GLOSSARY } from "./data/topics.js";

// ─── SVG ILLUSTRATIONS ───

function TopicIllustration({ topicId, size = 120 }) {
  const s = size;
  const illustrations = {
    need: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <circle cx="60" cy="54" r="32" fill="none" stroke="#E63946" strokeWidth="2.5" opacity="0.7"/>
        <line x1="38" y1="32" x2="82" y2="76" stroke="#E63946" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <rect x="48" y="88" width="24" height="3" rx="1.5" fill="#E63946" opacity="0.4"/>
        <rect x="42" y="96" width="36" height="3" rx="1.5" fill="#E63946" opacity="0.25"/>
        <rect x="46" y="104" width="28" height="3" rx="1.5" fill="#E63946" opacity="0.15"/>
        <circle cx="60" cy="54" r="6" fill="#E63946" opacity="0.2"/>
      </svg>
    ),
    trust: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <path d="M60 20 L60 46" stroke="#457B9D" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="60" cy="56" r="4" fill="#457B9D" opacity="0.6"/>
        <path d="M36 80 Q48 65 60 80 Q72 95 84 80" fill="none" stroke="#457B9D" strokeWidth="2" opacity="0.5"/>
        <path d="M30 90 Q48 75 60 90 Q72 105 90 90" fill="none" stroke="#457B9D" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="42" cy="38" r="2" fill="#457B9D" opacity="0.3"/>
        <circle cx="78" cy="42" r="2" fill="#457B9D" opacity="0.3"/>
        <circle cx="45" cy="52" r="1.5" fill="#457B9D" opacity="0.2"/>
        <circle cx="75" cy="50" r="1.5" fill="#457B9D" opacity="0.2"/>
      </svg>
    ),
    bias: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <line x1="60" y1="18" x2="60" y2="95" stroke="#6D597A" strokeWidth="2" opacity="0.3"/>
        <circle cx="36" cy="70" r="16" fill="#6D597A" opacity="0.12"/>
        <circle cx="84" cy="50" r="24" fill="#6D597A" opacity="0.12"/>
        <path d="M42 40 L60 56 L78 40" fill="none" stroke="#6D597A" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="36" cy="70" r="3" fill="#6D597A" opacity="0.5"/>
        <circle cx="84" cy="50" r="3" fill="#6D597A" opacity="0.5"/>
        <rect x="50" y="100" width="20" height="3" rx="1.5" fill="#6D597A" opacity="0.25"/>
      </svg>
    ),
    critical: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <ellipse cx="60" cy="48" rx="28" ry="22" fill="#2A9D8F" opacity="0.1" stroke="#2A9D8F" strokeWidth="1.5"/>
        <path d="M46 72 Q50 80 54 72" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M54 72 Q58 64 62 72" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M62 72 Q66 80 70 72" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="50" cy="44" r="2.5" fill="#2A9D8F" opacity="0.6"/>
        <circle cx="70" cy="44" r="2.5" fill="#2A9D8F" opacity="0.6"/>
        <path d="M52 92 L60 84 L68 92" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M48 100 L60 92 L72 100" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
      </svg>
    ),
    sustainable: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <path d="M60 95 L60 50" stroke="#588157" strokeWidth="2" strokeLinecap="round"/>
        <path d="M60 50 Q40 30 60 18 Q80 30 60 50" fill="#588157" opacity="0.15" stroke="#588157" strokeWidth="1.5"/>
        <path d="M60 60 Q45 50 50 38" fill="none" stroke="#588157" strokeWidth="1.2" opacity="0.4"/>
        <path d="M60 65 Q75 55 72 42" fill="none" stroke="#588157" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="60" cy="95" r="3" fill="#588157" opacity="0.3"/>
        <path d="M48 102 Q60 96 72 102" fill="none" stroke="#588157" strokeWidth="1" opacity="0.2"/>
      </svg>
    ),
    labor: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <rect x="34" y="30" width="52" height="56" rx="4" fill="none" stroke="#BC6C25" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="60" cy="50" r="10" fill="#BC6C25" opacity="0.1" stroke="#BC6C25" strokeWidth="1.5"/>
        <line x1="44" y1="70" x2="76" y2="70" stroke="#BC6C25" strokeWidth="1" opacity="0.3"/>
        <line x1="48" y1="76" x2="72" y2="76" stroke="#BC6C25" strokeWidth="1" opacity="0.2"/>
        <circle cx="44" cy="98" r="3" fill="#BC6C25" opacity="0.2"/>
        <circle cx="60" cy="98" r="3" fill="#BC6C25" opacity="0.3"/>
        <circle cx="76" cy="98" r="3" fill="#BC6C25" opacity="0.2"/>
        <line x1="44" y1="98" x2="44" y2="86" stroke="#BC6C25" strokeWidth="0.8" opacity="0.15" strokeDasharray="2 2"/>
        <line x1="60" y1="98" x2="60" y2="86" stroke="#BC6C25" strokeWidth="0.8" opacity="0.15" strokeDasharray="2 2"/>
        <line x1="76" y1="98" x2="76" y2="86" stroke="#BC6C25" strokeWidth="0.8" opacity="0.15" strokeDasharray="2 2"/>
      </svg>
    ),
    benefits: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <line x1="60" y1="20" x2="60" y2="100" stroke="#264653" strokeWidth="0.8" opacity="0.15"/>
        <rect x="28" y="30" width="24" height="70" rx="3" fill="#264653" opacity="0.08"/>
        <rect x="68" y="50" width="24" height="50" rx="3" fill="#264653" opacity="0.08"/>
        <rect x="32" y="42" width="16" height="4" rx="2" fill="#264653" opacity="0.5"/>
        <rect x="32" y="52" width="12" height="4" rx="2" fill="#264653" opacity="0.3"/>
        <rect x="32" y="62" width="16" height="4" rx="2" fill="#264653" opacity="0.5"/>
        <rect x="72" y="62" width="10" height="4" rx="2" fill="#264653" opacity="0.25"/>
        <rect x="72" y="72" width="14" height="4" rx="2" fill="#264653" opacity="0.15"/>
        <path d="M52 56 L68 66" stroke="#E9C46A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" strokeDasharray="3 3"/>
      </svg>
    ),
    misinfo: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <rect x="30" y="28" width="60" height="44" rx="4" fill="none" stroke="#9B2226" strokeWidth="1.5" opacity="0.4"/>
        <line x1="38" y1="42" x2="82" y2="42" stroke="#9B2226" strokeWidth="1" opacity="0.2"/>
        <line x1="38" y1="50" x2="72" y2="50" stroke="#9B2226" strokeWidth="1" opacity="0.2"/>
        <line x1="38" y1="58" x2="66" y2="58" stroke="#9B2226" strokeWidth="1" opacity="0.2"/>
        <circle cx="70" cy="78" r="14" fill="none" stroke="#9B2226" strokeWidth="1.5" opacity="0.5"/>
        <line x1="62" y1="78" x2="78" y2="78" stroke="#9B2226" strokeWidth="1.5" opacity="0.5"/>
        <line x1="70" y1="70" x2="70" y2="86" stroke="#9B2226" strokeWidth="1.5" opacity="0.5"/>
        <path d="M38 82 L50 78 L42 90" fill="none" stroke="#9B2226" strokeWidth="1" opacity="0.3"/>
        <rect x="40" y="100" width="40" height="2" rx="1" fill="#9B2226" opacity="0.15"/>
      </svg>
    ),
    theft: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <rect x="32" y="26" width="56" height="40" rx="3" fill="none" stroke="#D62828" strokeWidth="1.5" opacity="0.4"/>
        <line x1="40" y1="36" x2="80" y2="36" stroke="#D62828" strokeWidth="0.8" opacity="0.2"/>
        <line x1="40" y1="42" x2="74" y2="42" stroke="#D62828" strokeWidth="0.8" opacity="0.2"/>
        <line x1="40" y1="48" x2="68" y2="48" stroke="#D62828" strokeWidth="0.8" opacity="0.2"/>
        <line x1="40" y1="54" x2="78" y2="54" stroke="#D62828" strokeWidth="0.8" opacity="0.2"/>
        <path d="M56 66 C56 76, 44 80, 44 90 C44 98, 76 98, 76 90 C76 80, 64 76, 64 66" fill="none" stroke="#D62828" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="60" cy="84" r="3" fill="#D62828" opacity="0.3"/>
        <line x1="60" y1="87" x2="60" y2="92" stroke="#D62828" strokeWidth="1.5" opacity="0.3"/>
      </svg>
    ),
    privacy: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <circle cx="60" cy="48" r="22" fill="none" stroke="#3D405B" strokeWidth="1.5" opacity="0.3"/>
        <ellipse cx="50" cy="44" rx="5" ry="6" fill="none" stroke="#3D405B" strokeWidth="1.5" opacity="0.6"/>
        <ellipse cx="70" cy="44" rx="5" ry="6" fill="none" stroke="#3D405B" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="50" cy="44" r="2" fill="#3D405B" opacity="0.5"/>
        <circle cx="70" cy="44" r="2" fill="#3D405B" opacity="0.5"/>
        <path d="M40 80 L50 74 L60 82 L70 74 L80 80" fill="none" stroke="#3D405B" strokeWidth="1" opacity="0.3"/>
        <path d="M36 88 L48 82 L60 90 L72 82 L84 88" fill="none" stroke="#3D405B" strokeWidth="1" opacity="0.2"/>
        <path d="M32 96 L46 90 L60 98 L74 90 L88 96" fill="none" stroke="#3D405B" strokeWidth="1" opacity="0.12"/>
      </svg>
    ),
    sycophancy: (
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <rect x="36" y="28" width="48" height="56" rx="12" fill="none" stroke="#E07A5F" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="50" cy="48" r="3" fill="#E07A5F" opacity="0.4"/>
        <circle cx="70" cy="48" r="3" fill="#E07A5F" opacity="0.4"/>
        <path d="M48 60 Q60 70 72 60" fill="none" stroke="#E07A5F" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M50 90 Q40 100 36 96" fill="none" stroke="#E07A5F" strokeWidth="1" opacity="0.3"/>
        <path d="M70 90 Q80 100 84 96" fill="none" stroke="#E07A5F" strokeWidth="1" opacity="0.3"/>
        <circle cx="36" cy="96" r="4" fill="#E07A5F" opacity="0.1" stroke="#E07A5F" strokeWidth="0.8" opacity="0.2"/>
        <circle cx="84" cy="96" r="4" fill="#E07A5F" opacity="0.1" stroke="#E07A5F" strokeWidth="0.8" opacity="0.2"/>
      </svg>
    ),
  };
  return illustrations[topicId] || null;
}

// ─── SMALL COMPONENTS ───

function ResourceTag({ type }) {
  const s = { article: { bg: "#EEF2FF", c: "#4338CA", l: "📄 Article" }, book: { bg: "#FEF3C7", c: "#92400E", l: "📕 Book" }, video: { bg: "#ECFDF5", c: "#065F46", l: "▶️ Video" }, podcast: { bg: "#FDF2F8", c: "#9D174D", l: "🎧 Podcast" }, report: { bg: "#F0F9FF", c: "#0C4A6E", l: "📄 Report" } }[type] || { bg: "#EEF2FF", c: "#4338CA", l: "📄" };
  return <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--f)" }}>{s.l}</span>;
}

function AccessTag({ access }) {
  const m = { open: { bg: "#ECFDF5", c: "#065F46", l: "🌐 Open" }, paywall: { bg: "#FEF2F2", c: "#991B1B", l: "🔐 Paywall" }, library: { bg: "#FEF3C7", c: "#92400E", l: "🔐 Library" } };
  const s = m[access] || m.open;
  return <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--f)" }}>{s.l}</span>;
}

function ActivityCard({ activity, color }) {
  const icons = { discussion: "💬", activity: "🎯", tip: "💡" };
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 14, padding: "20px 22px", borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icons[activity.type] || "📌"}</span>
        <span style={{ fontFamily: "var(--f)", fontWeight: 700, fontSize: 15, color: "var(--t1)" }}>{activity.title}</span>
      </div>
      <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", lineHeight: 1.7, margin: 0 }}>{activity.text}</p>
    </div>
  );
}

function ProgressRing({ completed, total }) {
  const pct = total > 0 ? completed / total : 0;
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--brd)" strokeWidth="3"/>
      <circle cx="22" cy="22" r={r} fill="none" stroke="#2A9D8F" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 22 22)" style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
      <text x="22" y="22" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 700, fill: "var(--t1)", fontFamily: "var(--f)" }}>
        {completed}/{total}
      </text>
    </svg>
  );
}

// ─── TOPIC VIEW ───

function TopicView({ topic, role, onBack, onNavigate, progress, toggleProgress, onJournal }) {
  const [tab, setTab] = useState("overview");
  const tabs = [{ id: "overview", l: "Overview" }, { id: "activities", l: role === "student" ? "Activities" : "Teaching" }, { id: "resources", l: "Resources" }, { id: "connections", l: "Connections" }];
  const acts = role === "student" ? topic.studentActivities : topic.instructorActivities;
  const done = progress.includes(topic.id);
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: `linear-gradient(135deg, ${topic.color}10, ${topic.accent}20)`, borderRadius: 20, padding: "36px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: 10, opacity: 0.08 }}><TopicIllustration topicId={topic.id} size={200}/></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <button onClick={onBack} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t2)" }}>← Back</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onJournal(topic.id)} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 12, fontWeight: 600, color: "var(--t2)" }}>📝 Journal</button>
            <button onClick={() => toggleProgress(topic.id)} style={{ background: done ? "#2A9D8F" : "var(--card)", border: `1px solid ${done ? "#2A9D8F" : "var(--brd)"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 12, fontWeight: 600, color: done ? "#fff" : "var(--t2)", transition: "all 0.25s" }}>
              {done ? "✓ Explored" : "Mark explored"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <TopicIllustration topicId={topic.id} size={72}/>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, color: "var(--t1)", margin: 0, lineHeight: 1.2 }}>{topic.title}</h1>
            <p style={{ fontFamily: "var(--f)", fontSize: 15, color: topic.color, fontWeight: 600, margin: "4px 0 0" }}>{topic.subtitle}</p>
          </div>
        </div>
      </div>
      <div style={{ borderLeft: `3px solid ${topic.color}`, padding: "14px 22px", marginBottom: 28, background: `${topic.color}06`, borderRadius: "0 12px 12px 0" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, fontStyle: "italic", color: "var(--t1)", margin: "0 0 6px", lineHeight: 1.6 }}>"{topic.quote}"</p>
        <p style={{ fontFamily: "var(--f)", fontSize: 13, color: "var(--t2)", margin: 0 }}>— {topic.quoteAuthor}, <em>{topic.quoteRole}</em></p>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--brd)", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${topic.color}` : "2px solid transparent", padding: "10px 16px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 14, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? topic.color : "var(--t2)", whiteSpace: "nowrap" }}>{t.l}</button>
        ))}
      </div>
      {tab === "overview" && <div><p style={{ fontFamily: "var(--f)", fontSize: 15, color: "var(--t1)", lineHeight: 1.8 }}>{topic.description}</p>{topic.disciplinary && <div style={{ marginTop: 24 }}><h3 style={{ fontFamily: "var(--f)", fontSize: 13, fontWeight: 700, color: "var(--t2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Disciplinary extensions</h3><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{topic.disciplinary.map((d,i)=><div key={i} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "12px 16px", fontFamily: "var(--f)", fontSize: 14, color: "var(--t1)", lineHeight: 1.6 }}>{d}</div>)}</div></div>}</div>}
      {tab === "activities" && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{acts.map((a,i) => <ActivityCard key={i} activity={a} color={topic.color}/>)}</div>}
      {tab === "resources" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{topic.resources.map((r,i) => <div key={i} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}><div>{r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--f)", fontWeight: 600, fontSize: 14, color: topic.color, marginBottom: 3, display: "block", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.7"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>{r.title} ↗</a> : <div style={{ fontFamily: "var(--f)", fontWeight: 600, fontSize: 14, color: "var(--t1)", marginBottom: 3 }}>{r.title}</div>}<div style={{ fontFamily: "var(--f)", fontSize: 12, color: "var(--t2)" }}>{r.source}</div></div><div style={{ display: "flex", gap: 6 }}><ResourceTag type={r.type}/><AccessTag access={r.access}/></div></div>)}</div>}
      {tab === "connections" && <div><p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", marginBottom: 16 }}>Explore related themes.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>{topic.relatedTopics.map(id => { const r = TOPICS.find(t=>t.id===id); if(!r) return null; return <button key={id} onClick={()=>onNavigate(r)} style={{ background: `${r.color}08`, border: `1px solid ${r.color}22`, borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "left", transition: "all 0.25s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=`${r.color}55`;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${r.color}22`;e.currentTarget.style.transform="none"}}><TopicIllustration topicId={r.id} size={40}/><div style={{ fontFamily: "var(--f)", fontWeight: 700, fontSize: 14, color: "var(--t1)", marginTop: 8 }}>{r.title}</div><div style={{ fontFamily: "var(--f)", fontSize: 12, color: "var(--t2)" }}>{r.subtitle}</div></button>})}</div></div>}
    </div>
  );
}

// ─── JOURNAL VIEW ───

function JournalView({ onBack, initialTopic }) {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [selTopic, setSelTopic] = useState(initialTopic || "general");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadStorage(STORAGE_KEYS.journal).then(d => { if (d) setEntries(d); setLoaded(true); }); }, []);
  const save = useCallback(async (next) => { setEntries(next); await saveStorage(STORAGE_KEYS.journal, next); }, []);

  const addEntry = () => {
    if (!text.trim()) return;
    const next = [{ id: Date.now(), topic: selTopic, text: text.trim(), date: new Date().toISOString() }, ...entries];
    save(next); setText("");
  };
  const delEntry = (id) => { save(entries.filter(e => e.id !== id)); };

  const topicLabel = (id) => { const t = TOPICS.find(x=>x.id===id); return t ? `${t.emoji} ${t.title}` : "📓 General"; };
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? entries : entries.filter(e => e.topic === filter);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={onBack} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 20 }}>← Back</button>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: "var(--t1)", margin: "0 0 6px" }}>📝 Reflection Journal</h2>
      <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", marginBottom: 20, lineHeight: 1.6 }}>Capture your thoughts as you explore AI ethics topics. Your entries are saved and will be here when you return.</p>

      <div style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <select value={selTopic} onChange={e => setSelTopic(e.target.value)} style={{ fontFamily: "var(--f)", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--brd)", background: "var(--bg)", color: "var(--t1)", flex: "1 1 180px" }}>
            <option value="general">📓 General Reflection</option>
            {TOPICS.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.title}</option>)}
          </select>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What are you thinking about? What surprised you? What questions do you have?" rows={4} style={{ width: "100%", boxSizing: "border-box", fontFamily: "var(--f)", fontSize: 14, padding: 14, borderRadius: 10, border: "1px solid var(--brd)", background: "var(--bg)", color: "var(--t1)", resize: "vertical", lineHeight: 1.6 }}/>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={addEntry} disabled={!text.trim()} style={{ background: text.trim() ? "#2A9D8F" : "var(--brd)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", cursor: text.trim() ? "pointer" : "default", fontFamily: "var(--f)", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>Save Entry</button>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          <button onClick={() => setFilter("all")} style={{ background: filter === "all" ? "var(--t1)" : "var(--card)", color: filter === "all" ? "var(--bg)" : "var(--t2)", border: "1px solid var(--brd)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>All ({entries.length})</button>
          {[...new Set(entries.map(e=>e.topic))].map(tid => {
            const cnt = entries.filter(e=>e.topic===tid).length;
            return <button key={tid} onClick={() => setFilter(tid)} style={{ background: filter === tid ? "var(--t1)" : "var(--card)", color: filter === tid ? "var(--bg)" : "var(--t2)", border: "1px solid var(--brd)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{topicLabel(tid)} ({cnt})</button>;
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {!loaded && <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)" }}>Loading entries...</p>}
        {loaded && filtered.length === 0 && <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", textAlign: "center", padding: 40 }}>No entries yet. Start reflecting above!</p>}
        {filtered.map(e => (
          <div key={e.id} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--f)", fontSize: 12, fontWeight: 600, color: "var(--t2)" }}>{topicLabel(e.topic)}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--f)", fontSize: 11, color: "var(--t2)" }}>{new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                <button onClick={() => delEntry(e.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--t2)", padding: 2 }} title="Delete">×</button>
              </div>
            </div>
            <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t1)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SYLLABUS BUILDER ───

function SyllabusBuilder({ onBack }) {
  const [syllabus, setSyllabus] = useState({ title: "My AI Ethics Syllabus", weeks: [] });
  const [loaded, setLoaded] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [editTitle, setEditTitle] = useState(false);

  useEffect(() => { loadStorage(STORAGE_KEYS.syllabus).then(d => { if (d) setSyllabus(d); setLoaded(true); }); }, []);
  const persist = useCallback(async (next) => { setSyllabus(next); await saveStorage(STORAGE_KEYS.syllabus, next); }, []);

  const addWeek = () => {
    const next = { ...syllabus, weeks: [...syllabus.weeks, { id: Date.now(), label: `Week ${syllabus.weeks.length + 1}`, topics: [], notes: "" }] };
    persist(next);
  };
  const removeWeek = (wid) => { persist({ ...syllabus, weeks: syllabus.weeks.filter(w => w.id !== wid) }); };
  const updateWeek = (wid, patch) => { persist({ ...syllabus, weeks: syllabus.weeks.map(w => w.id === wid ? { ...w, ...patch } : w) }); };

  const addTopicToWeek = (wid, topicId) => {
    const w = syllabus.weeks.find(x => x.id === wid);
    if (w && !w.topics.includes(topicId)) {
      updateWeek(wid, { topics: [...w.topics, topicId] });
    }
  };
  const removeTopicFromWeek = (wid, topicId) => {
    const w = syllabus.weeks.find(x => x.id === wid);
    if (w) updateWeek(wid, { topics: w.topics.filter(t => t !== topicId) });
  };

  const usedTopics = syllabus.weeks.flatMap(w => w.topics);
  const available = TOPICS.filter(t => !usedTopics.includes(t.id));

  const moveWeek = (idx, dir) => {
    const ws = [...syllabus.weeks];
    const ni = idx + dir;
    if (ni < 0 || ni >= ws.length) return;
    [ws[idx], ws[ni]] = [ws[ni], ws[idx]];
    persist({ ...syllabus, weeks: ws });
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={onBack} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 20 }}>← Back</button>

      {editTitle
        ? <input autoFocus value={syllabus.title} onChange={e => setSyllabus({ ...syllabus, title: e.target.value })} onBlur={() => { editTitle && persist(syllabus); setEditTitle(false); }} onKeyDown={e => e.key === "Enter" && (persist(syllabus), setEditTitle(false))} style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: "var(--t1)", border: "none", borderBottom: "2px solid var(--brd)", background: "transparent", width: "100%", marginBottom: 6, outline: "none" }}/>
        : <h2 onClick={() => setEditTitle(true)} style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: "var(--t1)", margin: "0 0 6px", cursor: "pointer" }}>{syllabus.title} <span style={{ fontSize: 14, color: "var(--t2)" }}>✏️</span></h2>}
      <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", marginBottom: 24, lineHeight: 1.6 }}>Drag topics into weeks to build your course plan. Add notes for each week. Your syllabus is saved automatically.</p>

      {/* Available topics pool */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "var(--f)", fontSize: 13, fontWeight: 700, color: "var(--t2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Available topics</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {available.length === 0 && <p style={{ fontFamily: "var(--f)", fontSize: 13, color: "var(--t2)" }}>All topics assigned!</p>}
          {available.map(t => (
            <div key={t.id} draggable onDragStart={() => setDragItem(t.id)} style={{
              background: `${t.color}0A`, border: `1px solid ${t.color}30`, borderRadius: 10, padding: "8px 14px",
              cursor: "grab", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t1)",
            }}>
              <TopicIllustration topicId={t.id} size={24}/> {t.title}
            </div>
          ))}
        </div>
      </div>

      {/* Weeks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {syllabus.weeks.map((w, idx) => (
          <div key={w.id}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#2A9D8F"; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = "var(--brd)"; }}
            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--brd)"; if (dragItem) addTopicToWeek(w.id, dragItem); setDragItem(null); }}
            style={{ background: "var(--card)", border: "2px dashed var(--brd)", borderRadius: 14, padding: 18, transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
              <input value={w.label} onChange={e => updateWeek(w.id, { label: e.target.value })} style={{ fontFamily: "var(--f)", fontSize: 16, fontWeight: 700, color: "var(--t1)", border: "none", background: "transparent", outline: "none", minWidth: 120 }}/>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => moveWeek(idx, -1)} disabled={idx===0} style={{ background: "none", border: "1px solid var(--brd)", borderRadius: 6, padding: "3px 8px", cursor: idx===0?"default":"pointer", fontSize: 12, color: "var(--t2)", opacity: idx===0?0.3:1 }}>↑</button>
                <button onClick={() => moveWeek(idx, 1)} disabled={idx===syllabus.weeks.length-1} style={{ background: "none", border: "1px solid var(--brd)", borderRadius: 6, padding: "3px 8px", cursor: idx===syllabus.weeks.length-1?"default":"pointer", fontSize: 12, color: "var(--t2)", opacity: idx===syllabus.weeks.length-1?0.3:1 }}>↓</button>
                <button onClick={() => removeWeek(w.id)} style={{ background: "none", border: "1px solid var(--brd)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, color: "#E63946" }}>×</button>
              </div>
            </div>
            {w.topics.length === 0 && <p style={{ fontFamily: "var(--f)", fontSize: 13, color: "var(--t2)", textAlign: "center", padding: "14px 0", margin: 0 }}>Drag topics here</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: w.topics.length > 0 ? 12 : 0 }}>
              {w.topics.map(tid => {
                const t = TOPICS.find(x=>x.id===tid);
                if (!t) return null;
                return <div key={tid} style={{ background: `${t.color}12`, border: `1px solid ${t.color}30`, borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--f)", fontSize: 13, color: "var(--t1)" }}>
                  <span style={{ fontSize: 16 }}>{t.emoji}</span> {t.title}
                  <button onClick={() => removeTopicFromWeek(w.id, tid)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--t2)", padding: 0, marginLeft: 4 }}>×</button>
                </div>;
              })}
            </div>
            <textarea value={w.notes} onChange={e => updateWeek(w.id, { notes: e.target.value })} onBlur={() => persist(syllabus)} placeholder="Notes for this week..." rows={2} style={{ width: "100%", boxSizing: "border-box", fontFamily: "var(--f)", fontSize: 13, padding: 10, borderRadius: 8, border: "1px solid var(--brd)", background: "var(--bg)", color: "var(--t1)", resize: "vertical" }}/>
          </div>
        ))}
      </div>
      <button onClick={addWeek} style={{ background: "var(--card)", border: "2px dashed var(--brd)", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 14, fontWeight: 600, color: "var(--t2)", width: "100%", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor="#2A9D8F"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--brd)"}>+ Add Week</button>
    </div>
  );
}

// ─── GLOSSARY ───

function GlossaryView({ onBack }) {
  const [q, setQ] = useState("");
  const f = GLOSSARY.filter(g => g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <button onClick={onBack} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 20 }}>← Back</button>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: "var(--t1)", margin: "0 0 16px" }}>📖 Glossary</h2>
      <input type="text" placeholder="Search terms..." value={q} onChange={e => setQ(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", border: "1px solid var(--brd)", borderRadius: 10, fontFamily: "var(--f)", fontSize: 14, marginBottom: 16, background: "var(--card)", color: "var(--t1)" }}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{f.map((g,i) => <div key={i} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 12, padding: "14px 18px" }}><div style={{ fontFamily: "var(--f)", fontWeight: 700, fontSize: 15, color: "var(--t1)", marginBottom: 4 }}>{g.term}</div><div style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", lineHeight: 1.6 }}>{g.def}</div></div>)}</div>
    </div>
  );
}

// ─── MAIN APP ───

export default function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("home");
  const [selTopic, setSelTopic] = useState(null);
  const [progress, setProgress] = useState([]);
  const [journalTopic, setJournalTopic] = useState(null);
  const ref = useRef(null);

  useEffect(() => { loadStorage(STORAGE_KEYS.progress).then(d => { if (d) setProgress(d); }); }, []);
  const toggleProgress = async (id) => {
    const next = progress.includes(id) ? progress.filter(x => x !== id) : [...progress, id];
    setProgress(next); await saveStorage(STORAGE_KEYS.progress, next);
  };

  const scrollTop = () => ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  const go = (v, topic) => { setView(v); if (topic) setSelTopic(topic); scrollTop(); };

  return (
    <>
      {/* Styles loaded from index.css */}
      <div ref={ref} style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--f)" }}>
        <header style={{ background: "linear-gradient(135deg, var(--navy), var(--duke))", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 920, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🛠️</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: 17, color: "#fff" }}>AI Ethics Learning Toolkit</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {role && <ProgressRing completed={progress.length} total={TOPICS.length}/>}
              {role && <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontFamily: "var(--f)", fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{role === "student" ? "🎓 Student" : "📚 Instructor"}</div>}
              {role && <button onClick={() => { setRole(null); go("home"); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Switch</button>}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 20px 72px" }}>
          {/* ROLE SELECT */}
          {!role && (
            <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center", paddingTop: 32 }}>
              <div style={{ animation: "float 3s ease-in-out infinite", marginBottom: 12 }}>
                <svg viewBox="0 0 80 80" width="80" height="80">
                  <rect x="12" y="20" width="56" height="44" rx="8" fill="none" stroke="var(--t1)" strokeWidth="1.5" opacity="0.3"/>
                  <rect x="22" y="30" width="16" height="4" rx="2" fill="#2A9D8F" opacity="0.5"/>
                  <rect x="22" y="38" width="24" height="4" rx="2" fill="#E63946" opacity="0.4"/>
                  <rect x="22" y="46" width="20" height="4" rx="2" fill="#457B9D" opacity="0.4"/>
                  <circle cx="60" cy="42" r="8" fill="#6D597A" opacity="0.1" stroke="#6D597A" strokeWidth="1" opacity="0.3"/>
                  <path d="M30 68 L40 60 L50 68 L60 60" fill="none" stroke="var(--t1)" strokeWidth="1" opacity="0.15"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 38, fontWeight: 400, color: "var(--t1)", margin: "0 0 10px", lineHeight: 1.15 }}>AI Ethics Learning Toolkit</h1>
              <p style={{ fontFamily: "var(--f)", fontSize: 15, color: "var(--t2)", maxWidth: 500, margin: "0 auto 8px", lineHeight: 1.7 }}>Co-created by Duke University Libraries & CARADITE to engage students in critical conversations about AI.</p>
              <p style={{ fontFamily: "var(--f)", fontSize: 13, color: "var(--t2)", margin: "0 auto 36px", fontStyle: "italic" }}>Choose your pathway.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { r: "student", icon: "🎓", label: "I'm a Student", desc: "Explore topics with hands-on activities, discussions, and a reflection journal", hc: "#2A9D8F" },
                  { r: "instructor", icon: "📚", label: "I'm an Instructor", desc: "Teaching strategies, disciplinary extensions, and a syllabus builder", hc: "var(--duke)" },
                ].map(({ r, icon, label, desc, hc }) => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    background: "var(--card)", border: "2px solid var(--brd)", borderRadius: 18, padding: "32px 36px",
                    cursor: "pointer", width: 240, textAlign: "center", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = hc; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 14px 36px ${hc}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--brd)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--t1)", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontFamily: "var(--f)", fontSize: 13, color: "var(--t2)", lineHeight: 1.6 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* HOME */}
          {role && view === "home" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: "var(--t1)", margin: "0 0 4px" }}>{role === "student" ? "Explore AI Ethics" : "Teaching AI Ethics"}</h2>
                  <p style={{ fontFamily: "var(--f)", fontSize: 14, color: "var(--t2)", margin: 0 }}>{progress.length} of {TOPICS.length} topics explored</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => go("journal")} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t1)" }}>📝 Journal</button>
                  {role === "instructor" && <button onClick={() => go("syllabus")} style={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t1)" }}>📋 Syllabus Builder</button>}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ background: "var(--brd)", borderRadius: 6, height: 6, marginBottom: 28, overflow: "hidden" }}>
                <div style={{ background: "#2A9D8F", height: "100%", borderRadius: 6, width: `${(progress.length/TOPICS.length)*100}%`, transition: "width 0.5s ease" }}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
                {TOPICS.map((topic, i) => {
                  const done = progress.includes(topic.id);
                  return (
                    <button key={topic.id} onClick={() => go("topic", topic)} style={{
                      background: "transparent", border: `1.5px solid ${topic.color}${done ? "44" : "18"}`,
                      borderRadius: 14, padding: "22px 18px", cursor: "pointer", textAlign: "left",
                      transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", position: "relative", overflow: "hidden",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${topic.color}08`; e.currentTarget.style.borderColor = `${topic.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${topic.color}${done?"44":"18"}`; e.currentTarget.style.transform = "none"; }}
                    >
                      {done && <div style={{ position: "absolute", top: 10, right: 10, background: "#2A9D8F", color: "#fff", borderRadius: 10, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>✓</div>}
                      <TopicIllustration topicId={topic.id} size={48}/>
                      <div style={{ fontFamily: "var(--f)", fontWeight: 700, fontSize: 15, color: "var(--t1)", margin: "10px 0 4px", lineHeight: 1.3 }}>{topic.title}</div>
                      <div style={{ fontFamily: "var(--f)", fontSize: 12, color: "var(--t2)" }}>{topic.subtitle}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { l: "📖 Glossary", v: "glossary" },
                  { l: "📝 Journal", v: "journal" },
                  ...(role === "instructor" ? [{ l: "📋 Syllabus Builder", v: "syllabus" }] : []),
                ].map(x => (
                  <button key={x.v} onClick={() => go(x.v)} style={{
                    background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 10, padding: "12px 20px",
                    cursor: "pointer", fontFamily: "var(--f)", fontSize: 13, fontWeight: 600, color: "var(--t1)", transition: "all 0.2s",
                  }} onMouseEnter={e => e.currentTarget.style.borderColor = "#aaa"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--brd)"}>{x.l}</button>
                ))}
              </div>
            </div>
          )}

          {role && view === "topic" && selTopic && (
            <TopicView topic={selTopic} role={role} onBack={() => go("home")} onNavigate={t => go("topic", t)} progress={progress} toggleProgress={toggleProgress} onJournal={(tid) => { setJournalTopic(tid); go("journal"); }}/>
          )}
          {role && view === "glossary" && <GlossaryView onBack={() => go("home")}/>}
          {role && view === "journal" && <JournalView onBack={() => go("home")} initialTopic={journalTopic}/>}
          {role && view === "syllabus" && <SyllabusBuilder onBack={() => go("home")}/>}
        </main>

        <footer style={{ borderTop: "1px solid var(--brd)", padding: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--f)", fontSize: 12, color: "var(--t2)", margin: "0 0 2px" }}>AI Ethics Learning Toolkit · Duke University Libraries & CARADITE</p>
          <p style={{ fontFamily: "var(--f)", fontSize: 11, color: "#999", margin: 0 }}>CC BY-NC-SA · duke.is/aiethicstoolkit</p>
        </footer>
      </div>
    </>
  );
}

