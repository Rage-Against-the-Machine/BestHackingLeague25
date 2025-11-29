import pymongo

from user import User
from store import Store

class Database:
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
        return results
    
    def add_user(self, user : User):
        user_dict = user.prepare_dict()
        done = False
        while not done:
            if len(self.find("users", { "username" : user_dict["username"] })) == 0:
                self.add(user_dict, "users")
                done = True
            else:
                user_dict["username"] = user_dict["username"] + "0"

    def add_store(self, store : Store):
        store_dict = store.prepare_dict()
        self.add(store_dict, "stores")