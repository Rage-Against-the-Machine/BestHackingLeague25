import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';

class MarkerData {
  final LatLng position;
  final String label;
  final String productName;
  final String productId;

  const MarkerData({
    required this.position,
    required this.label,
    required this.productName,
    required this.productId,
  });
}

class MapViewModel extends ChangeNotifier {
  final ProductsViewmodel productsViewModel;

  LatLng? _userLocation;
  LatLng? get userLocation => _userLocation;

  bool _isLocating = false;
  bool get isLocating => _isLocating;

  MapViewModel({required this.productsViewModel}) {
    productsViewModel.addListener(_onProductsUpdated);
    _fetchUserLocation();
  }

  @override
  void dispose() {
    productsViewModel.removeListener(_onProductsUpdated);
    super.dispose();
  }

  void _onProductsUpdated() {
    notifyListeners();
  }

  Future<void> _fetchUserLocation() async {
    _isLocating = true;
    notifyListeners();

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Usługi lokalizacyjne są wyłączone.');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied ||
            permission == LocationPermission.deniedForever) {
          throw Exception('Brak uprawnień do lokalizacji.');
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 10),
      );

      _userLocation = LatLng(position.latitude, position.longitude);
    } catch (e) {
      print("Błąd pobierania lokalizacji: $e");
      _userLocation = const LatLng(52.2297, 21.0122);
    } finally {
      _isLocating = false;
      notifyListeners();
    }
  }

  List<MarkerData> get markerData {
    return productsViewModel.productsList
        .map(
          (p) => MarkerData(
            position: LatLng(p.location[0], p.location[1]),
            label: p.store,
            productName: p.name,
            productId: p.id,
          ),
        )
        .toList();
  }

  List<Marker> getAllMarkers() {
    final List<Marker> markers = [];
    markers.addAll(
      markerData.map((marker) {
        return Marker(
          width: 140.0,
          height: 80.0,
          point: marker.position,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Card(
                color: Colors.white,
                elevation: 4.0,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8.0,
                    vertical: 4.0,
                  ),
                  child: Text(
                    marker.label,
                    style: const TextStyle(
                      fontSize: 12.0,
                      color: Colors.black87,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
              const SizedBox(height: 6.0),

              Container(
                width: 12.0,
                height: 12.0,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 2,
                      offset: Offset(0, 1),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }),
    );

    if (_userLocation != null) {
      markers.add(
        Marker(
          width: 60.0,
          height: 60.0,
          point: _userLocation!,
          child: const Icon(Icons.my_location, color: Colors.red, size: 30),
        ),
      );
    }

    return markers;
  }

  List<Marker> getUserMarker() {
    if (_userLocation != null) {
      return [
        Marker(
          width: 60.0,
          height: 60.0,
          point: _userLocation!,
          child: const Icon(Icons.my_location, color: Colors.red, size: 30),
        ),
      ];
    }
    return [];
  }
}
