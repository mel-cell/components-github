import React from "react";
import { THEME } from "./Theme";

const createSmoothPath = (data: number[], width: number, height: number) => {
  if (data.length === 0) return { stroke: "", fill: "" };

  // Normalize data
  const max = Math.max(...data, 5);
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (val / max) * height,
  }));

  // Generate Path
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    // Simple smoothing: use midpoints for control points
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;

    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p1.x} ${p1.y}`;
  }

  // Close path for fill
  const fillPath = `${d} L ${width} ${height} L 0 ${height} Z`;

  return { stroke: d, fill: fillPath };
};

export const ActivityCard = ({ history }: { history: number[] }) => {
  const { stroke, fill } = createSmoothPath(history, 320, 100);

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
        position: "relative",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", zIndex: 10 }}
      >
        <span style={{ color: THEME.textDim, fontSize: "12px" }}>
          Activity Pulse
        </span>
        <span style={{ color: THEME.textDim, fontSize: "10px" }}>
          Last 50 Days
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          display: "flex",
        }}
      >
        <svg
          width="320"
          height="100"
          viewBox="0 0 320 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill="url(#grad)" stroke="none" />
          <path
            d={stroke}
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
