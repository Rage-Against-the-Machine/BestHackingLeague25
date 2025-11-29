from utils import Location, merge_sort_ranking

class Store:
    def __init__(self, id, name : str, location : Location):
        self.id = id
        self.name = name
        self.location = location
        self.points = 0

    def prepare_dict(self):
        return dict({
            "id" : self.id,
            "name" : self.name,
            "location" : self.location.get_coords(),
            "city" : self.location.get_city(),
            "points" : self.points
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
        self.current_ranking = self.update_ranking()

    def update_ranking(self):
        self.current_ranking = merge_sort_ranking(self.stores)
    
    def get_ranking_list(self):
        self.update_ranking()
        i = 1
        result = []
        for record in self.current_ranking:
            result.append({
                "place" : i, 
                "name" : record.get_name(),
                "points" : record.get_points(),
                "city" : record.get_location().get_city(),
                "province" : record.get_location().get_province()
            })
            i = i + 1
        return result