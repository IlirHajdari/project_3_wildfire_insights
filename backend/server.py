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

    



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)