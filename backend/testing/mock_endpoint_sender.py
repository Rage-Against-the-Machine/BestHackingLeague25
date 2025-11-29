import requests

def send_to_endpoint(url, name, location):
    payload = {
        "name": name,
        "location": location
    }

    response = requests.post(url, json=payload)
    return response

send_to_endpoint("http://localhost:6969/add-store", "truskawka", (54,69))