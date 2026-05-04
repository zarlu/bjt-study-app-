import { useState } from "react";
import { CHAPTERS, getChapter, getQuestionsByScope } from "./chapters";

// ─── STYLES ──────────────────────────────────────────────────────────────────

const theme = {
  bg: "#0f1117",
  surface: "#1a1d27",
  surfaceHover: "#222633",
  border: "#2a2e3d",
  borderLight: "#353a4d",
  text: "#e2e4ea",
  textMuted: "#8b90a0",
  textDim: "#5c6175",
  accent: "#6c9fff",
  accentDim: "#3d6abf",
  correct: "#3dd68c",
  correctBg: "rgba(61,214,140,0.08)",
  correctBorder: "rgba(61,214,140,0.25)",
  wrong: "#ff6b7a",
  wrongBg: "rgba(255,107,122,0.08)",
  wrongBorder: "rgba(255,107,122,0.25)",
  warning: "#f0b955",
  warningBg: "rgba(240,185,85,0.08)",
  purple: "#a78bfa",
  purpleBg: "rgba(167,139,250,0.08)",
};

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────

function Badge({ children, color = theme.accent, bg = "rgba(108,159,255,0.1)" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.3px",
      color,
      background: bg,
      border: `1px solid ${color}33`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function SectionBadge({ section }) {
  return <Badge color={theme.purple} bg={theme.purpleBg}>§{section}</Badge>;
}

function CategoryBadge({ category }) {
  const colors = {
    "True/False": { c: theme.accent, b: "rgba(108,159,255,0.1)" },
    "Circuit Action": { c: theme.warning, b: theme.warningBg },
    "Self-Test": { c: theme.purple, b: theme.purpleBg },
  };
  const { c, b } = colors[category] || colors["Self-Test"];
  return <Badge color={c} bg={b}>{category}</Badge>;
}

function ChapterBadge({ chapterNumber }) {
  return <Badge color={theme.correct} bg={theme.correctBg}>Ch.{chapterNumber}</Badge>;
}

// ─── CHAPTER OVERVIEW ────────────────────────────────────────────────────────

function ChapterOverview({ chapter, expanded, onToggle }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "24px",
    }}>
      <button onClick={onToggle} style={{
        width: "100%",
        padding: "16px 20px",
        background: "none",
        border: "none",
        color: theme.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "inherit",
        fontSize: "15px",
        fontWeight: 600,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>📖</span>
          {chapter.title}
        </span>
        <span style={{
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.25s ease",
          fontSize: "12px",
          color: theme.textMuted,
        }}>▼</span>
      </button>
      {expanded && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ height: "1px", background: theme.border, marginBottom: "4px" }} />
          {chapter.sections.map(s => (
            <div key={s.id} style={{
              padding: "12px 16px",
              background: theme.bg,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: theme.accent, fontWeight: 700, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>{s.id}</span>
                <span style={{ color: theme.text, fontWeight: 600, fontSize: "14px" }}>{s.title}</span>
              </div>
              <p style={{ color: theme.textMuted, fontSize: "13px", lineHeight: 1.55, margin: 0 }}>{s.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── QUESTION CARD (Study mode) ──────────────────────────────────────────────

function QuestionCard({ q, index, showChapter }) {
  const [open, setOpen] = useState(false);
  const isTF = q.category === "True/False";

  const answerText = isTF
    ? (q.answer ? "True" : "False")
    : q.options[q.answer];

  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%",
        padding: "14px 16px",
        background: "none",
        border: "none",
        color: theme.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        textAlign: "left",
        fontFamily: "inherit",
        fontSize: "13.5px",
        lineHeight: 1.5,
      }}>
        <span style={{
          flexShrink: 0,
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          color: theme.textMuted,
          fontFamily: "'JetBrains Mono', monospace",
        }}>{index + 1}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: "8px" }}>{q.text}</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {showChapter && <ChapterBadge chapterNumber={q.chapterNumber} />}
            <CategoryBadge category={q.category} />
            <SectionBadge section={q.section} />
          </div>
        </div>
        <span style={{
          flexShrink: 0,
          fontSize: "11px",
          color: theme.textDim,
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s",
          marginTop: "4px",
        }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px 54px" }}>
          <div style={{ height: "1px", background: theme.border, marginBottom: "12px" }} />
          <div style={{
            padding: "10px 14px",
            background: theme.correctBg,
            border: `1px solid ${theme.correctBorder}`,
            borderRadius: "8px",
            marginBottom: "8px",
          }}>
            <span style={{ color: theme.correct, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Answer: </span>
            <span style={{ color: theme.correct, fontSize: "13.5px", fontWeight: 600 }}>{answerText}</span>
          </div>
          <p style={{ color: theme.textMuted, fontSize: "13px", lineHeight: 1.55, margin: 0 }}>{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── STUDY VIEW ──────────────────────────────────────────────────────────────

function Visualizer({ chapter }) {
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const questions = chapter.questions;
  const filtered = filter === "all" ? questions : questions.filter(q => q.category === filter);

  const categories = ["all", "True/False", "Circuit Action", "Self-Test"];

  return (
    <div>
      <ChapterOverview chapter={chapter} expanded={overviewOpen} onToggle={() => setOverviewOpen(!overviewOpen)} />

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {categories.map(cat => {
          const count = cat === "all" ? questions.length : questions.filter(q => q.category === cat).length;
          if (count === 0 && cat !== "all") return null;
          return (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: "7px 16px",
              borderRadius: "8px",
              border: `1px solid ${filter === cat ? theme.accent : theme.border}`,
              background: filter === cat ? "rgba(108,159,255,0.12)" : theme.surface,
              color: filter === cat ? theme.accent : theme.textMuted,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}>{cat === "all" ? `All (${count})` : `${cat} (${count})`}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((q, i) => <QuestionCard key={q.id} q={q} index={i} showChapter={false} />)}
      </div>
    </div>
  );
}

// ─── TEST MODE ───────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TestScopeSelect({ onSelect }) {
  // Step 1 of test setup: pick the chapter scope
  const scopes = [
    ...CHAPTERS.map(ch => ({
      key: ch.id,
      icon: ch.icon,
      label: `Chapter ${ch.number} — ${ch.shortTitle}`,
      desc: ch.title.replace(/^Chapter \d+ — /, ""),
      count: ch.questions.length,
    })),
    {
      key: "all",
      icon: "🎯",
      label: "All Chapters",
      desc: "Cumulative review across every chapter — midterm prep",
      count: CHAPTERS.reduce((sum, ch) => sum + ch.questions.length, 0),
    },
  ];

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "40px" }}>
      <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: 700, marginBottom: "6px", textAlign: "center" }}>Test Mode</h2>
      <p style={{ color: theme.textMuted, fontSize: "14px", textAlign: "center", marginBottom: "32px" }}>Step 1 of 2 — choose chapter scope</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {scopes.map(s => (
          <button key={s.key} onClick={() => onSelect(s.key)} style={{
            padding: "18px 20px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: theme.text,
            fontFamily: "inherit",
            textAlign: "left",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accentDim; e.currentTarget.style.background = theme.surfaceHover; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
          >
            <span style={{ fontSize: "24px", width: "40px", textAlign: "center" }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "12.5px", color: theme.textMuted }}>{s.desc}</div>
            </div>
            <span style={{
              padding: "4px 12px",
              borderRadius: "999px",
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              fontSize: "13px",
              fontWeight: 700,
              color: theme.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{s.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TestCategorySelect({ scope, onSelect, onBack }) {
  // Step 2 of test setup: pick category within the chosen scope
  const pool = getQuestionsByScope(scope);
  const cats = [
    { key: "True/False", icon: "✓✗", desc: "True or False statements" },
    { key: "Circuit Action", icon: "⚡", desc: "Predict circuit behavior changes" },
    { key: "Self-Test", icon: "📝", desc: "Multiple choice from all sections" },
    { key: "all", icon: "🎯", desc: "Everything combined & shuffled" },
  ].map(c => ({
    ...c,
    count: c.key === "all" ? pool.length : pool.filter(q => q.category === c.key).length,
  })).filter(c => c.count > 0);

  const scopeLabel = scope === "all"
    ? "All Chapters"
    : `Chapter ${getChapter(scope).number} — ${getChapter(scope).shortTitle}`;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "40px" }}>
      <button onClick={onBack} style={{
        background: "none",
        border: "none",
        color: theme.textMuted,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "13px",
        fontWeight: 600,
        marginBottom: "12px",
        padding: "4px 0",
      }}>← Back</button>
      <h2 style={{ color: theme.text, fontSize: "22px", fontWeight: 700, marginBottom: "6px", textAlign: "center" }}>Test Mode</h2>
      <p style={{ color: theme.textMuted, fontSize: "14px", textAlign: "center", marginBottom: "8px" }}>Step 2 of 2 — choose categories</p>
      <p style={{ color: theme.accent, fontSize: "13px", textAlign: "center", marginBottom: "32px", fontWeight: 600 }}>Scope: {scopeLabel}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {cats.map(c => (
          <button key={c.key} onClick={() => onSelect(c.key)} style={{
            padding: "18px 20px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: theme.text,
            fontFamily: "inherit",
            textAlign: "left",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accentDim; e.currentTarget.style.background = theme.surfaceHover; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
          >
            <span style={{ fontSize: "24px", width: "40px", textAlign: "center" }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{c.key === "all" ? "All Questions" : c.key}</div>
              <div style={{ fontSize: "12.5px", color: theme.textMuted }}>{c.desc}</div>
            </div>
            <span style={{
              padding: "4px 12px",
              borderRadius: "999px",
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              fontSize: "13px",
              fontWeight: 700,
              color: theme.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TestQuestion({ q, qIndex, total, onAnswer, showChapter }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const isTF = q.category === "True/False";

  const options = isTF
    ? [{ label: "True", value: true }, { label: "False", value: false }]
    : q.options.map((o, i) => ({ label: o, value: i }));

  const correctValue = q.answer;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onAnswer(selected === correctValue);
    }, 1200);
  };

  const isCorrect = selected === correctValue;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {showChapter && <ChapterBadge chapterNumber={q.chapterNumber} />}
          <CategoryBadge category={q.category} />
          <SectionBadge section={q.section} />
        </div>
        <span style={{ color: theme.textMuted, fontSize: "13px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
          {qIndex + 1}/{total}
        </span>
      </div>

      <div style={{ height: "3px", background: theme.border, borderRadius: "99px", marginBottom: "28px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((qIndex + 1) / total) * 100}%`,
          background: theme.accent,
          borderRadius: "99px",
          transition: "width 0.4s ease",
        }} />
      </div>

      <h3 style={{ color: theme.text, fontSize: "17px", fontWeight: 600, lineHeight: 1.55, marginBottom: "24px" }}>{q.text}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
        {options.map((opt, i) => {
          const isThis = selected === opt.value;
          const showCorrect = confirmed && opt.value === correctValue;
          const showWrong = confirmed && isThis && !isCorrect;

          let borderColor = theme.border;
          let bg = theme.surface;
          let textColor = theme.text;
          if (!confirmed && isThis) { borderColor = theme.accent; bg = "rgba(108,159,255,0.08)"; }
          if (showCorrect) { borderColor = theme.correctBorder; bg = theme.correctBg; textColor = theme.correct; }
          if (showWrong) { borderColor = theme.wrongBorder; bg = theme.wrongBg; textColor = theme.wrong; }

          return (
            <button key={i} onClick={() => !confirmed && setSelected(opt.value)} disabled={confirmed} style={{
              padding: "14px 16px",
              background: bg,
              border: `1.5px solid ${borderColor}`,
              borderRadius: "10px",
              color: textColor,
              cursor: confirmed ? "default" : "pointer",
              fontFamily: "inherit",
              fontSize: "14px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.15s",
              opacity: confirmed && !showCorrect && !showWrong ? 0.4 : 1,
            }}>
              <span style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                border: `1.5px solid ${isThis && !confirmed ? theme.accent : showCorrect ? theme.correct : showWrong ? theme.wrong : theme.borderLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: theme.textDim,
                background: showCorrect ? theme.correctBg : showWrong ? theme.wrongBg : "transparent",
                fontFamily: "'JetBrains Mono', monospace",
                flexShrink: 0,
              }}>
                {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + i)}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {!confirmed && (
        <button onClick={handleConfirm} disabled={selected === null} style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: selected !== null ? theme.accent : theme.border,
          color: selected !== null ? "#0f1117" : theme.textDim,
          cursor: selected !== null ? "pointer" : "not-allowed",
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}>Confirm</button>
      )}

      {confirmed && (
        <div style={{
          padding: "12px 16px",
          background: isCorrect ? theme.correctBg : theme.wrongBg,
          border: `1px solid ${isCorrect ? theme.correctBorder : theme.wrongBorder}`,
          borderRadius: "10px",
          color: isCorrect ? theme.correct : theme.wrong,
          fontSize: "13.5px",
          fontWeight: 600,
          textAlign: "center",
        }}>{isCorrect ? "Correct!" : "Incorrect"}</div>
      )}
    </div>
  );
}

function TestResults({ questions, answers, onRestart, onMenu, showChapter }) {
  const wrong = questions.map((q, i) => ({ ...q, userCorrect: answers[i] })).filter(r => !r.userCorrect);
  const score = answers.filter(Boolean).length;
  const total = answers.length;
  const pct = Math.round((score / total) * 100);

  // Group wrong answers by chapter then section
  const grouped = {};
  wrong.forEach(q => {
    const chKey = q.chapterId || "unknown";
    if (!grouped[chKey]) grouped[chKey] = {};
    if (!grouped[chKey][q.section]) grouped[chKey][q.section] = [];
    grouped[chKey][q.section].push(q);
  });

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "32px", paddingTop: "20px" }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: `4px solid ${pct >= 90 ? theme.correct : pct >= 70 ? theme.warning : theme.wrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "28px",
          fontWeight: 800,
          color: pct >= 90 ? theme.correct : pct >= 70 ? theme.warning : theme.wrong,
          fontFamily: "'JetBrains Mono', monospace",
        }}>{pct}%</div>
        <h2 style={{ color: theme.text, fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
          {pct === 100 ? "Perfect Score! 🎉" : pct >= 90 ? "Great Job!" : pct >= 70 ? "Good Effort" : "Keep Practicing"}
        </h2>
        <p style={{ color: theme.textMuted, fontSize: "14px" }}>{score} of {total} correct</p>
      </div>

      {wrong.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h3 style={{ color: theme.wrong, fontSize: "14px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Questions to Review ({wrong.length})
          </h3>

          {Object.entries(grouped).sort().map(([chKey, sections]) => {
            const chapter = getChapter(chKey);
            return (
              <div key={chKey} style={{ marginBottom: "20px" }}>
                {showChapter && chapter && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${theme.border}`,
                  }}>
                    <span style={{ fontSize: "16px" }}>{chapter.icon}</span>
                    <span style={{ color: theme.text, fontWeight: 700, fontSize: "14px" }}>{chapter.title}</span>
                  </div>
                )}
                {Object.entries(sections).sort(([a], [b]) => a.localeCompare(b)).map(([sec, qs]) => {
                  const sectionMeta = chapter?.sections.find(s => s.id === sec);
                  return (
                    <div key={sec} style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <SectionBadge section={sec} />
                        <span style={{ color: theme.textMuted, fontSize: "12px" }}>{sectionMeta?.title}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {qs.map(q => (
                          <div key={q.id} style={{
                            padding: "12px 14px",
                            background: theme.wrongBg,
                            border: `1px solid ${theme.wrongBorder}`,
                            borderRadius: "8px",
                          }}>
                            <p style={{ color: theme.text, fontSize: "13px", margin: "0 0 8px", lineHeight: 1.45 }}>{q.text}</p>
                            <p style={{ color: theme.correct, fontSize: "12.5px", margin: 0, fontWeight: 600 }}>
                              ✓ {q.category === "True/False" ? (q.answer ? "True" : "False") : q.options[q.answer]}
                            </p>
                            <p style={{ color: theme.textMuted, fontSize: "12px", margin: "4px 0 0", lineHeight: 1.45 }}>{q.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onRestart} style={{
          flex: 1,
          padding: "14px",
          borderRadius: "10px",
          border: `1.5px solid ${theme.accent}`,
          background: "transparent",
          color: theme.accent,
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "inherit",
        }}>Restart</button>
        <button onClick={onMenu} style={{
          flex: 1,
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: theme.accent,
          color: "#0f1117",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "inherit",
        }}>Menu</button>
      </div>
    </div>
  );
}

function TestMode() {
  const [phase, setPhase] = useState("scope"); // scope, category, testing, results
  const [scope, setScope] = useState(null);
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const isCrossChapter = scope === "all";

  const startTest = (cat) => {
    let pool = getQuestionsByScope(scope);
    if (cat !== "all") pool = pool.filter(q => q.category === cat);
    setCategory(cat);
    setQuestions(shuffle(pool));
    setAnswers([]);
    setCurrentIndex(0);
    setPhase("testing");
  };

  const handleAnswer = (correct) => {
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    if (currentIndex + 1 >= questions.length) {
      setTimeout(() => setPhase("results"), 200);
    } else {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    }
  };

  if (phase === "scope") return (
    <TestScopeSelect onSelect={s => { setScope(s); setPhase("category"); }} />
  );

  if (phase === "category") return (
    <TestCategorySelect
      scope={scope}
      onSelect={startTest}
      onBack={() => setPhase("scope")}
    />
  );

  if (phase === "results") return (
    <TestResults
      questions={questions}
      answers={answers}
      showChapter={isCrossChapter}
      onRestart={() => startTest(category)}
      onMenu={() => { setPhase("scope"); setScope(null); setCategory(null); }}
    />
  );

  return (
    <TestQuestion
      key={currentIndex}
      q={questions[currentIndex]}
      qIndex={currentIndex}
      total={questions.length}
      onAnswer={handleAnswer}
      showChapter={isCrossChapter}
    />
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("study");
  const [activeChapterId, setActiveChapterId] = useState(CHAPTERS[0].id);
  const activeChapter = getChapter(activeChapterId);

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(15,17,23,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "12px 20px" }}>
          {/* Top row: brand + study/test toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tab === "study" ? "10px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>🎓</span>
              <span style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px" }}>Devices Mastery</span>
              <span style={{ color: theme.textDim, fontSize: "12px", fontWeight: 500 }}>Midterm Prep</span>
            </div>
            <div style={{
              display: "flex",
              gap: "2px",
              background: theme.surface,
              borderRadius: "8px",
              padding: "3px",
              border: `1px solid ${theme.border}`,
            }}>
              {[
                { key: "study", label: "📚 Study" },
                { key: "test", label: "🧪 Test" },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: tab === t.key ? theme.accent : "transparent",
                  color: tab === t.key ? "#0f1117" : theme.textMuted,
                  cursor: "pointer",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Chapter selector — only shown in study tab */}
          {tab === "study" && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {CHAPTERS.map(ch => (
                <button key={ch.id} onClick={() => setActiveChapterId(ch.id)} style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: `1px solid ${activeChapterId === ch.id ? theme.accent : theme.border}`,
                  background: activeChapterId === ch.id ? "rgba(108,159,255,0.12)" : "transparent",
                  color: activeChapterId === ch.id ? theme.accent : theme.textMuted,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <span>{ch.icon}</span>
                  Ch.{ch.number} — {ch.shortTitle}
                  <span style={{
                    fontSize: "10px",
                    color: theme.textDim,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{ch.questions.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 20px 60px" }}>
        {tab === "study" && <Visualizer chapter={activeChapter} />}
        {tab === "test" && <TestMode />}
      </div>
    </div>
  );
}
