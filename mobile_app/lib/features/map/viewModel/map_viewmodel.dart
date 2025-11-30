import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/features/navigation/viewmodel/navigation_viewmodel.dart';
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewmodel.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/features/map/view/heartbeat_marker.dart';

class MarkerData {
  final LatLng position;
  final String label;
  final String productName;
  final String productId;
  final bool isInRange;
  const MarkerData({
    required this.position,
    required this.label,
    required this.productName,
    required this.productId,
    required this.isInRange,
  });
}

class MapViewModel extends ChangeNotifier {
  final ProductsViewmodel productsViewModel;
  UserViewModel? _userViewModel;
  LatLng? get userLocation => _userViewModel?.userLocation;
  bool get isLocating => _userViewModel?.isLocating ?? false;
  double get maxDistanceKm => _userViewModel?.maxDistanceKm ?? 10.0;
  MapViewModel({required this.productsViewModel}) {
    productsViewModel.addListener(_onProductsUpdated);
  }
  Function(LatLng, double)? _onMoveMap;
  void setMoveMapCallback(Function(LatLng, double) callback) {
    _onMoveMap = callback;
  }

  void moveToUserLocation() {
    if (_userViewModel?.userLocation != null && _onMoveMap != null) {
      _onMoveMap!(_userViewModel!.userLocation!, 14.0);
    }
  }

  void setMaxDistanceKm(double distance) {
    _userViewModel?.setMaxDistanceKm(distance);
  }

  void update(UserViewModel userViewModel) {
    final oldLocation = _userViewModel?.userLocation;
    _userViewModel = userViewModel;
    if (oldLocation == null && userViewModel.userLocation != null) {
      Future.delayed(const Duration(milliseconds: 500), () {
        moveToUserLocation();
      });
    }
    notifyListeners();
  }

  @override
  void dispose() {
    productsViewModel.removeListener(_onProductsUpdated);
    super.dispose();
  }

  void _onProductsUpdated() {
    notifyListeners();
  }

  List<MarkerData> get markerData {
    final userLoc = _userViewModel?.userLocation;
    final maxDist = maxDistanceKm;
    final Distance distanceCalculator = const Distance();
    return productsViewModel.allProducts.map((p) {
      bool inRange = false;
      if (userLoc != null) {
        final productLoc = LatLng(p.location[0], p.location[1]);
        final distMeters = distanceCalculator.as(
          LengthUnit.Meter,
          userLoc,
          productLoc,
        );
        inRange = distMeters <= (maxDist * 1000);
      } else {
        inRange = false;
      }
      return MarkerData(
        position: LatLng(p.location[0], p.location[1]),
        label: p.store,
        productName: p.name,
        productId: p.id,
        isInRange: inRange,
      );
    }).toList();
  }

  List<Marker> getAllMarkers(BuildContext context) {
    final List<Marker> markers = [];
    markers.addAll(
      markerData.map((marker) {
        if (!marker.isInRange) {
          return Marker(
            width: 12.0,
            height: 12.0,
            point: marker.position,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 1),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 2,
                    offset: Offset(0, 1),
                  ),
                ],
              ),
            ),
          );
        }
        return Marker(
          width: 140.0,
          height: 80.0,
          point: marker.position,
          child: GestureDetector(
            onTap: () {
              context.read<ProductsViewmodel>().filterByStore(marker.label);
              context.read<NavigationViewModel>().setIndex(0);
            },
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
          ),
        );
      }),
    );
    if (userLocation != null) {
      markers.add(
        Marker(
          width: 60.0,
          height: 60.0,
          point: userLocation!,
          child: const Icon(Icons.my_location, color: Colors.red, size: 30),
        ),
      );
    }
    return markers;
  }

  List<Marker> getUserMarker() {
    if (userLocation != null) {
      return [
        Marker(
          width: 60.0,
          height: 60.0,
          point: userLocation!,
          child: const HeartbeatMarker(),
        ),
      ];
    }
    return [];
  }
}
