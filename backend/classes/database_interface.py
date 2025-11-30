import pymongo

from classes.user import User
from classes.store import Store
from classes.qr_codes import QR_code

class DatabaseInterface:
    def __init__(self, host : str, database_name : str):
        self.client = pymongo.MongoClient(host)
        self.database = self.client[database_name]

    def add(self, record : dict, collection_name : str):
        collection = self.database[collection_name]
        collection.insert_one(record)

    def find(self, collection_name : str, query):
        try:
            collection = self.database[collection_name]
            results = list(collection.find(query))
        except Exception:
            results = []
        return list(results)
    
    def add_user(self, user : User) -> User:
        user_dict = user.prepare_dict()
        done = False
        while not done:
            if len(self.find("users", { "username" : user_dict["username"] })) == 0:
                self.add(user_dict, "users")
                done = True
            else:
                user_dict["username"] = user_dict["username"] + "0"
        user.username = user_dict["username"]
        return user

    def add_store(self, store : Store):
        store_dict = store.prepare_dict()
        self.add(store_dict, "stores")

    def get_all_users(self):
        users = self.find("users", {})
        if len(users) > 0:
            return users
        else:
            return []
    
    def get_user(self, username):
        user_raw = self.find("users", {"username" : username})[0]
        user = User.from_database(user_raw)
        return user
    
    def update_user_points(self, user : User):
        collection = self.database["users"]
        collection.update_one(
            {"username": user.username},
            {"$set": {"points": user.get_points()}}
        )

    def get_all_stores(self):
        return self.find("stores", {})
    
    def update_store_points(self, store : Store):
        collection = self.database["stores"]
        collection.update_one(
            {"id": store.id},
            {"$set": {"points": store.get_points()}}
        )

    def get_store(self, id) -> Store:
        store = Store.from_database(self.find("stores", {"id" : id})[0])
        return store
    
    def get_all_products(self):
        return self.find("products", {})
    
    def update_prod_quantity(self, product, addition = True):
        collection = self.database["products"]
        if addition:
            from classes.product import Product
            current_prod = Product.from_database(self.find("products", {"id": product.id})[0], self)
            collection.update_one(
                {"id": current_prod.id},
                {"$set": {"quantity": current_prod.quantity + product.quantity}}
            )
        else:
            if product.quantity == 0:
                collection.delete_one({"id": product.id})
            else:
                collection.update_one(
                        {"id": product.id},
                        {"$set": {"quantity": product.quantity}}
                    )


    def add_product(self, product):
        if len(self.find("products", {"id" : product.id})) == 0:
            product_dict = product.prepare_dict()
            self.add(product_dict, "products")
        else:
            self.update_prod_quantity(product)

    def delete(self, collection_name, query):
        collection = self.database[collection_name]
        collection.delete_many(query)

    def add_qr_code(self, code : QR_code):
        if len(self.find("qr_codes", {"code" : code.code})) == 0:
            self.add(code.prepare_dict(), "qr_codes")

    def get_user_from_qr_code(self, code_raw : str) -> User:
        if len(self.find("qr_codes", {"code" : code_raw})) != 0:
            code_found = self.find("qr_codes", {"code" : code_raw})[0]
            code = QR_code.from_database(code_found, self)
            return code.user
        
    def get_product(self, product_id):
        from classes.product import Product
        raw_product = self.find("products", {"id" : product_id})[0]
        product = Product.from_database(raw_product, self)
        return product

