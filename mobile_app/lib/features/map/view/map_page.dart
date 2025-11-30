import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/map/viewModel/map_viewmodel.dart';
import 'package:provider/provider.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});
  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> with TickerProviderStateMixin {
  late final MapController _mapController;
  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        final vm = context.read<MapViewModel>();
        vm.setMoveMapCallback(_animatedMapMove);
        if (vm.userLocation != null) {
          vm.moveToUserLocation();
        }
      }
    });
  }

  AnimationController? _activeController;
  @override
  void dispose() {
    _activeController?.dispose();
    super.dispose();
  }

  void _animatedMapMove(LatLng destLocation, double destZoom) {
    _activeController?.dispose();
    final latTween = Tween<double>(
      begin: _mapController.camera.center.latitude,
      end: destLocation.latitude,
    );
    final lngTween = Tween<double>(
      begin: _mapController.camera.center.longitude,
      end: destLocation.longitude,
    );
    final zoomTween = Tween<double>(
      begin: _mapController.camera.zoom,
      end: destZoom,
    );
    final controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    _activeController = controller;
    final Animation<double> animation = CurvedAnimation(
      parent: controller,
      curve: Curves.fastOutSlowIn,
    );
    controller.addListener(() {
      _mapController.move(
        LatLng(latTween.evaluate(animation), lngTween.evaluate(animation)),
        zoomTween.evaluate(animation),
      );
    });
    animation.addStatusListener((status) {
      if (status == AnimationStatus.completed ||
          status == AnimationStatus.dismissed) {
        if (_activeController == controller) {
          _activeController = null;
          controller.dispose();
        }
      }
    });
    controller.forward();
  }

  List<double> _generateDistanceSteps() {
    final List<double> steps = [];
    for (double d = 0.2; d <= 1.0; d += 0.2) {
      steps.add(double.parse(d.toStringAsFixed(1)));
    }
    for (double d = 1.5; d <= 5.0; d += 0.5) {
      steps.add(d);
    }
    for (double d = 6.0; d <= 10.0; d += 1.0) {
      steps.add(d);
    }
    return steps;
  }

  String _formatDistance(double km) {
    if (km < 1.0) {
      return '${(km * 1000).round()} m';
    } else {
      if (km % 1 == 0) {
        return '${km.round()} km';
      }
      return '$km km';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<MapViewModel>(
      builder: (context, vm, _) {
        if (vm.isLocating && vm.userLocation == null) {
          return const Center(child: CircularProgressIndicator());
        }
        final LatLng initialCenter =
            vm.userLocation ?? const LatLng(52.2297, 21.0122);
        final steps = _generateDistanceSteps();
        int currentIndex = 0;
        double minDiff = double.infinity;
        for (int i = 0; i < steps.length; i++) {
          final diff = (steps[i] - vm.maxDistanceKm).abs();
          if (diff < minDiff) {
            minDiff = diff;
            currentIndex = i;
          }
        }
        return Stack(
          children: [
            FlutterMap(
              mapController: _mapController,
              options: MapOptions(initialCenter: initialCenter, initialZoom: 5),
              children: [
                TileLayer(
                  urlTemplate:
                      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  subdomains: const ['a', 'b', 'c'],
                ),
                if (vm.userLocation != null)
                  CircleLayer(
                    circles: [
                      CircleMarker(
                        point: vm.userLocation!,
                        color: Colors.blue.withOpacity(0.1),
                        borderColor: Colors.blue,
                        borderStrokeWidth: 2.0,
                        useRadiusInMeter: true,
                        radius: vm.maxDistanceKm * 1000,
                      ),
                    ],
                  ),
                MarkerLayer(
                  markers: vm.getUserMarker() + vm.getAllMarkers(context),
                ),
              ],
            ),
            Positioned(
              left: 16,
              right: 16,
              bottom: 32,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Zasięg: ${_formatDistance(vm.maxDistanceKm)}',
                      style: AppTypography.body.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: AppColors.accent,
                        inactiveTrackColor: AppColors.productCardText
                            .withOpacity(0.3),
                        thumbColor: AppColors.accent,
                        overlayColor: AppColors.accent.withOpacity(0.1),
                        valueIndicatorColor: AppColors.accent,
                        showValueIndicator: ShowValueIndicator.always,
                        trackHeight: 4.0,
                        thumbShape: const RoundSliderThumbShape(
                          enabledThumbRadius: 8.0,
                        ),
                      ),
                      child: Slider(
                        value: currentIndex.toDouble(),
                        min: 0,
                        max: (steps.length - 1).toDouble(),
                        divisions: steps.length - 1,
                        label: _formatDistance(steps[currentIndex]),
                        onChanged: (double newIndex) {
                          vm.setMaxDistanceKm(steps[newIndex.round()]);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
