from classes.utils import Location, merge_sort_ranking

class Store:
    def __init__(self, id, name : str, location : Location, password, points = 0):
        self.id = id
        self.name = name
        self.location = location
        self.points = points
        self.password = password

    @classmethod
    def from_database(cls, doc):
        return cls(
            id = doc["id"],
            name = doc["name"],
            location = Location(doc["location"][0], doc["location"][1]),
            password = doc["password"],
            points = doc["points"]
        )

    def prepare_dict(self):
        return dict({
            "id" : self.id,
            "name" : self.name,
            "location" : self.location.get_coords(),
            "city" : self.location.get_city(),
            "points" : self.points,
            "password" : self.password
        })
    
    def add_points(self, points : int):
        self.points = self.points + points

    def get_points(self):
        return self.points
    
    def get_location(self):
        return self.location
    

class StoresRanking:
    def __init__(self, stores : list[Store], province = "global"):
        if province == "global":
            self.stores = stores
        else:
            self.users = []
            for u in stores:
                if u.get_location().get_province() == province:
                    self.stores.append(u)
        self.current_ranking = None
        self.update_ranking()

    def update_ranking(self):
        self.current_ranking = merge_sort_ranking(self.stores)
    
    def get_ranking_list(self):
        i = 1
        result = []
        for record in self.current_ranking:
            result.append({
                "place" : i, 
                "name" : record.name,
                "points" : record.get_points(),
                "coords" : record.get_location().get_coords(),
                "store_id" : record.id
            })
            i = i + 1
        return result
    
    def add_store(self, store):
        self.stores.append(store)
    
    def add_to_end(self, record : Store):
        self.current_ranking.append(record)
    
def get_all_stores(database):
    stores_records = database.get_all_stores()
    stores_objects = []
    for s in stores_records:
        stores_objects.append(Store.from_database(s))
    return stores_objects