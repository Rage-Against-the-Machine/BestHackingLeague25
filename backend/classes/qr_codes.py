from datetime import datetime

class QR_code:
    def __init__(self, user, date = None, code = None):
        self.user = user
        self.date = datetime.now() if date == None else date
        self.code = f"{self.user.username}_{self.date.strftime('%Y%m%d%H%M%S')}" if code == None else code

    @classmethod
    def from_database(cls, doc, database):
        user_db = database.get_user(doc["user"])
        return cls(
            user = user_db,
            code = doc["code"], 
            date = datetime.strptime(doc["date"], "%Y%m%d%H%M%S")
        )

    def prepare_dict(self):
        return dict({
            "user" : self.user.username,
            "code" : self.code,
            "date" : self.date.strftime("%Y%m%d%H%M%S")
        })