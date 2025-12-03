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

    return new ImageResponse(
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
              "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: await fetch(
              "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 700,
            style: "normal",
          },
        ],
        headers: {
          "Cache-Control": "public, max-age=7200, s-maxage=7200",
        },
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
