import { ImageResponse } from "@vercel/og";
import { getGithubData, calculateStats } from "../../src/lib/github";
import { StreakCard } from "../../src/components/StreakCard";
import { LanguageCard } from "../../src/components/LanguageCard";
import { ActivityCard } from "../../src/components/ActivityCard";
import { GitHubStatsCard } from "../../src/components/GitHubStatsCard";
import { ProfileCard } from "../../src/components/ProfileCard";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "mel-cell";
    const type = searchParams.get("type") || "streak"; // Default to streak

    // Fetch Data
    const rawData = await getGithubData(username);
    const data = calculateStats(rawData);

    // Fetch and embed avatar image to avoid CSP issues
    if (data.user.avatar) {
      try {
        const avatarRes = await fetch(data.user.avatar);
        if (avatarRes.ok) {
          const avatarBuffer = await avatarRes.arrayBuffer();
          const base64Avatar = Buffer.from(avatarBuffer).toString("base64");
          data.user.avatar = `data:image/png;base64,${base64Avatar}`;
        }
      } catch (e) {
        console.error("Failed to fetch avatar:", e);
      }
    }

    let component;
    let width = 490;
    let height = 200;

    switch (type) {
      case "streak":
        component = (
          <StreakCard
            total={data.stats.contribs}
            current={data.stats.currentStreak}
            longest={data.stats.longestStreak}
          />
        );
        width = 490;
        height = 200;
        break;
      case "languages":
        component = <LanguageCard languages={data.languages} />;
        width = 320;
        height = 480;
        break;
      case "activity":
        component = <ActivityCard history={data.history} />;
        width = 320;
        height = 150;
        break;
      case "stats":
        component = (
          <GitHubStatsCard
            stars={data.stats.stars}
            commits={data.stats.commits}
            prs={data.stats.prs}
            issues={data.stats.issues}
            grade={data.stats.grade}
          />
        );
        width = 490;
        height = 200;
        break;
      case "profile":
        component = (
          <ProfileCard
            name={data.user.name}
            login={data.user.login}
            bio={data.user.bio}
          />
        );
        width = 490;
        height = 260;
        break;
      default:
        return new Response("Invalid type parameter", { status: 400 });
    }

    const response = new ImageResponse(
      (
        <div style={{ display: "flex", fontFamily: "Inter, sans-serif" }}>
          {component}
        </div>
      ),
      {
        width,
        height,
        fonts: [
          {
            name: "Inter",
            data: await fetch(
              "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.15/files/inter-latin-400-normal.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: await fetch(
              "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.15/files/inter-latin-700-normal.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'none'; img-src * data: https:; style-src 'unsafe-inline'; font-src * data: https:;"
    );

    return response;
  } catch (e: any) {
    console.log(`${e.message}`);
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#050505",
            color: "#ff4444",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontFamily: "sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          <span>⚠️ Failed to generate image</span>
          <span style={{ fontSize: "16px", marginTop: "10px", color: "#888" }}>
            {e.message}
          </span>
        </div>
      ),
      { width: 500, height: 300 }
    );
  }
}
