import pytest
from unittest.mock import MagicMock, patch
from flask import json
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import server as flask_app_module


@pytest.fixture
def client():
    flask_app_module.app.config['TESTING'] = True
    with flask_app_module.app.test_client() as client:
        yield client


# ---------------------------
# MOCK DATABASE
# ---------------------------
@pytest.fixture(autouse=True)
def mock_database():
    with patch.object(flask_app_module, "database") as mock_db:
        mock_db.get_store.return_value = MagicMock()
        mock_db.get_product.return_value = MagicMock()
        mock_db.get_user_from_qr_code.return_value = MagicMock()
        mock_db.get_user.return_value = MagicMock()
        mock_db.find.return_value = []
        mock_db.get_products_dicts.return_value = []
        mock_db.get_all_stores.return_value = []
        yield mock_db


# ---------------------------
# TEST /add-store
# ---------------------------
def test_add_store(client, mock_database):
    response = client.post("/add-store", json={
        "name": "Test Store",
        "location": [10.0, 20.0],
        "password": "secret"
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["status"] == "ok"
    assert "id" in data
    assert data["name"] == "Test Store"


# ---------------------------
# TEST /products
# ---------------------------
def test_get_products(client, mock_database):
    mock_database.get_products_dicts.return_value = [{"id":"p1"}]
    response = client.get("/products")
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data[0]["id"] == "p1"


# ---------------------------
# TEST /add-product
# ---------------------------
def test_add_product(client, mock_database):
    mock_store = MagicMock()
    mock_store.name = "Mock Store"
    mock_database.get_store.return_value = mock_store

    response = client.post("/add-product", json={
        "name": "Test Product",
        "series": "S1",
        "price_original": 10,
        "price_users": 5,
        "exp_date": "2025-01-01",
        "EAN": "123",
        "category": "Food",
        "store_id": "S1",
        "quantity": 3,
        "photo_url": "url"
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["status"] == "ok"
    assert data["received"]["store_name"] == "Mock Store"


# ---------------------------
# TEST /buy-product
# ---------------------------
def test_buy_product(client, mock_database):
    mock_user = MagicMock()
    mock_user.get_points.return_value = 10
    mock_product = MagicMock()
    mock_product.calculate_score_for_one.return_value = 2
    mock_product.quantity = 5
    mock_store = MagicMock()
    mock_store.get_points.return_value = 20

    mock_database.get_user_from_qr_code.return_value = mock_user
    mock_database.get_product.return_value = mock_product
    mock_database.get_store.return_value = mock_store

    response = client.post("/buy-product", json={
        "code": "QR123",
        "product_id": "p1",
        "quantity": 2,
        "store_id": "s1"
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["status"] == "ok"


# ---------------------------
# TEST /generate-qr
# ---------------------------
def test_generate_qr(client, mock_database):
    mock_user = MagicMock()
    mock_user.username = "testuser"
    mock_database.get_user.return_value = mock_user

    response = client.get("/generate-qr", query_string={"username": "testuser"})
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["username"] == "testuser"
    assert "code" in data


# ---------------------------
# TEST /get-user
# ---------------------------
def test_get_user_info(client, mock_database):
    mock_user = MagicMock()
    mock_user.prepare_dict.return_value = {"username":"u1","password":"p","points":10}
    mock_database.get_user.return_value = mock_user

    response = client.get("/get-user", query_string={"username":"u1"})
    data = json.loads(response.data)
    assert response.status_code == 200
    assert "password" not in data
    assert data["username"] == "u1"


# ---------------------------
# TEST /validate-user
# ---------------------------
def test_validate_user(client, mock_database):
    mock_user = MagicMock()
    mock_user.password = "pass"
    mock_database.get_user.return_value = mock_user

    # poprawne hasło
    response = client.get("/validate-user", query_string={"username":"u1","password":"pass"})
    data = json.loads(response.data)
    assert data["validated?"] == "true"

    # błędne hasło
    response = client.get("/validate-user", query_string={"username":"u1","password":"wrong"})
    data = json.loads(response.data)
    assert data["validated?"] == "false"
