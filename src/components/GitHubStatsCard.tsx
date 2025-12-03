import React from "react";
import { THEME } from "./Theme";

interface GitHubStatsProps {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  grade: string;
}

export const GitHubStatsCard = ({
  stars,
  commits,
  prs,
  issues,
  grade,
}: GitHubStatsProps) => {
  return (
    <div
      style={{
        display: "flex",
        width: "490px",
        height: "200px",
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        padding: "30px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "12px",
        }}
      >
        <span
          style={{
            color: THEME.textMain,
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          GitHub Stats
        </span>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: THEME.textDim, fontSize: "14px" }}>
            Total Stars Earned:
          </span>
          <span style={{ color: THEME.textMain, fontWeight: "bold" }}>
            {stars}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: THEME.textDim, fontSize: "14px" }}>
            Total Commits:
          </span>
          <span style={{ color: THEME.textMain, fontWeight: "bold" }}>
            {commits}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: THEME.textDim, fontSize: "14px" }}>
            Total PRs:
          </span>
          <span style={{ color: THEME.textMain, fontWeight: "bold" }}>
            {prs}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: THEME.textDim, fontSize: "14px" }}>
            Total Issues:
          </span>
          <span style={{ color: THEME.textMain, fontWeight: "bold" }}>
            {issues}
          </span>
        </div>
      </div>

      {/* Grade Circle */}
      <div
        style={{
          width: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20px",
        }}
      >
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            border: `8px solid ${THEME.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "-8px",
              right: "-8px",
              bottom: "-8px",
              borderRadius: "50%",
              border: `8px solid ${THEME.textMain}`,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              transform: "rotate(-45deg)",
            }}
          />
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: THEME.textMain,
            }}
          >
            {grade}
          </span>
        </div>
      </div>
    </div>
  );
};
