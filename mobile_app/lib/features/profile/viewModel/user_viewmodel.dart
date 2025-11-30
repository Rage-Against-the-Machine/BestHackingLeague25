import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/profile/model/user.dart';

class UserViewModel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969';

  final String _currentUsername = 'testowy_uzytkownik';

  // --- Zarządzanie stanem ---
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  User? _user;
  User? get user => _user;

  // Wartości dla widoku
  String get qrData => _user?.id ?? 'default_id';
  String get username => _user?.id ?? 'Ładowanie...';
  int get points => _user?.points ?? 0;
  String get email => _user?.email ?? '---';

  UserViewModel() {
    fetchUser(username: _currentUsername);
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
}
