class MapLocation {
  final double lat;
  final double lng;
  final String label;

  const MapLocation({
    required this.lat,
    required this.lng,
    required this.label,
  });

  factory MapLocation.from(Map<String, dynamic> json) {
    return MapLocation(
      lat: json['lat'],
      lng: json['lng'],
      label: json['label'] ?? '',
    );
  }
}
