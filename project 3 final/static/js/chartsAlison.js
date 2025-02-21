
// Function to load the data

/* async function loadZippedJson(url) {
    try {
        console.log("Fetching zipped JSON...");
        const response = await fetch(url);
        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);
        const jsonFileName = 'USGS2014.json';
        const jsonData = await zip.file(jsonFileName).async("string");
        const data = JSON.parse(jsonData);
        console.log("Data loaded:", data);
        initialize(data);
    } catch (error) {
        console.error("Error loading zipped JSON:", error);
    };
}
loadZippedJson('USGS2014.json'); */

d3.json("USGS2014.json").then((data) =>{
// function to process the data

function processFireInfo(data){
    console.log("Processing fire info...", data);
    if (!data || !Array.isArray(data)){
        console.error("Invalid data format:", data);
        return [];
    }
    return data.map(fire => ({
        year: fire["Year"],
        fireAcres: parseFloat(fire["Fire Size in Acres"]) || 0,
        state: fire["State"],
        fireCount: 1
    }));
}

// populate the dropdown    

function populateDropdown(selectorId, options) {
    let selector = document.getElementById(selectorId);
    let allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    selector.appendChild(allOption);
        
    options.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        selector.appendChild(opt);
    });
}   
// function to initialize state selector
function initializeStateSelector(data) {
    let stateNames = [...new Set(data.map(fire => fire.state))].sort();
    console.log("State names:", stateNames);
    populateDropdown("stateSelector", stateNames);

    document.getElementById("stateSelector").addEventListener("change", function() {
        const selectedState = this.value;
        console.log("Selected state:", selectedState);
        buildBarChart(selectedState, data);
        buildBarChart2(selectedState, data);
    });

    // set default state for initial load
    const defaultState = stateNames[0];
    if(defaultState) {
        buildBarChart(defaultState, data);
        buildBarChart2(defaultState, data);
    }
}

// function to build the bar chart
function buildBarChart(state, data)
{    
        console.log("Building bar chart for state:", state);
        let fireData = data.filter(fire => fire.state === state);  // Access the array
        console.log("Filtered fireData for State:", fireData);
        let years = fireData.map(fire => fire.year);
        console.log("Years:", years);
        let acres = fireData.map(fire => parseFloat(fire.fireAcres) || 0);  
        console.log("Acres:", acres); 
        
        // Filter out zero values
        let nonZeroAcres = acres.filter(a => a > 0);
        let nonZeroYears = years.slice(0, nonZeroAcres.length);
        console.log("Non-zero Acres:", nonZeroAcres);
        console.log("Corresponding Years:", nonZeroYears);

        if (nonZeroAcres.length === 0) {
            console.log("No non-zero data available for state:", state);
            return;
        }
       

        let barChart = {
            y: nonZeroAcres,
            x: nonZeroYears,
            type: "bar",
            
        };

        let layout = {
            title: "Acres Burned Per Year 2014-2020",
            xaxis: { title: "Year" },
            yaxis: { title: "Acres Burned" }
        };

        Plotly.newPlot("bar", [barChart], layout);
    }

// function to build the 2nd bar chart
function buildBarChart2(state, data)
{    
        console.log("Building bar chart 2 for state:", state);
        let fireData = data.filter(fire => fire.state === state);  // Access the array
        console.log("Filtered fireData for state:", fireData);

        // Group data by year and count the number of fires per year
        let fireCountsByYear = {};
        fireData.forEach(fire => {
            if (fireCountsByYear[fire.year]) {
                fireCountsByYear[fire.year]++;
            } else {
                fireCountsByYear[fire.year] = 1;
            }
        });
        
        
        let years = Object.keys(fireCountsByYear);
        console.log("Years:", years);
        let fireCounts = Object.values(fireCountsByYear);  
        console.log("Fire Counts:", fireCounts);

        if (fireCounts === 0) {
            console.log("No fire data available for state:", state);
            return;
        }
            
        let barChart2 = {
            y: fireCounts,
            x: years,
            text: fireCounts.map(count => count + " fires"),
            type: "bar",
                
        };
    
        let layout = {
            title: "Number of Fires Per Year 2014-2020",
            xaxis: { title: "Years" },
            yaxis: { title: "Fires" }
         };
    
            Plotly.newPlot("bar2", [barChart2], layout);
        }
    

//function that initializes the charts
function initializeCharts(fireInfo)
{
        console.log("Initializing Charts...");
        let stateNames = [...new Set(fireInfo.map(fire => fire.state))]; //data.State;
        let dropdown = document.getElementById("stateSelector")

        dropdown.innerHTML = '';

        stateNames.forEach(state => {
            let opt = document.createElement("option");
            opt.value = state;
            opt.textContent = state;
            dropdown.appendChild(opt);
        });

        let defaultState = stateNames[0];
        if(defaultState) {
            buildBarChart(defaultState, fireInfo);
            buildBarChart2(defaultState, fireInfo);
        }
        
    }

// define the initialize function to initialize everything
function initialize(data) {
    console.log("Initializing with data:", data);
    let fireInfo = processFireInfo(data);
    console.log("Processed fire info:", fireInfo);
    initializeCharts(fireInfo);
    initializeStateSelector(fireInfo);
}

initialize(data); 
});


    
