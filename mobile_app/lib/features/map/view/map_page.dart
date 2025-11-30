import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/features/map/viewModel/map_viewmodel.dart';
import 'package:provider/provider.dart';

class MapPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => MapViewModel(),
      child: Consumer<MapViewModel>(
        builder: (context, vm, _) {
          return FlutterMap(
            options: MapOptions(
              initialCenter: LatLng(52.2297, 21.0122),
              initialZoom: 15,
            ),

            children: [
              TileLayer(
                urlTemplate:
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                subdomains: ['a', 'b', 'c'],
              ),
              MarkerLayer(
                markers: vm.locations.map((loc) {
                  return Marker(
                    width: 80.0,
                    height: 80.0,
                    point: LatLng(loc.lat, loc.lng),
                    child: Icon(Icons.location_on, color: Colors.red, size: 40),
                  );
                }).toList(),
              ),
            ],
          );
        },
      ),
    );
  }
}
