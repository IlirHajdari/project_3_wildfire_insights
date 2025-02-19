import os
from flask import Flask, jsonify, request  # type: ignore
import json

app = Flask(__name__)

# Load locally extracted JSON file
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "USGS2014.json")

# Load JSON once into memory
try:
    with open(JSON_FILE_PATH, "r") as file:
        wildfire_data = json.load(file)
    print("Successfully loaded USGS2014.json")
except Exception as e:
    print(f"Error loading USGS2014.json: {e}")
    wildfire_data = []

with open(JSON_FILE_PATH, "r") as file:
    wildfire_data = json.load(file)
print("Successfully loaded USGS2014.json")
print(f"First 5 records: {wildfire_data[:5]}") 

# Route to return wildfire data with pagination
@app.route('/search', methods=['GET'])
def search_wildfire_data():
    print(f"Total records loaded: {len(wildfire_data)}")  
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 500))
    
    if not wildfire_data:  
        return jsonify({"error": "No data found", "total_records": 0, "data": []})

    total_records = len(wildfire_data)
    start_index = (page - 1) * limit
    end_index = start_index + limit

    return jsonify({
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "data": wildfire_data[start_index:end_index]
    })
# Get available years
@app.route('/years', methods=['GET'])
def get_years():
    years = sorted(set(fire["Year"] for fire in wildfire_data if "Year" in fire))
    return jsonify({"available_years": years})

# Run Flask Server Locally
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
