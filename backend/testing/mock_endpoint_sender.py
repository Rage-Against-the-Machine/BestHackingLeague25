import requests

def send_to_endpoint_store(url, name, location, password):
    payload = {
        "name": name,
        "location": location,
        "password" : password
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

def send_buy_product_request(url, code, product_id, quantity, store_id):
    payload = {
        "code": code,
        "product_id": product_id,
        "quantity": quantity,
        "store_id": store_id
    }

    print(payload)

    response = requests.post(url, json=payload)
    return response

def send_add_user_request(url, username, email, password):
    payload = {
        "username": username,
        "password": password,
        "email": email
    }

    print(payload)

    response = requests.post(url, json=payload)
    return response

# send_to_endpoint_store("http://localhost:6969/add-store", "zabka", (51.1,21.1), "dupa")

# resp = send_to_endpoint_product(
#     "http://localhost:6969/add-product",
#     name="Zoladkowa Gorzka",
#     series="Classic",
#     price_original=5.99,
#     price_users=4.99,
#     exp_date="2025-12-01",
#     EAN="21376969",
#     category="Drinks",
#     store_id=0,
#     quantity=10,
#     photo_url="https://example.com/photo.jpg"
# )

# print(resp.status_code)
# print(resp.json())

# resp = send_buy_product_request(
#     "http://localhost:6969/buy-product",
#     code="julek_20251130043352",
#     product_id="0_1234567890123_Classic_499",
#     quantity=5,
#     store_id=0
# )

# resp = send_add_user_request(
#     "http://localhost:6969/add-user",
#     username="julek",
#     email = "julek@mock",
#     password = "gowno"
# )

# resp = send_add_user_request(
#     "http://localhost:6969/add-user",
#     username="roszczyk",
#     email = "roszczyk@mock",
#     password = "dupa"
# )



# print(resp.status_code)
# print(resp.json())