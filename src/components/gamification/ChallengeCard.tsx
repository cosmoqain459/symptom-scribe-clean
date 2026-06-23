import { CheckCircle2, Clock, Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description?: string;
  duration_days: number;
  target_value: number;
  unit: string;
  icon?: string;
  color?: string;
}

interface UserChallenge {
  id: string;
  status: string;
  streak_count: number;
  best_streak: number;
  last_checked_in?: string;
}

interface Props {
  challenge: Challenge;
  userChallenge?: UserChallenge;
  onJoin: () => void;
  onCheckIn: () => void;
}

export default function ChallengeCard({ challenge, userChallenge, onJoin, onCheckIn }: Props) {
  const isJoined = !!userChallenge;
  const isCompleted = userChallenge?.status === "completed";
  const streak = userChallenge?.streak_count ?? 0;
  const progress = Math.min((streak / challenge.duration_days) * 100, 100);

  const today = new Date().toISOString().split("T")[0];
  const checkedInToday = userChallenge?.last_checked_in === today;

  const accentColor = challenge.color ?? "#5DCAA5";

  return (
    <div
      className="relative rounded-xl border border-border bg-card p-5 flex flex-col gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{challenge.icon ?? "🏆"}</span>
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {challenge.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>
        {isCompleted && (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {challenge.duration_days} days
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {challenge.target_value} {challenge.unit}/day
        </span>
      </div>

      {/* Progress */}
      {isJoined && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Day {streak} of {challenge.duration_days}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isJoined ? (
        <button
          onClick={onJoin}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Join Challenge
        </button>
      ) : isCompleted ? (
        <div className="w-full py-2 px-4 rounded-lg text-sm font-medium text-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          ✅ Completed!
        </div>
      ) : checkedInToday ? (
        <div className="w-full py-2 px-4 rounded-lg text-sm font-medium text-center text-muted-foreground bg-muted/40 border border-border">
          ✓ Checked in today
        </div>
      ) : (
        <button
          onClick={onCheckIn}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Check In Today 🔥
        </button>
      )}
    </div>
  );
}
