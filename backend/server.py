from classes.database_interface import DatabaseInterface
from classes.product import Product, get_all_products
from classes.store import Store, StoresRanking, get_all_stores
from classes.user import User, UsersRanking, get_all_users
from classes.utils import Location

import flask 
import flask_cors
import pymongo


SERVING_PORT = 6969
DB_URL = "mongodb://user:password@localhost:27017/"

database = DatabaseInterface(DB_URL, "gazetka_main")

users = get_all_users(database)
products = get_all_products(database)
stores = get_all_stores(database)

# store_zabka = Store(0, "zabka", Location(51.1, 27.1))
# database.add_store(store_zabka)

# store_biedronka = Store(1, "biedronka", Location(51,27))
# database.add_store(store_biedronka)

store_zabka = stores[0]

# store_zabka.add_points(100)
# database.update_store_points(store_zabka)

print(store_zabka.prepare_dict())

stores = get_all_stores(database)

ranking = StoresRanking(stores)

print(ranking.get_ranking_list())