import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return NextResponse.json(
			{ error: "GitHub token not configured" },
			{ status: 500 }
		);
	}

	const data = await req.json();
	const username = data.username || "gabrielepedesini";

	const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
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

	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			variables: { username },
		}),
	});

	if (response.ok) {
		const json_data = await response.json();
		const weeks =
			json_data?.data?.user?.contributionsCollection?.contributionCalendar
				?.weeks || [];

		const contribution_data = weeks.flatMap((week: any) =>
			week.contributionDays.map((day: any) => ({
				date: day.date,
				contributionCount: day.contributionCount,
			}))
		);

		return NextResponse.json(contribution_data);
	} else {
		return NextResponse.json(
			{ error: "Failed to fetch data from GitHub" },
			{ status: response.status }
		);
	}
}