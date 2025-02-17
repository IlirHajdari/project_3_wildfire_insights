// Initialize the map
let myMap = L.map("map").setView([37.8, -96.9], 6);

// Add a base layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(myMap);

// Layer group for wildfires
let wildfireLayer = L.layerGroup().addTo(myMap);

// Function to determine marker size based on fire size (acres)
function getSize(acres) {
    return acres ? Math.sqrt(acres) * 1.2 : 2;  // Adjusted for better visibility
}

// Function to determine marker color based on cause class
function getColor(cause) {
    return cause === "Natural" ? "green" : "red";
}

// Global variable for wildfire data
let wildfireData;

// Load JSON wildfire data
d3.json("USGS2014.json").then(function(data) {
    console.log(data);
    wildfireData = data;  // Updated to use the entire data array
    populateFilters(data);
    updateWildfireLayer("all", "all", "all", "all", 1);
});

// Function to populate filters dynamically
function populateFilters(data) {
    let years = [...new Set(data.map(f => f["Year"]))].sort();
    let states = [...new Set(data.map(f => f["State"]))].sort();

    let yearFilter = document.getElementById("yearFilter");
    let stateFilter = document.getElementById("stateFilter");

    years.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    states.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });

    // Add Event Listeners
    yearFilter.addEventListener("change", updateFilters);
    stateFilter.addEventListener("change", updateFilters);
    document.getElementById("sizeFilter").addEventListener("change", updateFilters);
    document.getElementById("causeFilter").addEventListener("change", updateFilters);
    document.getElementById("daySlider").addEventListener("input", updateFilters);
}

// Function to update filters
function updateFilters() {
    let cause = document.getElementById("causeFilter").value;
    let year = document.getElementById("yearFilter").value;
    let state = document.getElementById("stateFilter").value;
    let size = document.getElementById("sizeFilter").value;
    let day = document.getElementById("daySlider").value;

    document.getElementById("sliderValue").innerText = day;
    updateWildfireLayer(cause, year, size, state, day);
}

// Function to update wildfire markers based on filters
function updateWildfireLayer(selectedCause, selectedYear, selectedSize, selectedState, selectedDay) {
    wildfireLayer.clearLayers();

    let filteredData = wildfireData.filter(f => {
        let causeMatch = selectedCause === "all" || f["Cause Class"] === selectedCause;
        let yearMatch = selectedYear === "all" || f["Year"] == selectedYear;
        let stateMatch = selectedState === "all" || f["State"] === selectedState;
        let size = f["Fire Size in Acres"];
        let sizeMatch = selectedSize === "all" ||
                        (selectedSize === "small" && size <= 999) ||
                        (selectedSize === "medium" && size > 1000 && size <= 4999) ||
                        (selectedSize === "large" && size >= 5000);
        let dayMatch = f["Discovery Date (Days out of the Year)"] == selectedDay;

        return causeMatch && yearMatch && stateMatch && sizeMatch && dayMatch;
    });

    filteredData.forEach(f => {
        let latlng = [f["Latitude"], f["Longitude"]];
        L.circleMarker(latlng, {
            radius: getSize(f["Fire Size in Acres"]),
            fillColor: getColor(f["Cause Class"]),
            color: "black",
            weight: 0.5,
            fillOpacity: 0.8
        }).addTo(wildfireLayer);
    });
}
