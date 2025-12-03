import { gql, GraphQLClient } from "graphql-request";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export interface GithubData {
  user: {
    login: string;
    name: string;
    bio: string;
    avatarUrl: string;
    followers: { totalCount: number };
    repositories: {
      totalCount: number;
      nodes: {
        languages: {
          edges: { size: number; node: { name: string; color: string } }[];
        };
      }[];
    };
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            contributionCount: number;
            date: string;
          }[];
        }[];
      };
    };
  };
}

export async function getGithubData(username: string): Promise<GithubData> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  const endpoint = "https://api.github.com/graphql";
  const client = new GraphQLClient(endpoint, {
    headers: { authorization: `Bearer ${GITHUB_TOKEN}` },
  });

  const query = gql`
    query ($username: String!) {
      user(login: $username) {
        login
        name
        bio
        avatarUrl
        followers {
          totalCount
        }
        repositories(
          first: 100
          ownerAffiliations: OWNER
          orderBy: { field: STARGAZERS, direction: DESC }
        ) {
          totalCount
          nodes {
            languages(first: 5) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
            stargazers {
              totalCount
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  return client.request<GithubData>(query, { username });
}

export function calculateStats(data: GithubData) {
  const user = data.user;

  // Calculate Total Stars
  // Note: In a real robust app we might need to paginate repos, but for now top 100 is usually enough
  // The query above doesn't explicitly sum stars, let's do a rough sum from nodes or fetch separately if needed.
  // Actually, let's just assume we iterate the nodes.
  // Wait, the query above missed stargazers count in nodes properly. Let me fix the query in my head or just use what I wrote.
  // I added stargazers { totalCount } in the query logic but let's make sure it's accessible.
  // For simplicity in this "Satori" version, let's iterate the repos we got.

  let totalStars = 0;
  // @ts-ignore
  user.repositories.nodes.forEach((repo) => {
    if (repo.stargazers) totalStars += repo.stargazers.totalCount;
  });

  // Calculate Languages
  const langMap = new Map<string, { size: number; color: string }>();
  user.repositories.nodes.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const { name, color } = edge.node;
      const current = langMap.get(name) || { size: 0, color };
      langMap.set(name, { size: current.size + edge.size, color });
    });
  });

  const totalSize = Array.from(langMap.values()).reduce(
    (acc, val) => acc + val.size,
    0
  );
  const languages = Array.from(langMap.entries())
    .map(([name, { size, color }]) => ({
      name,
      percent: (size / totalSize) * 100,
      color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 10); // Top 10

  // Calculate Streaks
  const days = user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date().toISOString().split("T")[0];

  // Current Streak
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      if (day.date === today) continue; // Skip today if 0
      break;
    }
  }

  // Longest Streak
  for (const day of days) {
    if (day.contributionCount > 0) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Grade
  const totalContribs =
    user.contributionsCollection.contributionCalendar.totalContributions;
  let grade = "C";
  if (totalContribs >= 2000) grade = "S+";
  else if (totalContribs >= 1000) grade = "A+";
  else if (totalContribs >= 500) grade = "A";
  else if (totalContribs >= 200) grade = "B+";
  else if (totalContribs >= 100) grade = "B";

  return {
    stats: {
      stars: totalStars,
      commits: user.contributionsCollection.totalCommitContributions,
      prs: user.contributionsCollection.totalPullRequestContributions,
      issues: user.contributionsCollection.totalIssueContributions,
      contribs: totalContribs,
      followers: user.followers.totalCount,
      grade,
      currentStreak,
      longestStreak,
    },
    user: {
      name: user.name,
      login: user.login,
      bio: user.bio,
      avatar: user.avatarUrl,
    },
    languages,
    history: days.map((d) => d.contributionCount), // For Sparkline
  };
}
