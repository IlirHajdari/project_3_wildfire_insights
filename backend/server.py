import os
import json
import requests
from flask import Flask, jsonify, request # type: ignore

app = Flask(__name__)

# S3 Public URL of wildfire data
AWS_S3_JSON_URL = "https://wildfiredatabin.s3.us-east-1.amazonaws.com/wildfire_data.json"

def stream_wildfire_data():
    
    try:
        response = requests.get(AWS_S3_JSON_URL, stream=True)
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                yield json.loads(line)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

@app.route('/search', methods=['GET'])
def search_wildfire_data():
    
    
    data_stream = stream_wildfire_data()
    if not data_stream:
        return jsonify({"error": "Failed to fetch json data from S3 bucket..."}), 500

    query = []

    # Get filters from URL params
    state = request.args.get('state')
    year = request.args.get('year')
    fire_size = request.args.get('fire_size')
    cause = request.args.get('cause')
    county = request.args.get('county')
    fire_name = request.args.get('fire_name')

    # Apply filters while streaming
    for fire in data_stream:
        if state and fire.get("State") != state.upper():
            continue
        if year and str(fire.get("Year")) != year:
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

    # Pagination 
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
    
    
    data_stream = stream_wildfire_data()
    if not data_stream:
        return jsonify({"error": "Failed to fetch json data from S3 bucket..."}), 500

    years = sorted(set(fire["Year"] for fire in data_stream if "Year" in fire))
    return jsonify({"available_years": years})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
