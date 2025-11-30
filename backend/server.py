from classes.database_interface import DatabaseInterface
from classes.product import Product, get_all_products
from classes.store import Store, StoresRanking, get_all_stores
from classes.user import User, UsersRanking, get_all_users
from classes.utils import Location
from classes.qr_codes import QR_code

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import sys


SERVING_PORT = 6969
DB_URL = "mongodb://user:password@localhost:27017/"

if len(sys.argv) > 1 and sys.argv[1] == "docker":
    DB_URL = "mongodb://user:password@mongodb:27017/"


database = DatabaseInterface(DB_URL, "gazetka_main")

stores = get_all_stores(database)
users = get_all_users(database)
products = get_all_products(database)

app = Flask(__name__)
CORS(app)

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
    province = request.args.get('province', default=None, type=str)
    if province == None:
        results = stores_ranking.get_ranking_list()
    else:
        province_ranking = StoresRanking(stores, province)
        results = province_ranking.get_ranking_list()
    return jsonify(results)


@app.post('/add-store')
def add_store():
    global stores
    global stores_ranking
    data = request.get_json()
    name = data.get("name")
    location_raw = data.get("location")
    password = data.get("password")

    location = Location(location_raw[0], location_raw[1])

    id = store_id_available()

    new_store = Store(id, name, location, password)
    database.add_store(new_store)
    stores.append(new_store)
    
    stores_ranking = StoresRanking(stores)

    return jsonify({
        "status": "ok",
        "received": {
            "id" : id,
            "name": name,
            "location": location.get_coords(),
            "city" : location.get_city()
        }
    }), 200


@app.route('/products', methods=['GET'])
def get_products():
    output_list = []
    for prod in products:
        output_list.append(prod.prepare_dict())
    return jsonify(output_list)


@app.post('/add-product')
def add_product():
    global products
    data = request.get_json()
    name = data.get("name")
    series = data.get("series")
    price_original = data.get("price_original")
    price_users = data.get("price_users")
    exp_date = data.get("exp_date")
    EAN = data.get("EAN")
    category = data.get("category")
    store_id = data.get("store_id")
    quantity = data.get("quantity")
    photo_url = data.get("photo_url", "None")

    store = database.get_store(store_id)
    new_product = Product(name, series, price_original, price_users, exp_date, EAN, 
                        category, store, quantity, photo_url)
    
    database.add_product(new_product)
    products = get_all_products(database)

    return jsonify({
        "status": "ok",
        "received": {
            "id" : new_product.id, 
            "EAN" : new_product.EAN, 
            "quantity" : new_product.quantity,
            "store_name" : new_product.store.name
        }
    }), 200


@app.post('/buy-product')
def buy_product():
    global products
    global database
    global users
    global stores
    global stores_ranking
    data = request.get_json()
    qr_code = data.get("code")
    product_id = data.get("product_id")
    quantity = int(data.get("quantity"))
    store_id = data.get("store_id")

    user = database.get_user_from_qr_code(qr_code)
    store = database.get_store(store_id)
    product = database.get_product(product_id)

    score = product.calculate_score_for_one() * quantity
    store.add_points(score)
    user.add_points(product, quantity)
    product.update_quantity((-1)*quantity)
    database.update_prod_quantity(product, addition=False)

    database.update_user_points(user)
    database.update_store_points(store)

    products = get_all_products(database)
    users = get_all_users(database)
    stores = get_all_stores(database)

    stores_ranking = StoresRanking(stores)

    return jsonify({
        "status": "ok",
        "store_points" : store.get_points(),
        "users_points" : user.get_points()
        }), 200


@app.route('/generate-qr', methods=['GET'])
def generate_qr():
    username = request.args.get('username', default=None, type=str)
    user = database.get_user(username)
    if user == None:
        return jsonify({
            "error" : "user_not_existing"
        })
    qr_code = QR_code(user)
    database.add_qr_code(qr_code)

    return jsonify({
        "username" : user.username,
        "code" : qr_code.code
    })


@app.route('/get-user', methods=["GET"])
def get_user_info():
    username = request.args.get('username', default=None, type=str)
    user = database.get_user(username)
    if user == None:
        return jsonify({
            "error" : "user_not_existing"
        })
    user_dict = user.prepare_dict()
    user_dict.pop("password")
    return jsonify(user_dict)


@app.route('/validate-user', methods=["GET"])
def validate_user():
    username = request.args.get('username', default=None, type=str)
    password = request.args.get('password', default=None, type=str)
    user = database.get_user(username)
    if user == None:
        return jsonify({"validated?" : "false"})
    if password == user.password:
        return jsonify({"validated?" : "true"})
    else:
        return jsonify({"validated?" : "false"})
    

@app.route('/delete-product', methods=["GET"])
def delete_product():
    global products
    global database
    product_id = request.args.get('product_id', type=str)
    keep_quantity = request.args.get('keep', default=0, type=int)
    product_db = database.get_product(product_id)
    if product_db == None:
        return jsonify({"error" : "product not existing"})
    product_db.quantity = keep_quantity
    database.update_prod_quantity(product_db, addition=False)
    products = get_all_products(database)
    return jsonify({"done" : "ok"})


@app.post('/add-user')
def add_user_endpoint():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    new_user = User(username, email, password)
    new_user = database.add_user(new_user)
    users.append(new_user)

    return jsonify({
        "status": "ok",
        "username" : new_user.username,
        "email": new_user.email,
        "points" : new_user.points
    }), 200

@app.route('/validate-store', methods=["GET"])
def validate_store():
    name = request.args.get('name', default=None, type=str)
    password = request.args.get('password', default=None, type=str)
    found_stores = database.find("stores", {"name" : name})
    if len(found_stores) == 0:
        return jsonify({"validated?" : "false"})
    store_id = found_stores[0]["id"]
    store = database.get_store(store_id)
    if password == store.password:
        return jsonify({
            "validated?" : "true",
            "id" : store.id
        })
    else:
        return jsonify({"validated?" : "false"})
    
@app.route('/all-stores', methods=["GET"])
def get_all_stores_endpoint():
    stores_data = []
    stores_to_pull = get_all_stores(database)
    for s in stores_to_pull:
        without_pass = s.prepare_dict()
        without_pass.pop("password")
        stores_data.append(without_pass)
    return jsonify(stores_data)

@app.post('/update-product')
def update_product():
    global products
    data = request.get_json()
    prod_id = data.get("id")
    name = data.get("name")
    series = data.get("series")
    price_original = data.get("price_original")
    price_users = data.get("price_users")
    exp_date = data.get("exp_date")
    EAN = data.get("EAN")
    category = data.get("category")
    store_id = data.get("store_id")
    quantity = data.get("quantity")
    photo_url = data.get("photo_url", "None")

    store = database.get_store(store_id)
    new_product = Product(name, series, price_original, price_users, exp_date, EAN, 
                        category, store, quantity, photo_url, prod_id)
    database.delete("products", {"id" : prod_id})
    database.add_product(new_product)
    products = get_all_products(database)

    return jsonify({
        "status": "ok",
        "received": {
            "id" : new_product.id, 
            "EAN" : new_product.EAN, 
            "quantity" : new_product.quantity,
            "store_name" : new_product.store.name
        }
    }), 200

app.run(debug=True, host="0.0.0.0", port=SERVING_PORT)