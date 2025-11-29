import pymongo

from user import User
from store import Store

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
        return self.find("users", {})
    
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