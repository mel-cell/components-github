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
    // Increased radius from 50 to 70
    const path = createDonutPath(80, 80, 70, startAngle, startAngle + angle);
    startAngle += angle;
    return (
      <path
        key={lang.name}
        d={path}
        fill={lang.color}
        stroke={THEME.cardBg}
        strokeWidth="2"
      />
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
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0",
          position: "relative",
          width: "160px",
          height: "160px",
          alignSelf: "center",
        }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160">
          {donutPaths}
          {/* Inner circle radius 55 */}
          <circle cx="80" cy="80" r="55" fill={THEME.cardBg} />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: THEME.textMain,
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {languages.length}
          </span>
          <span style={{ color: THEME.textDim, fontSize: "10px" }}>LANGS</span>
        </div>
      </div>

      {/* Legend List - Scrollable effect not possible in image, so we use compact layout */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignContent: "flex-start",
          justifyContent: "space-between", // Distribute space
        }}
      >
        {languages.map((lang: any) => (
          <div
            key={lang.name}
            style={{
              display: "flex",
              alignItems: "center",
              width: "48%", // 2 columns
              fontSize: "11px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: lang.color,
                marginRight: "6px",
                flexShrink: 0,
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
            <span style={{ color: THEME.textMain, marginLeft: "4px" }}>
              {Math.round(lang.percent)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
