import { useState } from "react";

interface MoodLog {
  logged_date: string;
  mood: string;
}

interface Props {
  moodLogs: MoodLog[];
  onLogMood: (data: { mood: string; note?: string }) => void;
}

const MOODS = [
  { key: "happy",    label: "Great",   emoji: "😄", color: "#22c55e" },
  { key: "good",     label: "Good",    emoji: "🙂", color: "#84cc16" },
  { key: "neutral",  label: "Neutral", emoji: "😐", color: "#eab308" },
  { key: "sad",      label: "Bad",     emoji: "😞", color: "#f97316" },
  { key: "stressed", label: "Terrible",emoji: "😢", color: "#ef4444" },
];

const MOOD_COLOR: Record<string, string> = {
  happy:    "#22c55e",
  good:     "#84cc16",
  neutral:  "#eab308",
  sad:      "#f97316",
  stressed: "#ef4444",
};

export default function MoodCalendarView({ moodLogs, onLogMood }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const alreadyLoggedToday = moodLogs.some((m) => m.logged_date === today);

  const handleLog = async () => {
    if (!selectedMood) return;
    setIsLogging(true);
    try {
      await onLogMood({ mood: selectedMood });
      setSelectedMood(null);
    } finally {
      setIsLogging(false);
    }
  };

  // Build last-30-days grid
  const days: { date: string; dayNum: number; mood?: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = moodLogs.find((m) => m.logged_date === dateStr);
    days.push({ date: dateStr, dayNum: d.getDate(), mood: log?.mood });
  }

  // Pad front so first day aligns to correct weekday (Sun=0)
  const firstDow = new Date(days[0].date).getDay();
  const paddedDays: (typeof days[0] | null)[] = [
    ...Array(firstDow).fill(null),
    ...days,
  ];

  // Stats
  const moodCounts: Record<string, number> = {};
  moodLogs.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Mood Logger */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-foreground">How are you feeling today?</h3>
          <p className="text-sm text-muted-foreground">Log your mood once a day</p>
        </div>

        {alreadyLoggedToday ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-medium text-emerald-400">Mood logged for today!</p>
              <p className="text-xs text-muted-foreground">Come back tomorrow to log again.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-4">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMood(m.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    selectedMood === m.key
                      ? "border-primary scale-110 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleLog}
              disabled={!selectedMood || isLogging}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${
                selectedMood
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              {isLogging ? "Logging..." : "Log Mood"}
            </button>
          </>
        )}
      </div>

      {/* Mood Calendar */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Mood Calendar — Last 30 Days</h3>
          <p className="text-sm text-muted-foreground">See how your mood has changed over the past month</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {MOODS.map((m) => (
            <span key={m.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
              {d}
            </div>
          ))}
          {paddedDays.map((day, i) =>
            day === null ? (
              <div key={`pad-${i}`} />
            ) : (
              <div
                key={day.date}
                title={day.mood ? `${day.date}: ${day.mood}` : day.date}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  day.date === today
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    : ""
                }`}
                style={{
                  backgroundColor: day.mood
                    ? MOOD_COLOR[day.mood] + "33"
                    : "rgba(255,255,255,0.05)",
                  color: day.mood ? MOOD_COLOR[day.mood] : undefined,
                  borderWidth: day.mood ? 1 : 0,
                  borderColor: day.mood ? MOOD_COLOR[day.mood] + "66" : undefined,
                  borderStyle: "solid",
                }}
              >
                {day.dayNum}
              </div>
            )
          )}
        </div>

        {/* Stats */}
        {moodLogs.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 pt-2">
            {MOODS.map((m) => (
              <div key={m.key} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/20">
                <span className="text-xl">{m.emoji}</span>
                <span className="text-base font-bold text-foreground">{moodCounts[m.key] ?? 0}</span>
                <span className="text-xs text-muted-foreground text-center leading-tight">{m.label} days</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No moods logged yet — start by logging today's mood above! 😊
          </div>
        )}
      </div>
    </div>
  );
}
