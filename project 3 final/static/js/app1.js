// Creating the map object
let myMap = L.map("map", {
    center: [45.80, -98.57],
    zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

const stateNames = {    'AL': 'Alabama','AK': 'Alaska','AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
'CO': 'Colorado',
'CT': 'Connecticut',
'DE': 'Delaware',
'FL': 'Florida',
'GA': 'Georgia',
'HI': 'Hawaii',
'ID': 'Idaho',
'IL': 'Illinois',
'IN': 'Indiana',
'IA': 'Iowa',
'KS': 'Kansas',
'KY': 'Kentucky',
'LA': 'Louisiana',
'ME': 'Maine',
'MD': 'Maryland',
'MA': 'Massachusetts',
'MI': 'Michigan',
'MN': 'Minnesota',
'MS': 'Mississippi',
'MO': 'Missouri',
'MT': 'Montana',
'NE': 'Nebraska',
'NV': 'Nevada',
'NH': 'New Hampshire',
'NJ': 'New Jersey',
'NM': 'New Mexico',
'NY': 'New York',
'NC': 'North Carolina',
'ND': 'North Dakota',
'OH': 'Ohio',
'OK': 'Oklahoma',
'OR': 'Oregon',
'PA': 'Pennsylvania',
'RI': 'Rhode Island',
'SC': 'South Carolina',
'SD': 'South Dakota',
'TN': 'Tennessee',
'TX': 'Texas',
'UT': 'Utah',
'VT': 'Vermont',
'VA': 'Virginia',
'WA': 'Washington',
'WV': 'West Virginia',
'WI': 'Wisconsin',
'WY': 'Wyoming'
};

// Function to initialize state selector
async function initializeStateSelector() {
    // Use Object.keys to get all state codes from stateNames
    const states = Object.keys(stateNames).sort();
    const selector = document.getElementById("stateSelector");
    
    // Clear existing options
    selector.innerHTML = '';
    
    // Add options for each state
    states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = `${state} - ${stateNames[state]}`;
        selector.appendChild(option);
    });
}



// Function to update the map based on the selected state
function updateMap(state,year) {
    let baseurl = "http://54.166.204.12:5000/search";
    let url = `${baseurl}?state=${state}&year=${year}&fire_size=1000`;
    console.log("Making request to:", url);

 // Clear all existing markers before adding new ones
 myMap.eachLayer((layer) => {
    if (!(layer instanceof L.TileLayer)) {
        myMap.removeLayer(layer);
    }
});    

    // Fetching the JSON data
    d3.json(url).then((response) => {
        console.log(response);
        let data = response.data;

        myMap.eachLayer((layer) => {
            if (layer.options && layer.options.pane === 'markerPane') {
                myMap.removeLayer(layer);
            }
        });

        data.forEach((item) => {
            let latitude = item["Latitude"];
            let longitude = item["Longitude"];

            if (latitude && longitude) {
                // Add circle marker to the map
                let circleMarker = L.circleMarker([latitude, longitude], {
                    radius: 15,
                    color: "red",
                    fillColor: "orange",
                    fillOpacity: 0.6
                }).bindPopup(`
                    <strong>Fire Name:</strong> ${item["Fire Name"] || "Unknown"}<br>
                    <strong>County:</strong> ${item["County Name"] || "Unknown"}<br>
                    <strong>State:</strong> ${item["State"] || "Unknown"}<br>
                    <strong>Year:</strong> ${item["Year"] || "Unknown"}<br>
                    <strong>Fire Size:</strong> ${item["Fire Size in Acres"] || "Unknown"} acres<br>
                    <strong>Cause:</strong> ${item["Cause Description"] || "Unknown"}
                `);

                circleMarker.addTo(myMap);
            }
        });
    })
}
// Initialize both selectors
initializeStateSelector();

// Add event listeners for both dropdowns
document.getElementById("stateSelector").addEventListener("change", (event) => {
    let selectedState = event.target.value;
    let selectedYear = document.getElementById("yearSelector").value;
    updateMap(selectedState, selectedYear);
});

document.getElementById("yearSelector").addEventListener("change", (event) => {
    let selectedState = document.getElementById("stateSelector").value;
    let selectedYear = event.target.value;
    updateMap(selectedState, selectedYear);
});

// default map with current year
updateMap("AK", "2014");
