import React from "react";
import { THEME } from "./Theme";
import { StatsCard } from "./StatsCard";
import { ActivityCard } from "./ActivityCard";
import { LanguageCard } from "./LanguageCard";
import { ProfileCard } from "./ProfileCard";
import { ClockCard } from "./ClockCard";
import { GitHubStatsCard } from "./GitHubStatsCard";
import { StreakCard } from "./StreakCard";

const GRID = {
  UNIT: 150,
  GAP: 20,
};

const getLayout = (x: number, y: number, w: number, h: number) => {
  // x, y are in grid units (0, 1, 2...)
  // w, h are in grid units
  // For height, we might need custom pixels if it doesn't align perfectly with width units,
  // but let's try to use the unit system or allow overrides.
  // Actually, looking at the design, rows have different heights.
  // Let's use x/w in Units, but y/h in Pixels for now to maintain the specific look,
  // OR define row heights.
  // Row 1: 320px
  // Row 2: 260px
  // Row 3: 200px
  // Let's stick to the user's request of "variable grid".
  // We will calculate Left/Width based on Columns.
  // Top/Height will be passed as raw pixels or calculated if we define row units.

  const left = x * (GRID.UNIT + GRID.GAP);
  const width = w * GRID.UNIT + (w - 1) * GRID.GAP;

  // For Y, since rows are irregular, we'll pass raw Y and H for now,
  // or we can define a "Row Unit" but that might be too rigid.
  // Let's assume y and h are passed in pixels for vertical, but units for horizontal.
  return {
    position: "absolute" as const,
    left: `${left}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${h}px`,
    display: "flex",
  };
};

export const BentoGrid = ({ data }: { data: any }) => {
  const { stats, user, languages, history } = data;

  // Layout Configuration
  // Columns: 0, 1, 2, 3, 4, 5 (Total 6 cols of 150px)

  // Row 1 Y: 0
  const ROW1_Y = 0;
  const ROW1_H = 320;

  // Row 2 Y: 320 + 20 = 340
  const ROW2_Y = 340;
  const ROW2_H = 260;

  // Row 3 Y: 340 + 260 + 20 = 620
  const ROW3_Y = 620;
  const ROW3_H = 200;

  return (
    <div
      style={{
        display: "flex",
        width: "1000px",
        height: "850px",
        backgroundColor: THEME.bg,
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      {/* --- ROW 1 --- */}

      {/* 1. Image Card (2x2) */}
      <div style={getLayout(0, ROW1_Y, 2, ROW1_H)}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            display: "flex",
            position: "relative",
          }}
        >
          <img
            src={user.avatar}
            width="100%"
            height="100%"
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
      </div>

      {/* 2. Stars (1x1) */}
      <div style={getLayout(2, ROW1_Y, 1, 150)}>
        <StatsCard label="Total Stars" value={stats.stars} />
      </div>

      {/* 3. Contribs (1x1) */}
      <div style={getLayout(3, ROW1_Y, 1, 150)}>
        <StatsCard label="Contribs (Year)" value={stats.contribs} icon="⚡" />
      </div>

      {/* 4. Activity Pulse (2x1) - Placed below Stars/Contribs */}
      <div style={getLayout(2, 170, 2, 150)}>
        <ActivityCard history={history} />
      </div>

      {/* 5. Language Share (2x3 approx) - Spans Row 1 and part of Row 2/3 space */}
      {/* Height 480px */}
      <div style={getLayout(4, ROW1_Y, 2, 480)}>
        <LanguageCard languages={languages} />
      </div>

      {/* --- ROW 2 --- */}

      {/* 6. Profile Info (3x?) */}
      <div style={getLayout(0, ROW2_Y, 3, ROW2_H)}>
        <ProfileCard name={user.name} login={user.login} bio={user.bio} />
      </div>

      {/* 7. Followers (1x?) */}
      <div style={getLayout(3, ROW2_Y, 1, ROW2_H)}>
        <StatsCard
          label="Followers"
          value={stats.followers}
          width={150}
          height={260}
        />
      </div>

      {/* 8. Clock (2x?) - Below Languages */}
      {/* Top: 0 + 480 + 20 = 500 */}
      <div style={getLayout(4, 500, 2, 100)}>
        <ClockCard />
      </div>

      {/* --- ROW 3 --- */}

      {/* 9. GitHub Stats (3x?) */}
      <div style={getLayout(0, ROW3_Y, 3, ROW3_H)}>
        <GitHubStatsCard
          stars={stats.stars}
          commits={stats.commits}
          prs={stats.prs}
          issues={stats.issues}
          grade={stats.grade}
        />
      </div>

      {/* 10. Streak Stats (3x?) */}
      {/* Wait, previous layout was Left 510 (Col 3). Width 490 (3 cols). */}
      <div style={getLayout(3, ROW3_Y, 3, ROW3_H)}>
        <StreakCard
          total={stats.contribs}
          current={stats.currentStreak}
          longest={stats.longestStreak}
        />
      </div>
    </div>
  );
};
