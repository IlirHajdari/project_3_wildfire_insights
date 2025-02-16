import os
import json
from flask import Flask, jsonify, request # type: ignore

app = Flask(__name__)

JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "wildfire_data.json")


def stream_json():
    # streaming json data
    with open(JSON_FILE_PATH, "r") as file:
        for line in file:
            yield json.loads(line.strip())


@app.route('/search', methods=['GET'])
def search_wildfire_data():
    
    query = []
    state = request.args.get('state')
    year = request.args.get('year')
    fire_size = request.args.get('fire_size')
    cause = request.args.get('cause')
    county = request.args.get('county')
    fire_name = request.args.get('fire_name')

    for fire in stream_json():
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
        if len(query) >= 100:  
            break

    return jsonify({
        "total_records": len(query),
        "data": query
    })


@app.route('/years', methods=['GET'])
def get_years():
    
    years = set()
    for fire in stream_json():
        if "Year" in fire:
            years.add(fire["Year"])
        if len(years) > 100:  # Prevent excessive memory usage
            break
    return jsonify({"available_years": sorted(years)})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)