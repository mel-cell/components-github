import React from "react";
import { THEME } from "./Theme";
import { StatsCard } from "./StatsCard";
import { ActivityCard } from "./ActivityCard";
import { LanguageCard } from "./LanguageCard";
import { ProfileCard } from "./ProfileCard";
import { ClockCard } from "./ClockCard";
import { GitHubStatsCard } from "./GitHubStatsCard";
import { StreakCard } from "./StreakCard";

export const BentoGrid = ({ data }: { data: any }) => {
  const { stats, user, languages, history } = data;

  return (
    <div
      style={{
        display: "flex",
        width: "1000px",
        height: "850px",
        backgroundColor: THEME.bg,
        fontFamily: "Inter, sans-serif", // Use Inter font
        position: "relative",
      }}
    >
      {/* --- ROW 1 --- */}

      {/* 1. Image Card */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "320px",
          height: "320px",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <img
          src={user.avatar}
          width="320"
          height="320"
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))",
          }}
        />
      </div>

      {/* 2. Stars */}
      <div
        style={{ position: "absolute", top: 0, left: "340px", display: "flex" }}
      >
        <StatsCard label="Total Stars" value={stats.stars} />
      </div>

      {/* 3. Contribs */}
      <div
        style={{ position: "absolute", top: 0, left: "510px", display: "flex" }}
      >
        <StatsCard label="Contribs (Year)" value={stats.contribs} icon="⚡" />
      </div>

      {/* 4. Activity Pulse */}
      <div
        style={{
          position: "absolute",
          top: "170px",
          left: "340px",
          display: "flex",
        }}
      >
        <ActivityCard history={history} />
      </div>

      {/* 5. Language Share */}
      <div
        style={{ position: "absolute", top: 0, left: "680px", display: "flex" }}
      >
        <LanguageCard languages={languages} />
      </div>

      {/* --- ROW 2 --- */}

      {/* 6. Profile Info */}
      <div
        style={{ position: "absolute", top: "340px", left: 0, display: "flex" }}
      >
        <ProfileCard name={user.name} login={user.login} bio={user.bio} />
      </div>

      {/* 7. Followers */}
      <div
        style={{
          position: "absolute",
          top: "340px",
          left: "510px",
          display: "flex",
        }}
      >
        <StatsCard
          label="Followers"
          value={stats.followers}
          width={150}
          height={260}
        />
      </div>

      {/* 8. Clock */}
      <div
        style={{
          position: "absolute",
          top: "500px",
          left: "680px",
          display: "flex",
        }}
      >
        <ClockCard />
      </div>

      {/* --- ROW 3 --- */}

      {/* 9. GitHub Stats */}
      <div
        style={{ position: "absolute", top: "620px", left: 0, display: "flex" }}
      >
        <GitHubStatsCard
          stars={stats.stars}
          commits={stats.commits}
          prs={stats.prs}
          issues={stats.issues}
          grade={stats.grade}
        />
      </div>

      {/* 10. Streak Stats */}
      <div
        style={{
          position: "absolute",
          top: "620px",
          left: "510px",
          display: "flex",
        }}
      >
        <StreakCard
          total={stats.contribs}
          current={stats.currentStreak}
          longest={stats.longestStreak}
        />
      </div>
    </div>
  );
};
