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

## **How to Run the Project Locally /VERY IMPORTANT/ **

### **1️⃣ Clone the project files to your local machine **

- Once copied, open you file explorer on your pc
- Navigate to the project directory(folder) and then to frontend/pages
- Here, you will see the zipped json folder
- Extract that into the pages directory
- Once extracted, you will see that a new folder has been created
- open the folder, copy the json file that is inside of the folder, then navigate back out to the pages directory
- paste the json file in the pages directory and then delete the folder containing the json file that was created when initially unzipping the json

### **2️⃣ Running the Frontend**

Open the `index.html` file inside `/frontend/` in your browser.

If using **VS Code**, install the **Live Server** extension and start the server.

---

## **🔥 Deploying Flask API on AWS EC2**

To showcase backend deployment skills, the Flask API is hosted on **AWS EC2** with a **public IP**. This setup enables live access to wildfire data.

### **1️⃣ Launching an EC2 Instance**

- **AMI:** Amazon Linux 2
- **Instance Type:** t2.micro (Free Tier eligible)
- **Security Group:**
  - Allow **Inbound Rules**:
    - SSH (port 22) → **Your IP**
    - HTTP (port 5000) → **Anywhere**
- **Key Pair:** Download and store safely to connect via SSH.

### **2️⃣ Connecting to the EC2 Instance**

```bash
ssh -i /path/to/key.pem ec2-user@your-ec2-public-ip
```

### **3️⃣ Setting Up Flask on EC2**

```bash
# Update packages and install dependencies
sudo yum update -y
sudo yum install python3 -y
pip3 install flask flask-cors requests
```

### **4️⃣ Uploading the Project Files**

Transfer files to EC2 using **scp**:

```bash
scp -i /path/to/key.pem -r /local/project/directory ec2-user@your-ec2-public-ip:/home/ec2-user/
```

### **5️⃣ Running the Flask API on EC2**

```bash
cd /home/ec2-user/project_3_wildfire_insights/backend
python3 server.py
```

Now the API is accessible at:

```
http://your-ec2-public-ip:5000
```

## The above will only work if you have access to an EC2 instance on AWS.

## Other than that, this section was to show that the team has the ability to host the data via a live server

---

## **Tools & Technologies**

- **Flask** → Backend API
- **AWS EC2** → Live API Hosting
- **JavaScript (D3.js, Leaflet.js)** → Data visualization & mapping
- **HTML/CSS** → Frontend UI
- **Pandas & Jupyter Notebooks** → Data analysis

---

## **Contributors**

- **Alison** - Visualization
- **Brenda** -
- **Bridgette** - Frontend
- **Curtis** - Frontend & Visualization
- **Ilir** - API Development & Backend Integration
- **Jim** - Frontend & Visualization
- **Molly** - Data cleaning & JSON conversion
- **Omar** - Frontend & Visualization
- **Rosy** - Frontend & Visualization
- **Sunil** - Database Creation, Visualizations, & Grand Webmaster

## Data

National Interagency Fire Occurrence Sixth Edition 1992-2020 (Feature Layer), https://catalog.data.gov/dataset/national-interagency-fire-occurrence-sixth-edition-1992-2020-feature-layer

[^1]: The Latest Data Confirms: Forest Fires Are Getting Worse, World Resources Institute, August 13, 2024, https://www.wri.org/insights/global-trends-forest-fires
[^2]: Indicators of Forest Extent, April 4, 2024, https://research.wri.org/gfr/forest-extent-indicators/forest-loss
[^3]: J.K. Balch, B.A. Bradley, J.T. Abatzoglou, R.C. Nagy, E.J. Fusco, & A.L. Mahood, 2017, Human-started wildfires expand the fire niche across the United States, Proc. Natl. Acad. Sci. U.S.A. 114 (11) 2946-2951, https://doi.org/10.1073/pnas.1617394114, https://www.pnas.org/doi/10.1073/pnas.1617394114
[^4]: NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate Disasters, 2025, https://www.ncei.noaa.gov/access/billions/events/US/1990-2024?disasters[]=wildfire
[^5]: NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate Disasters, 2025, https://www.ncei.noaa.gov/access/billions/summary-stats/US/2015-2024
