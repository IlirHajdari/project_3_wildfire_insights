import os
from flask import Flask, jsonify, request # type: ignore
import json

app = Flask(__name__)

JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "wildfire_data.json")

with open(JSON_FILE_PATH, "r") as file:
    #this will only load json file if not too big
    wildfire_data = json.load(file)

@app.route('/search', methods=['GET'])
def search_wildfire_data():
    #filter data based on columns
    query = []

    # filters from url params
    state = request.args.get('state')
    year = request.args.get('year')
    fire_size = request.args.get('fire_size')
    cause = request.args.get('cause')
    county = request.args.get('county')
    fire_name = request.args.get('fire_name')

    # filters
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
        query.append(fire)

        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        total_records = len(query)
        start_index = (page - 1) * limit
        end_index = start_index + limit

        return jsonify({
            "page": page,
            "limit": limit,
            "total_records": total_records,
            "data": query[start_index:end_index]
        })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)