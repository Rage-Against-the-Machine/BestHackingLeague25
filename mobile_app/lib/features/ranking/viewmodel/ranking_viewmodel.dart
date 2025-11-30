import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/ranking/model/store_ranking.dart';

class RankingViewModel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969/stores-ranking';
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  
  List<StoreRanking> _rankings = [];
  List<StoreRanking> get rankings => _rankings;
  
  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  final http.Client _client;

  RankingViewModel({http.Client? client}) : _client = client ?? http.Client() {
    fetchRankings();
  }

  Future<void> fetchRankings({String? province}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final uri = Uri.parse(_baseUrl).replace(
        queryParameters: province != null ? {'province': province} : null,
      );
      
      final response = await _client.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _rankings = data.map((json) => StoreRanking.fromJson(json)).toList();
      } else {
        _errorMessage = 'Nie udało się pobrać rankingu. Kod błędu: ${response.statusCode}';
      }
    } catch (e) {
      _errorMessage = 'Wystąpił błąd podczas pobierania rankingu: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
