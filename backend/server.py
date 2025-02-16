import os
import json
from flask import Flask, jsonify, request # type: ignore

app = Flask(__name__)

# finds JSON file
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "wildfire_data.json")


# Loads JSON file
def load_wildfire_data():
    try:
        with open(JSON_FILE_PATH, "r") as file:
            #return json.load(file) 
            for line in file:
                yield json.loads(line.strip()) 
    except (MemoryError, FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading data: {e}")
        yield from []  # Return empty if error


@app.route('/search', methods=['GET'])
def search_wildfire_data():

    query = []

    # Get filters from URL params
    state = request.args.get('state')
    year = request.args.get('year')
    fire_size = request.args.get('fire_size')
    cause = request.args.get('cause')
    county = request.args.get('county')
    fire_name = request.args.get('fire_name')

    # filters data based on URL params
    for fire in load_wildfire_data:
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

    # pagination (100 records per page)
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
    #Get all unique years

    years = set()
    for fire in load_wildfire_data():
        if "Year" in fire:
            years.add(fire["Year"])
    
    return jsonify(sorted(years))
    
   
    
 


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
