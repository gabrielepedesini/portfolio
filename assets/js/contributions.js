async function fetchGitHubData(username = "gabrielepedesini") {
    try {
        const response = await fetch('/api/github-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

function getColorForContributions(count) {
    const rootStyle = getComputedStyle(document.documentElement);

    if (count === 0) return rootStyle.getPropertyValue('--contribution-no');
    if (count <= 3) return rootStyle.getPropertyValue('--contribution-low');
    if (count <= 6) return rootStyle.getPropertyValue('--contribution-normal');
    if (count <= 9) return rootStyle.getPropertyValue('--contribution-medium');
    return rootStyle.getPropertyValue('--contribution-high');
}

function calculateTooltipPosition(cellElement, tooltipElement) {
    const cellRect = cellElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    const spaceOnRight = viewportWidth - (cellRect.right + window.pageXOffset);
    
    const showOnRight = spaceOnRight >= tooltipRect.width + 10;
    
    const top = window.pageYOffset + cellRect.top - (tooltipRect.height / 2) + (cellRect.height / 2);
    const left = showOnRight 
        ? window.pageXOffset + cellRect.right + 10  
        : window.pageXOffset + cellRect.left - tooltipRect.width - 10; 
        
    return { left, top };
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function showTooltip(element, d, tooltip) {
    const date = new Date(d.date);
    const day = date.getDate();
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).replace(/\d+/, day + getOrdinalSuffix(day));

    tooltip.transition()
        .duration(200)
        .style("opacity", 1);

    tooltip.html(`${formattedDate}<br>${d.contributionCount} contributions`);
    
    const { left, top } = calculateTooltipPosition(element, tooltip.node());
    
    tooltip
        .style("left", left + "px")
        .style("top", top + "px");
}

export async function renderCalendar() {
    const data = await fetchGitHubData();

    const fixedWidth = 700; 
    const cellSize = 10.5;
    const cellPadding = 2;
    const weekCount = 53;
    const dayCount = 7;
    const labelWidth = 30;

    const width = fixedWidth;
    const height = (cellSize + cellPadding) * dayCount + 60;

    const totalContributions = data.reduce((sum, day) => sum + day.contributionCount, 0);

    document.querySelector('.contributions-number').textContent = 
        `${totalContributions}`;

    const svg = d3.select("#contribution-calendar")
        .html("") 
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet");

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const days = ['Mon', 'Wed', 'Fri'];
    svg.selectAll(".day-label")
        .data(days)
        .enter()
        .append("text")
        .attr("class", "day-label")
        .attr("x", labelWidth - 5)
        .attr("y", (d, i) => (cellSize + cellPadding) * (i * 2 + 1) + cellSize + 30)
        .attr("text-anchor", "end")
        .text(d => d);

    const monthPositions = data.reduce((acc, d, i) => {
        const date = new Date(d.date);
        const month = date.toLocaleString('default', { month: 'short' });

        if (date.getDate() === 1 && !acc[month]) {
            const weekIndex = Math.floor(i / 7);
            const xPosition = (weekIndex * (cellSize + cellPadding)) + labelWidth;

            if (xPosition < width - 25) {
                acc[month] = xPosition;
            }
        }
        return acc;
    }, {});

    svg.selectAll(".month-label")
        .data(Object.entries(monthPositions))
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("x", d => d[1])
        .attr("y", 20)
        .text(d => d[0].substring(0, 3));

    // const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    function isWidthEnough() {
        const container = document.querySelector('.graph-wrapper');

        return container.getBoundingClientRect().width;
    }

    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }    

    const cells = svg.selectAll(".contribution-cell")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", d => 
            d.contributionCount > 0 
                ? "contribution-cell contribution-border" 
                : "contribution-cell"
        )
        .attr("x", (d, i) => (Math.floor(i / 7) * (cellSize + cellPadding)) + labelWidth)
        .attr("y", (d, i) => ((i % 7) * (cellSize + cellPadding)) + 30)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 2)
        .attr("fill", d => getColorForContributions(d.contributionCount));

    cells
        .on("mouseover", function(event, d) {
            showTooltip(this, d, tooltip);
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            showTooltip(this, d, tooltip);
            event.stopPropagation();
        });

    document.addEventListener('click', (event) => {
        const clickedElement = event.target;
    
        if (!clickedElement.closest('.contribution-cell')) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }
    });

    const legendData = [0, 3, 6, 9, 12];
    const legendWidth = cellSize;
    const legendX = width - (legendData.length * (legendWidth + 5)) + labelWidth;

    const legend = svg.append("g")
        .attr("transform", `translate(${legendX - 72}, ${height - 15})`);

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (legendWidth + 5))
        .attr("width", legendWidth)
        .attr("height", legendWidth)
        .attr("rx", 2)
        .attr("fill", d => getColorForContributions(d));

    legend.append("text")
        .attr("class", "legend-label")
        .attr("x", -35)
        .attr("y", legendWidth - 1)
        .text("Less");

    legend.append("text")
        .attr("class", "legend-label")
        .attr("x", legendData.length * (legendWidth + 5) + 5)
        .attr("y", legendWidth - 1)
        .text("More");

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 0);
    });
}
