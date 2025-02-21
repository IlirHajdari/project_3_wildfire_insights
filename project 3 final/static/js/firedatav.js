// 🔥 Fire cause data categorized into "Human," "Natural," and "Other"
const fireData = {
    "2014": { "Lightning": 500, "Arson": 300, "Debris Burning": 250, "Equipment Use": 180, "Campfire": 120 },
    "2015": { "Lightning": 600, "Arson": 350, "Debris Burning": 300, "Equipment Use": 200, "Campfire": 150 },
    "2016": { "Lightning": 450, "Arson": 320, "Debris Burning": 280, "Equipment Use": 170, "Campfire": 110 },
    "2017": { "Lightning": 700, "Arson": 400, "Debris Burning": 350, "Equipment Use": 220, "Campfire": 180 },
    "2018": { "Lightning": 650, "Arson": 370, "Debris Burning": 290, "Equipment Use": 210, "Campfire": 160 },
    "2019": { "Lightning": 500, "Arson": 310, "Debris Burning": 260, "Equipment Use": 190, "Campfire": 140 },
    "2020": { "Lightning": 800, "Arson": 450, "Debris Burning": 400, "Equipment Use": 250, "Campfire": 200 }
};

// 🔥 Fire cause data for most destructive fires (>10,000 acres)
const destructiveFireData = {
    "Lightning": 120,
    "Arson": 80,
    "Debris Burning": 60,
    "Equipment Use": 45,
    "Campfire": 30
};

// 🎨 Color coding for each fire cause category
const causeColors = {
    "Lightning": "blue",          
    "Arson": "orange",            
    "Debris Burning": "green",    
    "Equipment Use": "gray",      
    "Campfire": "red"             
};

// 🎯 Function to get fire cause data for the selected year
function getFireCauseData(year) {
    let labels = Object.keys(fireData["2014"]);  // Causes of fire
    let datasets = [];

    if (year === "all") {
        Object.keys(fireData).forEach(yearKey => {
            let dataPoints = Object.values(fireData[yearKey]);
            datasets.push({
                label: yearKey,
                data: dataPoints,
                backgroundColor: labels.map(cause => causeColors[cause]),
                borderWidth: 1
            });
        });
    } else {
        let dataPoints = Object.values(fireData[year]);
        datasets.push({
            label: year,
            data: dataPoints,
            backgroundColor: labels.map(cause => causeColors[cause]),
            borderWidth: 1
        });
    }

    return { labels, datasets };
}

// 🎯 Function to get data for the most destructive fires chart
function getDestructiveFireData() {
    return {
        labels: Object.keys(destructiveFireData),
        datasets: [{
            label: "Number of Large Fires",
            data: Object.values(destructiveFireData),
            backgroundColor: Object.keys(destructiveFireData).map(cause => causeColors[cause]),
            borderWidth: 1
        }]
    };
}

// 🎨 Get canvas elements for charts
const fireCausesCtx = document.getElementById('fireCausesChart').getContext('2d');
const destructiveFiresCtx = document.getElementById('destructiveFiresChart').getContext('2d');

// 📌 Plugin to display year labels CLOSER TO 0 inside bars
const barLabelPlugin = {
    id: 'barLabelPlugin',
    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach((element, index) => {
                    if (chart.data.labels[index]) {
                        const data = dataset.label; // Year label
                        ctx.fillStyle = "black"; // 🔥 Keep text BLACK
                        ctx.font = "12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";

                        const position = element.tooltipPosition();
                        ctx.save();

                        // 🔥 Move text closer to the bottom (closer to 0) instead of the top
                        const yOffset = Math.min(element.y + 30, chart.scales.y.bottom - 20); 

                        ctx.translate(position.x, yOffset); 
                        ctx.rotate(-Math.PI / 2); // Rotate text 90 degrees
                        ctx.fillText(data, 0, 0);
                        ctx.restore();
                    }
                });
            }
        });
        ctx.restore();
    }
};

// 📊 Create Fire Causes Multi-Bar Chart
let fireCausesChart = new Chart(fireCausesCtx, {
    type: 'bar',
    data: getFireCauseData("all"),
    options: {
        responsive: true,
        plugins: { 
            legend: { position: 'top' } 
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Fires" }
            }
        }
    },
    plugins: [barLabelPlugin] // Enable the year-label plugin
});

// 📊 Create Most Destructive Fires Bar Chart
let destructiveFiresChart = new Chart(destructiveFiresCtx, {
    type: 'bar',
    data: getDestructiveFireData(),
    options: {
        responsive: true,
        plugins: { 
            legend: { position: 'top' } 
        },
        scales: {
            y: { 
                beginAtZero: true, 
                title: { display: true, text: "Number of Fires" } 
            }
        }
    }
});

// 🔄 Update charts when a new year is selected
document.getElementById("yearDropdown").addEventListener("change", function() {
    let selectedYear = this.value;

    // Update chart data
    fireCausesChart.data = getFireCauseData(selectedYear);

    // Show year labels inside bars only when "All Years" is selected
    if (selectedYear === "all") {
        fireCausesChart.options.plugins = { barLabelPlugin };
    } else {
        fireCausesChart.options.plugins = {};
    }

    fireCausesChart.update();
});
