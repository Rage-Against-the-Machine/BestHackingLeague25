// Model class representing a product in the shop
class Product {
  final String id;
  final String name;
  final List<double> location;
  final String series;
  final double priceOriginal;
  final double priceUsers;
  final String expDate;
  final String category;
  final String store;
  final int storeId;
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
    required this.store,
    required this.storeId,
    required this.quantity,
    required this.photoUrl,
  });
  factory Product.fromJson(Map<String, dynamic> json) {
    final List<dynamic>? rawLocation = json['location'] as List<dynamic>?;
    final List<double> parsedLocation = [];
    if (rawLocation != null && rawLocation.length >= 2) {
      try {
        parsedLocation.add((rawLocation[0] as num).toDouble());
        parsedLocation.add((rawLocation[1] as num).toDouble());
      } catch (e) {
        print('Error parsing location coordinates: $e');
      }
    }
    if (parsedLocation.isEmpty) {
      parsedLocation.addAll([0.0, 0.0]);
    }
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      location: parsedLocation,
      series: json['series'] as String,
      priceOriginal: (json['price_original'] as num).toDouble(),
      priceUsers: (json['price_users'] as num).toDouble(),
      expDate: json['exp_date'] as String,
      category: json['category'] as String,
      store: json['store'] as String,
      storeId: json['store_id'] as int,
      quantity: json['quantity'] as int,
      photoUrl: json['photo_url'] as String,
    );
  }
}
