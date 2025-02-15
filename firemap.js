// Initialize charts
let fireCountChart, fireSizeChart;

// Fetch data from the JSON file
fetch("USGS2014.json")
    .then(response => response.json())
    .then(data => {
        console.log("Fire data loaded:", data);

        // Process fire data for visualization
        let fireData = processFireData(data);

        // Initialize charts
        initializeCharts(fireData);
    })
    .catch(error => console.error("Error loading fire data:", error));

// Function to process fire data
function processFireData(data) {
    let fireData = [];

    data.forEach(fire => {
        let year = fire["Year"];
        if (year > 2020) return; // Ignore data beyond 2020

        let month = new Date(fire["Discovery Date"]).getMonth() + 1; // Convert date to month index
        let fireSize = parseFloat(fire["Fire Size in Acres"]) || 0; // Convert fire size

        fireData.push({ year, month, fireSize, fireCount: 1 });
    });

    return fireData;
}

// Function to update charts and YTD summary
function updateCharts(selectedYear, fireData) {
    let filteredData = selectedYear === "all" ? fireData : fireData.filter(d => d.year == selectedYear);

    let monthlyCounts = Array(12).fill(0);
    let monthlySizes = Array(12).fill(0);
    let ytdFireCount = 0;
    let ytdFireSize = 0;

    filteredData.forEach(d => {
        monthlyCounts[d.month - 1] += d.fireCount;
        monthlySizes[d.month - 1] += d.fireSize / 1000000; // Convert to million acres

        ytdFireCount += d.fireCount;
        ytdFireSize += d.fireSize;
    });

    // Update Fire Count Chart
    fireCountChart.data.datasets[0].data = monthlyCounts;
    fireCountChart.update();

    // Update Fire Size Chart
    fireSizeChart.data.datasets[0].data = monthlySizes;
    fireSizeChart.options.scales.y.title.text = "Fire Size (Million Acres)";
    fireSizeChart.update();

    // Convert fire size to millions
    let fireSizeInMillions = (ytdFireSize / 1000000).toFixed(2);

    // Update YTD Summary Numbers
    document.getElementById("ytdFireCount").innerText = ytdFireCount.toLocaleString();
    document.getElementById("ytdFireSize").innerText = fireSizeInMillions + " Million Acres";
}

// Function to initialize charts
function initializeCharts(fireData) {
    const ctx1 = document.getElementById('fireCountChart').getContext('2d');
    fireCountChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{ label: "Fire Count", backgroundColor: "red", data: [] }]
        }
    });

    const ctx2 = document.getElementById('fireSizeChart').getContext('2d');
    fireSizeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{ label: "Fire Size (Million Acres)", borderColor: "blue", fill: false, data: [] }]
        }
    });

    updateCharts("all", fireData);

    // Event listener for the year dropdown
    document.getElementById("yearDropdown").addEventListener("change", function () {
        let selectedYear = this.value;
        updateCharts(selectedYear, fireData);
    });
}
