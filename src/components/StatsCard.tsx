import React from "react";
import { THEME } from "./Theme";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: string;
  width?: number;
  height?: number;
}

export const StatsCard = ({
  label,
  value,
  icon,
  width = 150,
  height = 150,
}: StatsCardProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        padding: "20px",
        justifyContent: "center", // Center vertically if tall
        alignItems: width < 200 ? "flex-start" : "center", // Align left for small, center for big
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: THEME.textDim, fontSize: "12px" }}>{label}</span>
        {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
      </div>
      <span
        style={{ color: THEME.textMain, fontSize: "32px", fontWeight: "bold" }}
      >
        {value}
      </span>
    </div>
  );
};
