# U.S. Wildfires Data Visualization

## **Description**

This project provides an **interactive visualization** of U.S. wildfire data using a **Flask API and Leaflet.js**. Users can query wildfire data and visualize fire occurrences on an interactive heatmap.

---

## **Summary**

### **🔥 Part 1: Flask API for Wildfire Data**

The backend serves wildfire data stored in a **local JSON file** (`USGS2014.json`). The API allows filtering wildfire records by:

- **State**
- **Year**
- **Fire Size**
- **Cause**
- **County**
- **Fire Name**

#### **Key API Endpoints:**

| **Endpoint** | **Description**                               | **Example**                  |
| ------------ | --------------------------------------------- | ---------------------------- |
| `/search`    | Retrieve wildfire data with optional filters. | `/search?state=CA&year=2020` |
| `/years`     | Get a list of available years in the dataset. | `/years`                     |

---

### **🔥 Part 2: Interactive Heatmap with Leaflet.js**

The front end uses **Leaflet.js** to generate an interactive **wildfire heatmap**. Users can **filter wildfires by year and state** and visualize their distribution on the map.

#### **Key Features:**

- **Dropdown filters** for state and year.
- **Heatmap visualization** with color intensity based on fire size.
- **Popups displaying fire details** (fire name, acres burned, cause, etc.).

---

## **Project Structure**

```
/project_3_wildfire_insights
│── /backend                # Flask API backend
│   ├── app.py              # Main Flask app entry point
│   ├── server.py           # API logic
│   ├── requirements.txt    # Dependencies
│── /data                   # Local wildfire dataset
│   ├── USGS2014.json       # Wildfire data in JSON format
│── /frontend               # Frontend visualization
│   ├── /static             # Static web assets
│   │   ├── css/            # Stylesheets
│   │   ├── js/             # JavaScript files
│   │   ├── images/         # Image assets
│   ├── /pages              # Individual HTML pages
│── /notebooks              # Jupyter Notebooks for data analysis
│── README.md               # Project documentation
```

---

## **How to Run the Project Locally**

### **1️⃣ Setting Up the Flask API**

Ensure you have **Python 3+** installed.

```bash
# Clone the repository
git clone https://github.com/IlirHajdari/project_3_wildfire_insights.git
cd project_3_wildfire_insights/backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Mac/Linux
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Start the Flask API
python server.py
```

Once the API is running, it will be available at:

```
http://127.0.0.1:5000
```

### **2️⃣ Running the Frontend**

Open the `index.html` file inside `/frontend/pages` in your browser.

If using **VS Code**, install the **Live Server** extension and start the server.

---

## **Tools & Technologies**

- **Flask** → Backend API
- **JavaScript (D3.js, Leaflet.js)** → Data visualization & mapping
- **HTML/CSS** → Frontend UI
- **Pandas & Jupyter Notebooks** → Data analysis

---

## **Contributors**

- **Alison** - Visualization
- **Brenda** - Visualization
- **Bridgette** - Frontend
- **Curtis** - Frontend & Visualization
- **Ilir** - API Development & Backend Integration
- **Jim** - Frontend & Visualization
- **Molly** - Data cleaning & JSON conversion
- **Omar** - Frontend & Visualization
- **Rosy** - Frontend & Visualization
- **Sunil** - Database Creation & Visualization

## Data

National Interagency Fire Occurrence Sixth Edition 1992-2020 (Feature Layer), https://catalog.data.gov/dataset/national-interagency-fire-occurrence-sixth-edition-1992-2020-feature-layer

[^1]: The Latest Data Confirms: Forest Fires Are Getting Worse, World Resources Institute, August 13, 2024, https://www.wri.org/insights/global-trends-forest-fires
[^2]: Indicators of Forest Extent, April 4, 2024, https://research.wri.org/gfr/forest-extent-indicators/forest-loss
[^3]: J.K. Balch, B.A. Bradley, J.T. Abatzoglou, R.C. Nagy, E.J. Fusco, & A.L. Mahood, 2017, Human-started wildfires expand the fire niche across the United States, Proc. Natl. Acad. Sci. U.S.A. 114 (11) 2946-2951, https://doi.org/10.1073/pnas.1617394114, https://www.pnas.org/doi/10.1073/pnas.1617394114
[^4]: NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate Disasters, 2025, https://www.ncei.noaa.gov/access/billions/events/US/1990-2024?disasters[]=wildfire
[^5]: NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate Disasters, 2025, https://www.ncei.noaa.gov/access/billions/summary-stats/US/2015-2024
