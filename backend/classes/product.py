from classes.store import Store
from classes.database_interface import DatabaseInterface

class Product:
    def __init__(self, name, series, price_original, price_users, exp_date, EAN, category, store : Store, quantity, photo_url):
        self.name = name
        self.series = series
        self.price_original = price_original
        self.price_users = price_users
        self.exp_date = exp_date
        self.EAN = EAN
        self.category = category
        self.store = store
        self.quantity = quantity
        self.photo_url = photo_url
        self.id = f"{self.store.id}_{self.EAN}_{self.series}"

    @classmethod
    def from_database(cls, doc, database : DatabaseInterface):
        store = database.get_store(doc["store_id"])
        return cls(
            name = doc["name"],
            series = doc["series"],
            price_original = doc["price_original"],
            price_users = doc["price_users"],
            exp_date = doc["exp_date"],
            EAN = doc["EAN"],
            category = doc["category"],
            store = store,
            quantity = doc["quantity"],
            photo_url = doc["photo_url"]
        )

    def get_location_coords(self):
        return self.store.get_location().get_coords()
    
    def get_city(self):
        return self.store.get_location().get_city()
    
    def prepare_dict(self):
        return dict({
            "id" : self.id,
            "name" : self.name,
            "location" : self.get_location_coords(),
            "city" : self.get_city(),
            "series": self.series,
            "price_original": self.price_original,
            "price_users": self.price_users,
            "exp_date": self.exp_date,
            "EAN": self.EAN,
            "category": self.category,
            "store": self.store.name,
            "store_id" : self.store.id,
            "quantity": self.quantity,
            "photo_url" : self.photo_url
        })
    

def get_all_products(database : DatabaseInterface):
    product_records = database.get_all_products()
    product_objects = []
    for rec in product_records:
        product_objects.append(Product.from_database(rec, database))
    return product_objects
