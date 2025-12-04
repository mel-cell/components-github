import React from "react";
import { THEME } from "./Theme";

interface StreakCardProps {
  total: number;
  current: number;
  longest: number;
}

export const StreakCard = ({
  total,
  current,
  longest,
  width = 490,
  height = 200,
}: StreakCardProps & { width?: number; height?: number }) => {
  return (
    <div
      style={{
        display: "flex",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* Total */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: THEME.textMain,
          }}
        >
          {total}
        </span>
        <span style={{ fontSize: "12px", color: THEME.textDim }}>
          Total Contribs
        </span>
      </div>

      <div
        style={{ width: "1px", height: "80px", backgroundColor: THEME.border }}
      />

      {/* Current Streak */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: `4px solid ${THEME.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexDirection: "column",
          }}
        >
          {/* Simple Arc for visual effect could be added here */}
          <span style={{ fontSize: "16px" }}>🔥</span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: THEME.textMain,
            }}
          >
            {current}
          </span>
        </div>
        <span
          style={{ fontSize: "12px", color: THEME.textDim, marginTop: "10px" }}
        >
          Current Streak
        </span>
      </div>

      <div
        style={{ width: "1px", height: "80px", backgroundColor: THEME.border }}
      />

      {/* Longest Streak */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: THEME.textMain,
          }}
        >
          {longest}
        </span>
        <span style={{ fontSize: "12px", color: THEME.textDim }}>
          Longest Streak
        </span>
      </div>
    </div>
  );
};
