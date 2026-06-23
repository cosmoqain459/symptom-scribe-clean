import { useState } from "react";
import { Trophy, Flame, Award, Smile } from "lucide-react";
import ChallengeCard from "@/components/gamification/ChallengeCard";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import MoodCalendarView from "@/components/gamification/MoodCalendarView";
import {
  useChallenges,
  useUserChallenges,
  useJoinChallenge,
  useCheckInChallenge,
  useUserBadges,
  useMoodLogs,
  useLogMood,
} from "@/hooks/useGamification";

type Tab = "challenges" | "mood" | "badges";

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("challenges");

  const { data: challenges = [], isLoading: loadingChallenges } = useChallenges();
  const { data: userChallenges = [] } = useUserChallenges();
  const { data: userBadges = [] } = useUserBadges();
  const { data: moodLogs = [] } = useMoodLogs();

  const joinChallenge = useJoinChallenge();
  const checkIn = useCheckInChallenge();
  const logMood = useLogMood();

  const activeCount = userChallenges.filter((c) => c.status === "active").length;
  const bestStreak = userChallenges.reduce((max, c) => Math.max(max, c.best_streak ?? 0), 0);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "challenges", label: "Challenges", icon: <Flame className="w-4 h-4" /> },
    { id: "mood", label: "Mood Tracker", icon: <Smile className="w-4 h-4" /> },
    { id: "badges", label: "My Badges", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Challenges & Rewards
          </h1>
          <p className="text-muted-foreground mt-1">
            Build healthy habits, earn badges, and track your mood
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-400" />}
            value={activeCount}
            label="Active Challenges"
            bg="bg-orange-500/10 border-orange-500/20"
            valueColor="text-orange-400"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-yellow-400" />}
            value={userBadges.length}
            label="Badges Earned"
            bg="bg-yellow-500/10 border-yellow-500/20"
            valueColor="text-yellow-400"
          />
          <StatCard
            icon={<Smile className="w-6 h-6 text-emerald-400" />}
            value={bestStreak}
            label="Best Streak"
            bg="bg-emerald-500/10 border-emerald-500/20"
            valueColor="text-emerald-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/40 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "challenges" && (
            <div className="space-y-4">
              {loadingChallenges ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 rounded-xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : challenges.length === 0 ? (
                <EmptyState
                  icon="🏆"
                  title="No challenges available yet"
                  description="Challenges will appear here once your database is set up. Check back soon!"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {challenges.map((challenge) => {
                    const userChallenge = userChallenges.find(
                      (uc) => uc.challenge_id === challenge.id
                    );
                    return (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userChallenge={userChallenge}
                        onJoin={() => joinChallenge.mutate(challenge.id)}
                        onCheckIn={() =>
                          userChallenge && checkIn.mutate(userChallenge.id)
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "mood" && (
            <MoodCalendarView moodLogs={moodLogs} onLogMood={logMood.mutate} />
          )}

          {activeTab === "badges" && (
            <BadgeDisplay userBadges={userBadges} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable components ── */

function StatCard({
  icon, value, label, bg, valueColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bg: string;
  valueColor: string;
}) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col items-center gap-2 ${bg}`}>
      {icon}
      <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

function EmptyState({
  icon, title, description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
