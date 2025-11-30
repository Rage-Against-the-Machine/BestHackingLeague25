import pytest
from unittest.mock import MagicMock

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from classes.store import Store
from classes.database_interface import DatabaseInterface
from classes.product import Product, get_all_products


# -------------------------------
# FIXTURY
# -------------------------------

@pytest.fixture
def mock_location():
    loc = MagicMock()
    loc.get_coords.return_value = (52.1, 21.0)
    loc.get_city.return_value = "Warszawa"
    return loc


@pytest.fixture
def mock_store(mock_location):
    store = MagicMock(spec=Store)
    store.id = "S001"
    store.name = "Lidl Ursynów"
    store.get_location.return_value = mock_location
    return store


@pytest.fixture
def sample_product(mock_store):
    return Product(
        name="Jogurt",
        series="A1",
        price_original=5.00,
        price_users=3.00,
        exp_date="2025-02-01",
        EAN="1234567890123",
        category="Nabiał",
        store=mock_store,
        quantity=4,
        photo_url="http://example.com/jogurt.jpg"
    )


# -------------------------------
# TEST: __init__
# -------------------------------
def test_product_init(mock_store):
    p = Product(
        name="A",
        series="B",
        price_original=10,
        price_users=5,
        exp_date="2025",
        EAN="999",
        category="Food",
        store=mock_store,
        quantity=2,
        photo_url="url"
    )

    assert p.name == "A"
    assert p.series == "B"
    assert p.store == mock_store
    assert p.id.startswith(mock_store.id)
    assert "999" in p.id


# -------------------------------
# TEST: from_database
# -------------------------------
def test_from_database(mock_store):
    mock_db = MagicMock(spec=DatabaseInterface)
    mock_db.get_store.return_value = mock_store

    doc = {
        "name": "Chleb",
        "series": "X1",
        "price_original": 4.0,
        "price_users": 2.0,
        "exp_date": "2025-02-02",
        "EAN": "1112223334445",
        "category": "Pieczywo",
        "store_id": mock_store.id,
        "quantity": 10,
        "photo_url": "url"
    }

    p = Product.from_database(doc, mock_db)

    assert p.name == "Chleb"
    assert p.store == mock_store
    assert p.quantity == 10
    mock_db.get_store.assert_called_once_with(mock_store.id)


# -------------------------------
# TEST: get_location_coords
# -------------------------------
def test_get_location_coords(sample_product, mock_location):
    assert sample_product.get_location_coords() == (52.1, 21.0)
    sample_product.store.get_location.assert_called_once()


# -------------------------------
# TEST: get_city
# -------------------------------
def test_get_city(sample_product, mock_location):
    assert sample_product.get_city() == "Warszawa"
    sample_product.store.get_location.assert_called()


# -------------------------------
# TEST: prepare_dict
# -------------------------------
def test_prepare_dict(sample_product):
    d = sample_product.prepare_dict()

    assert d["name"] == "Jogurt"
    assert d["series"] == "A1"
    assert d["price_original"] == 5.00
    assert d["store"] == "Lidl Ursynów"
    assert "location" in d
    assert d["location"] == (52.1, 21.0)


# -------------------------------
# TEST: calculate_score_for_one
# -------------------------------
def test_calculate_score_for_one(sample_product):
    # (5 - 3) / 5 * 10 = 4
    assert sample_product.calculate_score_for_one() == 4


# -------------------------------
# TEST: update_quantity
# -------------------------------
def test_update_quantity(sample_product):
    sample_product.update_quantity(+3)
    assert sample_product.quantity == 7

    sample_product.update_quantity(-2)
    assert sample_product.quantity == 5


# -------------------------------
# TEST: get_all_products
# -------------------------------
def test_get_all_products(mock_store):
    mock_db = MagicMock(spec=DatabaseInterface)
    mock_db.get_store.return_value = mock_store

    mock_db.get_all_products.return_value = [
        {
            "name": "Masło",
            "series": "M1",
            "price_original": 8,
            "price_users": 5,
            "exp_date": "2025-02-02",
            "EAN": "0001112223334",
            "category": "Nabiał",
            "store_id": mock_store.id,
            "quantity": 2,
            "photo_url": "url"
        }
    ]

    products = get_all_products(mock_db)

    assert len(products) == 1
    assert isinstance(products[0], Product)
    assert products[0].name == "Masło"
    mock_db.get_all_products.assert_called_once()
