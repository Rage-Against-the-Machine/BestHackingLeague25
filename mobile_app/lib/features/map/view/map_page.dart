import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/features/map/viewModel/map_viewmodel.dart';
import 'package:provider/provider.dart';

class MapPage extends StatelessWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<MapViewModel>(
      builder: (context, vm, _) {
        if (vm.isLocating && vm.userLocation == null) {
          return const Center(child: CircularProgressIndicator());
        }

        final LatLng initialCenter =
            vm.userLocation ?? const LatLng(52.2297, 22.0122);

        return FlutterMap(
          options: MapOptions(
            initialCenter: initialCenter,
            initialZoom: vm.userLocation != null ? 5 : 15,
          ),

          children: [
            TileLayer(
              urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              subdomains: const ['a', 'b', 'c'],
            ),

            MarkerLayer(markers: vm.getUserMarker() + vm.getAllMarkers()),
          ],
        );
      },
    );
  }
}
