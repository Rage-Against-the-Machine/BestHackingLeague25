# Backend

## Available endpoints

PORT = ```6969```

### ```/stores-ranking``` [GET]
- Arguments: 
    - ```province``` - in Poland województwo, if you want a regional ranking. Optional.
- Returns:
    - ranking of stores in the correct order
    - following stores info:
        - name (```name```)
        - points (```points```)
        - city (location) (```city```)
        - province (location) (```province```)
        - coords (location) (```coords```)
        - store ID (```store_id```)

### ```/add-store``` [POST]
- Arguments:
    - ```name``` - store's name
    - ```location``` - location coords as ```[lat, lon]```
- Adds the store to the system

### ```/products``` [GET]
- Arguments: None
- Returns:
    - list of all products with following products info:
        - id (```id```)
        - name (```name```)
        - location - coords (```location```)
        - location - city (```city```)
        - series (```series```)
        - original price (```price_original```)
        - price for registered users (```price_users```)
        - expiration date (```exp_date```)
        - category (```category```)
        - store id (```store_id```)
        - quantity (```quantity```)
        - photo_url (```photo_url```)

### ```/add-product``` [POST]
- Arguments:
    - ```name``` - product's name
    - ```series``` - product's series
    - ```price_original``` - original price
    - ```price_users``` - price for registered users
    - ```exp_date``` - expiration date
    - ```EAN``` - EAN code
    - ```category``` - product's category
    - ```store_id``` - ID of the store registering the product
    - ```quantity``` - quantity of the product
    - ```photo_url``` - URL to product's image

### ```/buy-product``` [POST]
- Arguments:
    - ```code``` - user's QR code
    - ```product_id``` - bought product's ID
    - ```quantity``` - number of product items bought by user
    - ```store_id``` - ID of selling store
- Actions:
    - adds points for user
    - adds points for store
    - reduces the amount of available product items
- Returns:
    - ```status``` - Status message
    - ```store_points``` - current score for store
    - ```user_points``` - current score for user

### ```/generate-qr``` [GET]
- Arguments:
    - ```username``` - username of user for which the QR code is generated
- Returns:
    - ```code``` - QR code for user
    - ```username``` - username of user


### ```/get-user``` [GET]
- Arguments:
    - ```username``` - username of user for which the QR code is generated
- Returns:
    - ```username``` - username of user
    - ```email``` - email of user
    - ```points``` - user's points


### ```/delete-product``` [GET]
- Arguments:
    - ```product_id``` - ID of the product you want to reduce
    - ```keep``` - how many items of the product you want to keep. Optional, default 0.
- Actions:
    - Deletes product from database


### ```/validate-user``` [GET]
- Arguments:
    - ```username``` - username
    - ```password``` - password to check if correct
- Returns
    - ```{"validated?" : "true"}``` if correct
    - ```{"validated?" : "false"}``` if not correct

### ```/add-user``` [POST]
- Arguments:
    - ```username``` - username
    - ```email``` - user's email address
    - ```password``` - user's password
- Returns:
    - ```username``` - set unique username
    - ```email``` - user's email address
    - ```points``` - amount of user's points


### ```/validate-store``` [GET]
- Arguments:
    - ```name``` - store's name
    - ```password``` - password to check if correct
- Returns
    - ```{"validated?" : "true"}``` if correct
    - ```{"validated?" : "false"}``` if not correct