import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../model/map_location.dart';

class MapViewModel extends ChangeNotifier {
  final List<MapLocation> locations = [
    MapLocation(lat: 52.2297, lng: 21.0122, label: 'Lokalizacja A'),
    MapLocation(lat: 52.2304, lng: 21.0112, label: 'Lokalizacja B'),
  ];

  List<LatLng> get markerPoints =>
      locations.map((loc) => LatLng(loc.lat, loc.lng)).toList();
}
