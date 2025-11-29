import requests

def send_to_endpoint_store(url, name, location):
    payload = {
        "name": name,
        "location": location
    }

    response = requests.post(url, json=payload)
    return response

def send_to_endpoint_product(
        url,
        name,
        series,
        price_original,
        price_users,
        exp_date,
        EAN,
        category,
        store_id,
        quantity,
        photo_url="None"
    ):

    payload = {
        "name": name,
        "series": series,
        "price_original": price_original,
        "price_users": price_users,
        "exp_date": exp_date,
        "EAN": EAN,
        "category": category,
        "store_id": store_id,
        "quantity": quantity,
        "photo_url": photo_url
    }

    print(payload)

    response = requests.post(url, json=payload)
    return response


# send_to_endpoint_store("http://localhost:6969/add-store", "truskawka", (54,69))
resp = send_to_endpoint_product(
    "http://localhost:6969/add-product",
    name="Coca Cola",
    series="Classic",
    price_original=5.99,
    price_users=4.99,
    exp_date="2025-12-01",
    EAN="1234567890123",
    category="Drinks",
    store_id=0,
    quantity=10,
    photo_url="https://example.com/photo.jpg"
)

print(resp.status_code)
print(resp.json())