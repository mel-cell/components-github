import { ImageResponse } from "@vercel/og";
import { getGithubData, calculateStats } from "../../src/lib/github";
import { BentoGrid } from "../../src/components/BentoGrid";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "mel-cell";

    // 1. Fetch Real Data
    const rawData = await getGithubData(username);
    const data = calculateStats(rawData);

    // 2. Render to SVG
    return new ImageResponse(<BentoGrid data={data} />, {
      width: 1000,
      height: 850,
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
      headers: {
        "Cache-Control": "public, max-age=7200, s-maxage=7200",
      },
    });
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
      { width: 1000, height: 850 }
    );
  }
}
