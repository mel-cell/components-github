import React from "react";
import { THEME } from "./Theme";
import { StreakCard } from "./StreakCard";
import { GitHubStatsCard } from "./GitHubStatsCard";
import { LanguageCard } from "./LanguageCard";

// Combined Card Component for Vercel OG
export const CombinedCard = ({ data }: { data: any }) => {
  const { stats, languages } = data;

  // Layout Configuration
  const TOTAL_WIDTH = 900;
  const GAP = 20;
  const LEFT_COL_WIDTH = 550;
  const RIGHT_COL_WIDTH = TOTAL_WIDTH - LEFT_COL_WIDTH - GAP; // 330
  const CARD_HEIGHT = 200;
  const TOTAL_HEIGHT = CARD_HEIGHT * 2 + GAP; // 420

  return (
    <div
      style={{
        display: "flex",
        width: `${TOTAL_WIDTH}px`,
        height: `${TOTAL_HEIGHT}px`,
        backgroundColor: THEME.bg,
        fontFamily: "Inter, sans-serif",
        gap: `${GAP}px`,
      }}
    >
      {/* Left Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${LEFT_COL_WIDTH}px`,
          gap: `${GAP}px`,
        }}
      >
        <StreakCard
          total={stats.contribs}
          current={stats.currentStreak}
          longest={stats.longestStreak}
          width={LEFT_COL_WIDTH}
          height={CARD_HEIGHT}
        />
        <GitHubStatsCard
          stars={stats.stars}
          commits={stats.commits}
          prs={stats.prs}
          issues={stats.issues}
          grade={stats.grade}
          width={LEFT_COL_WIDTH}
          height={CARD_HEIGHT}
        />
      </div>

      {/* Right Column */}
      <div style={{ display: "flex", width: `${RIGHT_COL_WIDTH}px` }}>
        <LanguageCard
          languages={languages}
          width={RIGHT_COL_WIDTH}
          height={TOTAL_HEIGHT}
        />
      </div>
    </div>
  );
};
