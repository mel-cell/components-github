import React from "react";
import { THEME } from "./Theme";

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const createDonutPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

export const LanguageCard = ({ languages }: { languages: any[] }) => {
  let startAngle = 0;
  const donutPaths = languages.map((lang: any) => {
    const angle = (lang.percent / 100) * 360;
    if (angle <= 0) return null;
    const path = createDonutPath(60, 60, 50, startAngle, startAngle + angle);
    startAngle += angle;
    return (
      <path d={path} fill={lang.color} stroke={THEME.cardBg} strokeWidth="2" />
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "320px",
        height: "480px",
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        padding: "25px",
      }}
    >
      <span style={{ color: THEME.textDim, fontSize: "12px" }}>
        Language Share
      </span>

      {/* Donut */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          {donutPaths}
          <circle cx="60" cy="60" r="35" fill={THEME.cardBg} />
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fill={THEME.textMain}
            fontSize="16"
            fontWeight="bold"
          >
            {languages.length}
          </text>
          <text
            x="60"
            y="80"
            textAnchor="middle"
            fill={THEME.textDim}
            fontSize="8"
          >
            LANGS
          </text>
        </svg>
      </div>

      {/* Legend List */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignContent: "flex-start",
        }}
      >
        {languages.map((lang: any) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "125px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: lang.color,
                marginRight: "8px",
              }}
            />
            <span
              style={{
                color: THEME.textDim,
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lang.name}
            </span>
            <span style={{ color: THEME.textMain }}>
              {Math.round(lang.percent)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
