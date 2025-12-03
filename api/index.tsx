import { ImageResponse } from "@vercel/og";
import { getGithubData, calculateStats } from "../src/lib/github";
import { BentoGrid } from "../src/components/BentoGrid";

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
        "Cache-Control": "public, max-age=7200, s-maxage=7200", // Cache 2 jam di CDN Vercel
      },
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
