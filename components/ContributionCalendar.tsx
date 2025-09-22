"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import * as d3 from "d3";

async function fetchGitHubData(username = "gabrielepedesini") {
	try {
		const response = await fetch("/api/github-data", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username }),
		});
		if (!response.ok) throw new Error("Failed to fetch GitHub data");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching GitHub data:", error);
		return [];
	}
}

function getColorForContributions(count: number) {
	const rootStyle = getComputedStyle(document.documentElement);
	if (count === 0) return rootStyle.getPropertyValue("--contribution-no");
	if (count <= 3) return rootStyle.getPropertyValue("--contribution-low");
	if (count <= 6) return rootStyle.getPropertyValue("--contribution-normal");
	if (count <= 9) return rootStyle.getPropertyValue("--contribution-medium");
	return rootStyle.getPropertyValue("--contribution-high");
}

function getOrdinalSuffix(day: number) {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}

export default function ContributionCalendar({ contributionNum, viewAll }: { contributionNum: number; viewAll: string; }) {
	const { theme } = useTheme(); 
	const [isVisible, setIsVisible] = useState(false);
	const [renderKey, setRenderKey] = useState(0);

	useEffect(() => {
		setIsVisible(false);
		setRenderKey(prev => prev + 1);
	}, [theme]);

	useEffect(() => {
		const renderCalendar = async () => {
			const data = await fetchGitHubData();
			if (!data || data.length === 0) return;

			const fixedWidth = 700;
			const cellSize = 10.5;
			const cellPadding = 2;
			const dayCount = 7;
			const labelWidth = 30;
			const width = fixedWidth;
			const height = (cellSize + cellPadding) * dayCount + 60;

			// Update contribution number directly in DOM
			const numberEl = document.getElementById("contribution-number");
			if (numberEl) numberEl.textContent = `${data.reduce(
				(sum: number, day: any) => sum + day.contributionCount,
				0
			)}`;

			const svg = d3
				.select("#contribution-calendar")
				.html("")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("viewBox", `0 0 ${width} ${height}`)
				.attr("preserveAspectRatio", "xMinYMin meet");

			const tooltip = d3
				.select("body")
				.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

			// Day labels
			const days = ["Mon", "Wed", "Fri"];
			svg.selectAll(".day-label")
				.data(days)
				.enter()
				.append("text")
				.attr("class", "day-label")
				.attr("x", labelWidth - 5)
				.attr("y", (d, i) => (cellSize + cellPadding) * (i * 2 + 1) + cellSize + 30)
				.attr("text-anchor", "end")
				.text(d => d);

			// Month positions
			const monthPositions = data.reduce((acc: any, d: any, i: number) => {
				const date = new Date(d.date);
				const month = date.toLocaleString("default", { month: "short" });
				if (date.getDate() === 1 && !acc[month]) {
					const weekIndex = Math.floor(i / 7);
					const xPosition = weekIndex * (cellSize + cellPadding) + labelWidth;
					if (xPosition < width - 25) acc[month] = xPosition;
				}
				return acc;
			}, {});

			svg.selectAll(".month-label")
				.data(Object.entries(monthPositions))
				.enter()
				.append("text")
				.attr("class", "month-label")
				.attr("x", (d: any) => d[1])
				.attr("y", 20)
				.text((d: any) => d[0].substring(0, 3));

			// Contribution cells
			const cells = svg.selectAll(".contribution-cell")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", (d: any) =>
					d.contributionCount > 0 ? "contribution-cell contribution-border" : "contribution-cell"
				)
				.attr("x", (_, i) => Math.floor(i / 7) * (cellSize + cellPadding) + labelWidth)
				.attr("y", (_, i) => (i % 7) * (cellSize + cellPadding) + 30)
				.attr("width", cellSize)
				.attr("height", cellSize)
				.attr("rx", 2)
				.attr("fill", (d: any) => getColorForContributions(d.contributionCount));

			const showTooltip = (element: any, d: any) => {
				const date = new Date(d.date);
				const day = date.getDate();
				const formattedDate = date
					.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
					.replace(/\d+/, day + getOrdinalSuffix(day));

				tooltip.transition().duration(200).style("opacity", 1);
				tooltip.html(`${formattedDate}<br>${d.contributionCount} contributions`);

				const cellRect = element.getBoundingClientRect();
				const tooltipRect = tooltip.node()!.getBoundingClientRect();
				const viewportWidth = window.innerWidth;
				const spaceOnRight = viewportWidth - (cellRect.right + window.pageXOffset);
				const showOnRight = spaceOnRight >= tooltipRect.width + 10;
				const left = showOnRight ? window.pageXOffset + cellRect.right + 10 : window.pageXOffset + cellRect.left - tooltipRect.width - 10;
				const top = window.pageYOffset + cellRect.top - tooltipRect.height / 2 + cellRect.height / 2;
				tooltip.style("left", `${left}px`).style("top", `${top}px`);
			};

			cells
				.on("mouseover", function (_, d) { showTooltip(this, d); })
				.on("mouseout", () => { tooltip.transition().duration(500).style("opacity", 0); })
				.on("click", function (_, d) { showTooltip(this, d); });

			document.addEventListener("click", (event) => {
				const clickedElement = event.target as HTMLElement;
				if (!clickedElement.closest(".contribution-cell")) {
					tooltip.transition().duration(500).style("opacity", 0);
				}
			});

			// Legend
			const legendData = [0, 3, 6, 9, 12];
			const legendWidth = cellSize;
			const legendX = width - legendData.length * (legendWidth + 5) + labelWidth;

			const legend = svg.append("g").attr("transform", `translate(${legendX - 72}, ${height - 15})`);
			legend.selectAll("rect").data(legendData).enter()
				.append("rect")
				.attr("x", (_, i) => i * (legendWidth + 5))
				.attr("width", legendWidth)
				.attr("height", legendWidth)
				.attr("rx", 2)
				.attr("fill", (d) => getColorForContributions(d));
			legend.append("text").attr("class", "legend-label").attr("x", -35).attr("y", legendWidth - 1).text("Less");
			legend.append("text").attr("class", "legend-label").attr("x", legendData.length * (legendWidth + 5) + 5).attr("y", legendWidth - 1).text("More");

			// Animate visibility
			setIsVisible(true);
		};

		renderCalendar();
	}, [renderKey]);

	return (
		<>
			<section className={`contributions-number-wrapper ${isVisible ? "visible" : "hidden"}`}>
				<div className="container">
					<span id="contribution-number"></span>{" "}
					<span>{contributionNum}</span>
				</div>
			</section>

			<section className={`contributions ${isVisible ? "visible" : "hidden"}`}>
				<div className="graph-wrapper">
					<div id="contribution-calendar"></div>
					<div className="github-tag">
						<a href="https://github.com/gabrielepedesini" target="_blank">{viewAll}</a>
					</div>
				</div>
				<div className="left-gradient"></div>
				<div className="right-gradient"></div>
			</section>
		</>
	);
}