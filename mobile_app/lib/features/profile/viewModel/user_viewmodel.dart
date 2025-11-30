import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/profile/model/user.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';

class UserViewModel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969';

  final String _currentUsername = 'testowy_uzytkownik';

  // --- Zarządzanie stanem ---
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  User? _user;
  User? get user => _user;
  bool get isLoggedIn => _user != null;

  double _maxDistanceKm = 10.0;
  double get maxDistanceKm => _maxDistanceKm;

  LatLng? _userLocation;
  LatLng? get userLocation => _userLocation;

  bool _isLocating = false;
  bool get isLocating => _isLocating;

  // Wartości dla widoku
  String get qrData => _user?.id ?? 'default_id';
  String get username => _user?.id ?? 'Ładowanie...';
  int get points => _user?.points ?? 0;
  String get email => _user?.email ?? '---';

  UserViewModel() {
    // fetchUser(username: _currentUsername); // Removed to default to logged out state
    fetchUserLocation();
  }

  void setMaxDistanceKm(double distance) {
    if (_maxDistanceKm != distance) {
      _maxDistanceKm = distance;
      notifyListeners();
      // Tutaj w przyszłości można dodać logikę zapisu do Firestore/API
    }
  }

  Future<void> fetchUser({required String username}) async {
    if (_isLoading) return;

    _isLoading = true;
    notifyListeners();

    try {
      final uri = Uri.parse(
        '$_baseUrl/get-user',
      ).replace(queryParameters: {'username': username});

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        final fetchedUser = User.fromJson(data);

        _user = fetchedUser;
      } else {
        throw Exception(
          'Failed to load user. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error fetching user: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> validateLogin({
    required String username,
    required String password,
  }) async {
    try {
      final uri = Uri.parse(
        '$_baseUrl/validate-user',
      ).replace(queryParameters: {'username': username, 'password': password});

      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        final validated = data['validated?'];
        if (validated is bool) return validated;
        if (validated is String) return validated.toLowerCase() == 'true';
        if (validated is num) return validated != 0;
        return false;
      } else {
        throw Exception(
          'Błąd walidacji po stronie serwera: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Błąd logowania (validateLogin): $e');
      throw e;
    }
  }

  Future<void> logout() async {
    if (_isLoading) return;

    _isLoading = true;
    notifyListeners();

    try {
      // attempt server-side logout; fallback is to just clear local state
      final username = _user?.id ?? _currentUsername;
      final uri = Uri.parse(
        '$_baseUrl/logout',
      ).replace(queryParameters: {'username': username});

      final response = await http.get(uri);

      if (response.statusCode != 200) {
        // Log but continue to clear local state
        print('Server logout returned ${response.statusCode}');
      }
    } catch (e) {
      print('Error during logout: $e');
    } finally {
      // Clear local user state regardless of server response
      _user = null;
      _isLoading = false;
      notifyListeners();
    }
  }
  Future<void> fetchUserLocation() async {
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
      // Fallback location (Warsaw)
      _userLocation = const LatLng(52.2297, 21.0122);
    } finally {
      _isLocating = false;
      notifyListeners();
    }
  }
}
