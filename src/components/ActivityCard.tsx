import React from "react";
import { THEME } from "./Theme";

const createSparkline = (data: number[], width: number, height: number) => {
  const recent = data.slice(-50); // Last 50 points
  const step = width / (recent.length - 1);
  const max = Math.max(...recent, 5);

  const points = recent.map((val, i) => {
    const x = i * step;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  });

  return `M 0 ${height} L ${points.join(" L ")} L ${width} ${height} Z`;
};

export const ActivityCard = ({ history }: { history: number[] }) => {
  const sparklinePath = createSparkline(history, 320, 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "320px",
        height: "150px",
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      <span style={{ color: THEME.textDim, fontSize: "12px" }}>
        Activity Pulse
      </span>
      <div style={{ marginTop: "auto", display: "flex" }}>
        <svg
          width="320"
          height="80"
          viewBox="0 0 320 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={sparklinePath}
            fill="url(#grad)"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};
