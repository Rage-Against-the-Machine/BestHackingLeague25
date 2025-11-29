from geopy.geocoders import Nominatim

class Location:
    def __init__(self, latitude, longitude):
        self.lat = latitude
        self.lon = longitude
        self.geointerpreter = Nominatim(user_agent="geoapi")
    
    def get_city(self):
        location = self.geointerpreter.reverse((self.lat, self.lon), language="en")
        address = location.raw.get("address", {})
        
        return (address.get("city") or
                address.get("town") or
                address.get("village") or
                address.get("hamlet") or
                "Unknown")
    
    def get_province(self):
        location = self.geointerpreter.reverse((self.lat, self.lon), language="en")
        address = location.raw.get("address", {})
        
        return address.get("state") or address.get("region") or "Unknown"
    
    def get_coords(self):
        return (self.lat, self.lon)
    

def merge_sort_ranking(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort_ranking(arr[:mid])
    right = merge_sort_ranking(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i].get_points() >= right[j].get_points():
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result
