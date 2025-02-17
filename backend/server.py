import os
from flask import Flask, jsonify, request  # type: ignore
import json
import requests

app = Flask(__name__)

# Locating JSON file
#JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "wildfire_data.json")

# Trying out S3 bucket instead of local JSON file path
AWS_S3_JSON_URL = "https://wildfiredatabin.s3.us-east-1.amazonaws.com/wildfire_data.json"

# Load JSON file once into memory
#with open(AWS_S3_JSON_URL, "r") as file:
    #wildfire_data = json.load(file)

# funciton to fetch data from s3
def fetch_wildfire_data():
    try:
        response = requests.get(AWS_S3_JSON_URL)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

@app.route('/search', methods=['GET'])
def search_wildfire_data():
    wildfire_data = fetch_wildfire_data()
    if not wildfire_data:
        return jsonify({"error": "Failed to fetch json data from s3 bucket..."}), 500 
    
    query = []

    # Get filters from URL params
    state = request.args.get('state')
    year = request.args.get('year')
    fire_size = request.args.get('fire_size')
    cause = request.args.get('cause')
    county = request.args.get('county')
    fire_name = request.args.get('fire_name')

    # Apply filters
    for fire in wildfire_data:
        if state and fire.get("State") != state.upper():
            continue
        if year and fire.get("Year") != int(year):
            continue
        if fire_size and fire.get("Fire Size in Acres", 0) < float(fire_size):
            continue
        if cause and fire.get("Cause Class") != cause.capitalize():
            continue
        if county and fire.get("County Name") != county.title():
            continue
        if fire_name and fire_name.lower() not in fire.get("Fire Name", "").lower():
            continue
        query.append(fire)  

    # Pagination (default: 1st page, 100 records per page)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 100))
    total_records = len(query)
    start_index = (page - 1) * limit
    end_index = start_index + limit

    
    return jsonify({
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "data": query[start_index:end_index] if query else []
    })

@app.route('/years', methods=['GET'])
def get_years():
    
    years = sorted(set(fire["Year"] for fire in wildfire_data))
    return jsonify({"available_years": years})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)