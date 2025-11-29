// id (id)
// name (name)
// location - coords (location)
// location - city (city)
// series (series)
// original price (price_original)
// price for registered users (price_users)
// expiration date (exp_date)
// category (category)
// store id (store_id)
// quantity (quantity)
// photo_url (photo_url)

class Product {
  final String id;
  final String name;
  final Map<String, dynamic> location;
  final String series;
  final double priceOriginal;
  final double priceUsers;
  final String expDate;
  final String category;
  final String storeId;
  final int quantity;
  final String photoUrl;

  Product({
    required this.id,
    required this.name,
    required this.location,
    required this.series,
    required this.priceOriginal,
    required this.priceUsers,
    required this.expDate,
    required this.category,
    required this.storeId,
    required this.quantity,
    required this.photoUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      series: json['series'],
      priceOriginal: json['price_original'].toDouble(),
      priceUsers: json['price_users'].toDouble(),
      expDate: json['exp_date'],
      category: json['category'],
      storeId: json['store_id'],
      quantity: json['quantity'],
      photoUrl: json['photo_url'],
    );
  }
}
