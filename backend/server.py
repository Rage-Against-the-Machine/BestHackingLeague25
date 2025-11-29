from classes.database_interface import DatabaseInterface
from classes.product import Product, get_all_products
from classes.store import Store, StoresRanking, get_all_stores
from classes.user import User, UsersRanking, get_all_users
from classes.utils import Location

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np


SERVING_PORT = 6969
DB_URL = "mongodb://user:password@localhost:27017/"

database = DatabaseInterface(DB_URL, "gazetka_main")

users = get_all_users(database)
products = get_all_products(database)
stores = get_all_stores(database)

app = Flask(__name__)
CORS(app)

user_ranking = UsersRanking(users)
stores_ranking = StoresRanking(stores)

def store_id_available():
    done = False
    while not done:
        id = np.random.randint(0, 100000)
        if len(database.find("stores", { "id" : id})) == 0:
            done = True
            return id

@app.route('/stores-ranking', methods=['GET'])
def get_stores_ranking():
    province = request.args.get('from', default=None, type=str)
    if province == None:
        results = stores_ranking.get_ranking_list()
    else:
        province_ranking = StoresRanking(stores, province)
        results = province_ranking.get_ranking_list()
    return jsonify(results)


@app.post('/add-store')
def add_store():
    data = request.get_json()
    name = data.get("name")
    location_raw = data.get("location")

    location = Location(location_raw[0], location_raw[1])

    id = store_id_available()

    new_store = Store(id, name, location)
    database.add_store(new_store)
    stores.append(new_store)
    stores_ranking.add_store(new_store)

    return jsonify({
        "status": "ok",
        "received": {
            "id" : id,
            "name": name,
            "location": location.get_coords(),
            "city" : location.get_city()
        }
    }), 200



app.run(debug=True, host="0.0.0.0", port=SERVING_PORT)