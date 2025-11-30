from classes.utils import Location, merge_sort_ranking

from datetime import datetime

class User:
    def __init__(self, username : str, email : str, password : str, points = None):
        self.username = username
        self.email = email
        self.password = password
        self.points = 0 if points == None else points

    @classmethod
    def from_database(cls, doc):
        return cls(
            username = doc["username"],
            email = doc["email"],
            password = doc["password"],
            points = doc["points"]
        )

    def generate_qr_code(self):
        return f"{self.username}_{datetime.now().strftime('%Y%m%d%H%M')}"
    
    def add_points(self, product, quantity):
        unit_saved_money = product.price_original - product.price_users
        saved_money = quantity * unit_saved_money
        points = int(saved_money * 100)
        self.points = self.points + points

    def get_points(self):
        return self.points
    
    def get_username(self):
        return self.username
    
    def get_location(self):
        return self.org_location
    
    def prepare_dict(self):
        return dict({
            "username" : self.username,
            "password" : self.password,
            "email" : self.email,
            "points" : self.points
        })
    

def get_all_users(database):
    users_records = database.get_all_users()
    users_objects = []
    for u in users_records:
        users_objects.append(User.from_database(u))
    return users_objects


class UsersRanking:
    def __init__(self, users : list[User], province = "global"):
        if province == "global":
            self.users = users
        else:
            self.users = []
            for u in users:
                if u.get_location().get_province() == province:
                    self.users.append(u)
        self.current_ranking = self.update_ranking()

    def update_ranking(self):
        self.current_ranking = merge_sort_ranking(self.users)
    
    def get_ranking_list(self):
        self.update_ranking()
        i = 1
        result = []
        for record in self.current_ranking:
            result.append({
                "place" : i, 
                "username" : record.get_username(),
                "points" : record.get_points(),
                "city" : record.get_location().get_city(),
                "province" : record.get_location().get_province()
            })
            i = i + 1
        return result

if __name__ == "__main__":
    # for local testing:
    location_1 = Location(51, 21)
    user_1 = User("mikolaj", location_1)
    user_1.add_points(200)
            
    location_2 = Location(51.1, 21)
    user_2 = User("ros", location_2)
    user_2.add_points(300)

    location_3 = Location(70, 21)
    user_3 = User("dupa", location_3)
    user_3.add_points(300)

    ranking = UsersRanking([user_1, user_2, user_3], province="Holy Cross Voivodeship")

    print(ranking.get_ranking_list())
