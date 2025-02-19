// Creating the map object
let myMap = L.map("map").setView([37.8, -96.9], 5);

// Adding the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create dropdown filters
let filters = ["yearSelector", "stateSelector"];
filters.forEach((filterId) => {
  let selector = document.createElement("select");
  selector.id = filterId;
  document.body.insertBefore(selector, document.body.firstChild);
});

// Load wildfire data from API
d3.json("USGS2014.json").then((response) => {
  console.log("Raw API Response:", response);

  /* // Ensure data exists
  if (!response.data || response.data.length === 0) {
    console.warn("No wildfire data found!");
    return;
  } */

    // Update error checking to match your data structure
  if (!Array.isArray(response)) {
    console.warn("Response is not an array!");
    return;
  }

  if (response.length === 0) {
    console.warn("No wildfire data found - empty array!");
    return;
  }
  let wildfireData = response;//.data; // Extract actual data array

  let years = [...new Set(wildfireData.map((d) => d.Year))].sort((a, b) => a - b);
  let states = [...new Set(wildfireData.map((d) => d.State))].sort();

  function populateDropdown(selectorId, options) {
    let selector = document.getElementById(selectorId);
    let allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    selector.appendChild(allOption);

    options.forEach((option) => {
      let opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      selector.appendChild(opt);
    });
  }

  populateDropdown("yearSelector", years);
  populateDropdown("stateSelector", states);

  function updateMap() {
    let selectedYear = document.getElementById("yearSelector").value;
    let selectedState = document.getElementById("stateSelector").value;

    myMap.eachLayer((layer) => {
      if (layer instanceof L.HeatLayer) {
        myMap.removeLayer(layer);
      }
    });

    let heatArray = wildfireData
      .filter(
        (incident) =>
          (selectedYear === "all" || incident.Year == selectedYear) &&
          (selectedState === "all" || incident.State == selectedState)
      )
      .map((incident) => [
        incident.Latitude,
        incident.Longitude,
        incident["Fire Size in Acres"],
      ]);

    let heat = L.heatLayer(heatArray, {
      radius: 8,
      blur: 10,
      minOpacity: 0.3,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    }).addTo(myMap);
  }

  // Initial map load
  updateMap();

  // Update map when filters are changed
  filters.forEach((filterId) => {
    document.getElementById(filterId).addEventListener("change", updateMap);
  });

  // Add heatmap legend - HTML coded here to pull values and do calculations
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let grades = ["blue", "lime", "yellow", "orange", "red"];
    let labels = [
      "< 100",
      "100 - 1000",
      "1000 - 5000",
      "5000 - 10000",
      "> 10000",
    ];

    div.innerHTML = "<strong>Fire Size (Acres)</strong><br>";
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += `<i style="background:${grades[i]}; width: 18px; height: 18px; display: inline-block;"></i> ${labels[i]}<br>`;
    }
    return div;
  };
  legend.addTo(myMap);
});
