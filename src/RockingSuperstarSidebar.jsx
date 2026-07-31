import React, { useState, useEffect, useRef } from "react";
import {
Crown,
Play,
Pause,
Volume2,
Trophy,
CalendarDays,
BarChart3,
Send,
CheckCircle2,
Sparkles,
Inbox,
ChevronDown,
Loader2,
AlertCircle,
} from "lucide-react";

// ---- Mock data: swap this array with your API response later. ----
// Expected shape per member: { id, name, rating, joinedDaysAgo }
const MOCK_RECENT_MEMBERS = [
{ id: 1, name: "Ishaan Verma", rating: 1842, joinedDaysAgo: 1 },
{ id: 2, name: "Meera Kapoor", rating: 1765, joinedDaysAgo: 3 },
{ id: 3, name: "Aarav Sinha", rating: 1601, joinedDaysAgo: 6 },
];

const ANTHEM_LINES = [
"We push the pawns, we hold the line,",
"eight by eight, the board's our shrine.",
"Rock the clock, don't blink, don't bend —",
"Rocking Superstars, checkmate's our friend.",
];

const CHESS_QUOTE = {
text: "Every chess master was once a beginner.",
author: "Irving Chernev",
};

function RankBadge({ rank }) {
const styles = {
1: { bg: "#E8B54D", fg: "#1A1420" },
2: { bg: "#CBD1DC", fg: "#1A1420" },
3: { bg: "#C98A52", fg: "#1A1420" },
};
const s = styles[rank];
return (
<span
className="flex items-center justify-center rounded-full font-bold shrink-0"
style={{
width: 24,
height: 24,
fontSize: 12,
background: s.bg,
color: s.fg,
fontFamily: "'JetBrains Mono', monospace",
}}

> 

{rank}
</span>
);
}

