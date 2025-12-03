import React from "react";
import { THEME } from "./Theme";

export const ClockCard = () => {
  // Note: Satori images are cached, so time won't be strictly real-time.
  // We display Date prominently as it's more accurate for a static image.
  const date = new Date();
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        width: "320px",
        height: "100px",
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        alignItems: "center",
        padding: "0 30px",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          color: THEME.textMain,
          fontSize: "48px",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        {timeStr}
      </span>
      <span
        style={{ color: THEME.textDim, fontSize: "16px", textAlign: "right" }}
      >
        {dateStr}
      </span>
    </div>
  );
};
