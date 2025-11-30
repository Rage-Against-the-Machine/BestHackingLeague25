class StoreRanking {
  final String name;
  final int points;
  final String city;
  final String province;
  final List<double> coords;
  final String storeId;

  StoreRanking({
    required this.name,
    required this.points,
    required this.city,
    required this.province,
    required this.coords,
    required this.storeId,
  });

  factory StoreRanking.fromJson(Map<String, dynamic> json) {
    final location = json['location'] as Map<String, dynamic>? ?? {};
    final rawCoords = location['coords'] as List<dynamic>?;
    final List<double> parsedCoords = [];
    if (rawCoords != null) {
      for (var coord in rawCoords) {
        if (coord is num) {
          parsedCoords.add(coord.toDouble());
        }
      }
    }

    return StoreRanking(
      name: json['name'] as String? ?? 'Nieznany sklep',
      points: json['points'] as int? ?? 0,
      city: location['city'] as String? ?? '',
      province: location['province'] as String? ?? '',
      coords: parsedCoords,
      storeId: json['store_id'].toString(),
    );
  }
}
