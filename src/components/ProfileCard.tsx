import React from "react";
import { THEME } from "./Theme";

interface ProfileCardProps {
  name: string;
  login: string;
  bio: string;
}

export const ProfileCard = ({ name, login, bio }: ProfileCardProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "490px",
        height: "260px",
        backgroundColor: THEME.cardBg,
        borderRadius: "24px",
        padding: "30px",
      }}
    >
      <span
        style={{ color: THEME.textMain, fontSize: "32px", fontWeight: "bold" }}
      >
        {name}
      </span>
      <span style={{ color: THEME.textDim, fontSize: "18px" }}>@{login}</span>

      <span
        style={{
          color: THEME.textMain,
          fontSize: "16px",
          marginTop: "20px",
          lineHeight: "1.5",
          maxWidth: "400px",
        }}
      >
        {bio}
      </span>

      <div
        style={{
          marginTop: "auto",
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "8px 20px",
          borderRadius: "20px",
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#4ade80",
            marginRight: "8px",
          }}
        />
        <span style={{ color: "white", fontSize: "12px", fontWeight: "500" }}>
          Available for hire
        </span>
      </div>
    </div>
  );
};