export default function RockingSuperstarSidebar() {
const [isPlaying, setIsPlaying] = useState(false);
const [progress, setProgress] = useState(18);
const intervalRef = useRef(null);

const [report, setReport] = useState("");
const [sent, setSent] = useState(false);
const [sendError, setSendError] = useState(false);

const [showReports, setShowReports] = useState(false);
const [reports, setReports] = useState([]);
const [loadingReports, setLoadingReports] = useState(false);
const [loadError, setLoadError] = useState(false);

useEffect(() => {
if (isPlaying) {
intervalRef.current = setInterval(() => {
setProgress((p) => (p >= 100 ? 0 : p + 1));
}, 450);
} else {
clearInterval(intervalRef.current);
}
return () => clearInterval(intervalRef.current);
}, [isPlaying]);

const totalSeconds = 154; // 2:34 anthem length (mock)
const currentSeconds = Math.floor((progress / 100) * totalSeconds);
const fmt = (s) => ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")};

const activeLineIndex = Math.min(
ANTHEM_LINES.length - 1,
Math.floor((progress / 100) * ANTHEM_LINES.length)
);

const handleReportSubmit = async () => {
if (!report.trim()) return;
const entry = { text: report.trim(), timestamp: Date.now() };
try {
const key = reports:${entry.timestamp};
const result = await window.storage.set(key, JSON.stringify(entry), false);
if (!result) throw new Error("Storage returned no result");
setSent(true);
setSendError(false);
setReport("");
// keep an already-open panel in sync
if (showReports) setReports((prev) => [entry, ...prev]);
setTimeout(() => setSent(false), 2600);
} catch (err) {
console.error("Failed to save report:", err);
setSendError(true);
setTimeout(() => setSendError(false), 3000);
}
};

const loadReports = async () => {
setLoadingReports(true);
setLoadError(false);
try {
const list = await window.storage.list("reports:", false);
const keys = list && list.keys ? list.keys : [];
const items = [];
for (const key of keys) {
try {
const res = await window.storage.get(key, false);
if (res && res.value) items.push(JSON.parse(res.value));
} catch (_) {
// skip unreadable entries
}
}
items.sort((a, b) => b.timestamp - a.timestamp);
setReports(items);
} catch (err) {
console.error("Failed to load reports:", err);
setLoadError(true);
} finally {
setLoadingReports(false);
}
};

const toggleReports = () => {
const next = !showReports;
setShowReports(next);
if (next) loadReports();
};

const formatTimestamp = (ts) => {
const d = new Date(ts);
return d.toLocaleString(undefined, {
month: "short",
day: "numeric",
hour: "numeric",
minute: "2-digit",
});
};

return (

<div  
className="w-full max-w-xs mx-auto flex flex-col"  
style={{  
fontFamily: "'Inter', sans-serif",  
background: "#151320",  
color: "#F3EFE6",  
borderRadius: 20,  
overflow: "hidden",  
border: "1px solid rgba(255,255,255,0.08)",  
boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",  
}}  
>  
<style>{  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');   .rst-scroll::-webkit-scrollbar { width: 4px; }   .rst-scroll::-webkit-scrollbar-thumb { background: rgba(232,181,77,0.4); border-radius: 4px; }   @keyframes rst-pulse {   0%, 100% { opacity: 0.55; transform: scaleY(0.4); }   50% { opacity: 1; transform: scaleY(1); }   }   @keyframes rst-glow {   0%, 100% { opacity: 0.5; }   50% { opacity: 0.9; }   }   .rst-bar { animation: rst-pulse 1.1s ease-in-out infinite; transform-origin: bottom; }  }</style>  {/* ---------- Header: club badge ---------- */}

  <div    
    className="relative px-5 pt-6 pb-5"    
    style={{    
      background:    
        "radial-gradient(120% 140% at 15% 0%, rgba(214,69,95,0.35) 0%, rgba(21,19,32,0) 55%), linear-gradient(180deg, #1E1B2C 0%, #151320 100%)",    
      borderBottom: "1px solid rgba(255,255,255,0.07)",    
    }}    
  >    
    <div    
      className="absolute inset-0 opacity-[0.06] pointer-events-none"    
      style={{    
        backgroundImage:    
          "repeating-conic-gradient(#F3EFE6 0% 25%, transparent 0% 50%)",    
        backgroundSize: "16px 16px",    
      }}    
    />    
    <div className="relative flex items-center gap-3">    
      <div    
        className="flex items-center justify-center rounded-xl shrink-0"    
        style={{    
          width: 46,    
          height: 46,    
          background: "linear-gradient(145deg, #E8B54D, #C98A3A)",    
          boxShadow: "0 6px 18px -4px rgba(232,181,77,0.55)",    
        }}    
      >    
        <Crown size={24} color="#1A1420" strokeWidth={2.4} />    
      </div>    
      <div>    
        <p    
          className="leading-none"    
          style={{    
            fontFamily: "'Bebas Neue', sans-serif",    
            fontSize: 26,    
            letterSpacing: "0.03em",    
            color: "#F3EFE6",    
          }}    
        >    
          ROCKING SUPERSTAR    
        </p>    
        <p    
          className="leading-none mt-1"    
          style={{    
            fontFamily: "'Bebas Neue', sans-serif",    
            fontSize: 15,    
            letterSpacing: "0.3em",    
            color: "#E8B54D",    
          }}    
        >    
          TEAM    
        </p>    
      </div>    
    </div>    
    <div className="relative flex items-center gap-1.5 mt-3">    
      <Sparkles size={12} color="#D6455F" />    
      <span style={{ fontSize: 11, color: "#948FA3", letterSpacing: "0.04em" }}>    
        Est. club &middot; Play loud, think louder    
      </span>    
    </div>    
  </div>      <div className="rst-scroll overflow-y-auto" style={{ maxHeight: 640 }}>    
    {/* ---------- Owner profile ---------- */}    
    <div className="px-5 pt-5 pb-4 flex items-center gap-3">    
      <div    
        className="flex items-center justify-center rounded-full shrink-0 font-semibold"    
        style={{    
          width: 48,    
          height: 48,    
          background: "linear-gradient(145deg, #D6455F, #8B3A5A)",    
          fontSize: 17,    
          fontFamily: "'Bebas Neue', sans-serif",    
          letterSpacing: "0.02em",    
        }}    
      >    
        RK    
      </div>    
      <div className="min-w-0">    
        <p className="font-semibold truncate" style={{ fontSize: 15 }}>    
          Rehan Khurana    
        </p>    
        <p style={{ fontSize: 12, color: "#948FA3" }}>Founder &amp; Club Captain</p>    
      </div>    
      <span    
        className="ml-auto text-[10px] px-2 py-1 rounded-full font-semibold shrink-0"    
        style={{    
          background: "rgba(232,181,77,0.14)",    
          color: "#E8B54D",    
          fontFamily: "'JetBrains Mono', monospace",    
        }}    
      >    
        2104    
      </span>    
    </div>    {/* ---------- Quote ---------- */}    
<div className="px-5 pb-4">    
  <div    
    className="rounded-xl px-4 py-3"    
    style={{    
      background: "rgba(255,255,255,0.03)",    
      borderLeft: "3px solid #E8B54D",    
    }}    
  >    
    <p style={{ fontSize: 13, lineHeight: 1.5, fontStyle: "italic", color: "#EDE9DE" }}>    
      &ldquo;{CHESS_QUOTE.text}&rdquo;    
    </p>    
    <p style={{ fontSize: 11, color: "#948FA3", marginTop: 6 }}>    
      — {CHESS_QUOTE.author}    
    </p>    
  </div>    
</div>    

{/* ---------- Anthem audio player ---------- */}    
<div className="px-5 pb-4">    
  <p    
    className="mb-2"    
    style={{    
      fontSize: 11,    
      letterSpacing: "0.12em",    
      color: "#948FA3",    
      fontWeight: 600,    
    }}    
  >    
    CLUB ANTHEM    
  </p>    
  <div    
    className="rounded-xl p-3"    
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}    
  >    
    <div className="flex items-center gap-3">    
      <button    
        onClick={() => setIsPlaying((p) => !p)}    
        aria-label={isPlaying ? "Pause anthem" : "Play anthem"}    
        className="flex items-center justify-center rounded-full shrink-0"    
        style={{    
          width: 36,    
          height: 36,    
          background: "#E8B54D",    
          color: "#1A1420",    
        }}    
      >    
        {isPlaying ? <Pause size={16} fill="#1A1420" /> : <Play size={16} fill="#1A1420" style={{ marginLeft: 2 }} />}    
      </button>    

      <div className="flex-1 min-w-0">    
        <div className="flex items-end gap-[3px]" style={{ height: 20 }}>    
          {Array.from({ length: 22 }).map((_, i) => {    
            const h = 6 + ((i * 37) % 14);    
            return (    
              <div    
                key={i}    
                className="rst-bar"    
                style={{    
                  width: 2.5,    
                  height: h,    
                  borderRadius: 2,    
                  background: i / 22 <= progress / 100 ? "#D6455F" : "rgba(255,255,255,0.14)",    
                  animationPlayState: isPlaying ? "running" : "paused",    
                  animationDelay: `${i * 0.05}s`,    
                }}    
              />    
            );    
          })}    
        </div>    
        <div className="flex justify-between mt-1">    
          <span style={{ fontSize: 10, color: "#948FA3", fontFamily: "'JetBrains Mono', monospace" }}>    
            {fmt(currentSeconds)}    
          </span>    
          <span style={{ fontSize: 10, color: "#948FA3", fontFamily: "'JetBrains Mono', monospace" }}>    
            {fmt(totalSeconds)}    
          </span>    
        </div>    
      </div>    
      <Volume2 size={15} color="#948FA3" className="shrink-0" />    
    </div>    

    <p    
      style={{    
        fontSize: 11.5,    
        color: "#CFC9DE",    
        marginTop: 10,    
        fontStyle: "italic",    
        lineHeight: 1.5,    
        minHeight: 32,    
      }}    
    >    
      {ANTHEM_LINES[activeLineIndex]}    
    </p>    
  </div>    
</div>    

{/* ---------- Recently joined ---------- */}    
<div className="px-5 pb-4">    
  <p    
    className="mb-2"    
    style={{ fontSize: 11, letterSpacing: "0.12em", color: "#948FA3", fontWeight: 600 }}    
  >    
    NEW RECRUITS    
  </p>    
  <div className="flex flex-col gap-2">    
    {MOCK_RECENT_MEMBERS.map((m, i) => (    
      <div    
        key={m.id}    
        className="flex items-center gap-2.5 rounded-lg px-3 py-2"    
        style={{ background: "rgba(255,255,255,0.03)" }}    
      >    
        <RankBadge rank={i + 1} />    
        <div className="min-w-0 flex-1">    
          <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>    
            {m.name}    
          </p>    
          <p style={{ fontSize: 10.5, color: "#948FA3" }}>    
            joined {m.joinedDaysAgo}d ago    
          </p>    
        </div>    
        <span    
          style={{    
            fontSize: 12.5,    
            fontFamily: "'JetBrains Mono', monospace",    
            color: "#E8B54D",    
            fontWeight: 600,    
          }}    
        >    
          {m.rating}    
        </span>    
      </div>    
    ))}    
  </div>    
</div>    

{/* ---------- Action buttons ---------- */}    
<div className="px-5 pb-4 grid grid-cols-2 gap-2.5">    
  <button    
    className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-semibold"    
    style={{    
      background: "linear-gradient(135deg, #D6455F, #A6395A)",    
      fontSize: 12.5,    
      color: "#F3EFE6",    
    }}    
  >    
    <CalendarDays size={14} />    
    Join Events    
  </button>    
  <button    
    className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-semibold"    
    style={{    
      background: "rgba(255,255,255,0.06)",    
      border: "1px solid rgba(255,255,255,0.12)",    
      fontSize: 12.5,    
      color: "#F3EFE6",    
    }}    
  >    
    <Trophy size={14} color="#E8B54D" />    
    Leaderboard    
  </button>    
</div>    

{/* ---------- Report box ---------- */}    
<div className="px-5 pb-5">    
  <div    
    className="rounded-xl p-3"    
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}    
  >    
    <p style={{ fontSize: 11.5, color: "#948FA3", marginBottom: 6, fontWeight: 500 }}>    
      Report an issue to the club owner    
    </p>    
    <textarea    
      value={report}    
      onChange={(e) => setReport(e.target.value)}    
      placeholder="Something off with a match, a rating, or a member? Tell us..."    
      rows={2}    
      className="w-full resize-none outline-none"    
      style={{    
        background: "rgba(0,0,0,0.25)",    
        border: "1px solid rgba(255,255,255,0.08)",    
        borderRadius: 8,    
        padding: "8px 10px",    
        fontSize: 12,    
        color: "#F3EFE6",    
        fontFamily: "'Inter', sans-serif",    
      }}    
    />    
    <button    
      onClick={handleReportSubmit}    
      className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold"    
      style={{    
        background: sendError ? "rgba(214,69,95,0.18)" : sent ? "rgba(232,181,77,0.18)" : "#E8B54D",    
        color: sendError ? "#D6455F" : sent ? "#E8B54D" : "#1A1420",    
        fontSize: 12.5,    
        transition: "all 0.2s ease",    
      }}    
    >    
      {sendError ? (    
        <>    
          <AlertCircle size={14} /> Couldn't send, try again    
        </>    
      ) : sent ? (    
        <>    
          <CheckCircle2 size={14} /> Report sent    
        </>    
      ) : (    
        <>    
          <Send size={13} /> Send report    
        </>    
      )}    
    </button>    

    <button    
      onClick={toggleReports}    
      className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5"    
      style={{    
        background: "transparent",    
        color: "#948FA3",    
        fontSize: 11,    
        fontWeight: 500,    
      }}    
    >    
      <Inbox size={12} />    
      {showReports ? "Hide past reports" : "View past reports"}    
      <ChevronDown    
        size={12}    
        style={{    
          transform: showReports ? "rotate(180deg)" : "rotate(0deg)",    
          transition: "transform 0.2s ease",    
        }}    
      />    
    </button>    

    {showReports && (    
      <div    
        className="mt-2 pt-2 flex flex-col gap-2"    
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", maxHeight: 180, overflowY: "auto" }}    
      >    
        {loadingReports ? (    
          <div className="flex items-center justify-center gap-2 py-3" style={{ color: "#948FA3", fontSize: 11.5 }}>    
            <Loader2 size={13} className="animate-spin" /> Loading reports…    
          </div>    
        ) : loadError ? (    
          <div className="flex items-center justify-center gap-2 py-3" style={{ color: "#D6455F", fontSize: 11.5 }}>    
            <AlertCircle size={13} /> Couldn't load reports    
          </div>    
        ) : reports.length === 0 ? (    
          <p className="text-center py-3" style={{ color: "#948FA3", fontSize: 11.5 }}>    
            No reports yet.    
          </p>    
        ) : (    
          reports.map((r) => (    
            <div    
              key={r.timestamp}    
              className="rounded-lg px-3 py-2"    
              style={{ background: "rgba(0,0,0,0.25)" }}    
            >    
              <p style={{ fontSize: 12, color: "#EDE9DE", lineHeight: 1.45 }}>{r.text}</p>    
              <p style={{ fontSize: 10, color: "#948FA3", marginTop: 4 }}>    
                {formatTimestamp(r.timestamp)}    
              </p>    
            </div>    
          ))    
        )}    
      </div>    
    )}    
  </div>    
</div>

  </div>    
</div>  );
}
