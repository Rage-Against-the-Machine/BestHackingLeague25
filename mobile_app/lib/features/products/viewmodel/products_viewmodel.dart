import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/products/model/product.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewmodel.dart';
import 'package:latlong2/latlong.dart';

class ProductsViewmodel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969/products';

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _hasTimeoutError = false;
  bool get hasTimeoutError => _hasTimeoutError;

  List<Product> _products = [];
  List<Product> get allProducts => _products;
  
  UserViewModel? _userViewModel;
  String? _selectedStore;
  String? get selectedStore => _selectedStore;

  String _selectedCategory = 'wszystkie';
  String get selectedCategory => _selectedCategory;

  final List<String> categories = [
    'wszystkie',
    'nabiał',
    'pieczywo',
    'owoce i warzywa',
    'mięso i wędliny',
    'napoje',
    'dania gotowe',
    'inne',
  ];

  String _normalize(String input) {
    return input.toLowerCase()
      .replaceAll('ą', 'a')
      .replaceAll('ć', 'c')
      .replaceAll('ę', 'e')
      .replaceAll('ł', 'l')
      .replaceAll('ń', 'n')
      .replaceAll('ó', 'o')
      .replaceAll('ś', 's')
      .replaceAll('ź', 'z')
      .replaceAll('ż', 'z');
  }

  List<Product> get productsList {
    if (_userViewModel == null || _userViewModel!.userLocation == null) {
      return _products;
    }

    final userLoc = _userViewModel!.userLocation!;
    final maxDist = _userViewModel!.maxDistanceKm;
    final Distance distanceCalculator = const Distance();

    return _products.where((product) {
      // Filter by store if selected
      if (_selectedStore != null && product.store != _selectedStore) {
        return false;
      }

      // Filter by category
      if (_selectedCategory != 'wszystkie') {
        if (_normalize(product.category) != _normalize(_selectedCategory)) {
           return false;
        }
      }

      final productLoc = LatLng(product.location[0], product.location[1]);
      final distMeters = distanceCalculator.as(LengthUnit.Meter, userLoc, productLoc);
      return distMeters <= (maxDist * 1000);
    }).toList();
  }

  bool _initialized = false;

  ProductsViewmodel() {
    if (!_initialized) {
      fetchProducts();
      _initialized = true;
    }
  }

  void update(UserViewModel userViewModel) {
    _userViewModel = userViewModel;
    notifyListeners();
  }

  void filterByStore(String storeName) {
    _selectedStore = storeName;
    notifyListeners();
  }

  void clearStoreFilter() {
    _selectedStore = null;
    notifyListeners();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  int getDiscountPercentage(double originalPrice, double discountedPrice) {
    if (originalPrice <= 0 || discountedPrice > originalPrice) {
      return 0;
    }
    double discountFraction = (originalPrice - discountedPrice) / originalPrice;
    int discountPercent = (discountFraction * 100).round();

    return discountPercent;
  }

  Future<void> fetchProducts() async {
    if (_isLoading) return;

    _isLoading = true;
    _hasTimeoutError = false;
    notifyListeners();

    try {
      final uri = Uri.parse(_baseUrl);

      final response = await http
          .get(uri)
          .timeout(
            const Duration(seconds: 20),
            onTimeout: () {
              throw TimeoutException(
                'Nie udało się pobrać danych w ciągu 20 sekund.',
              );
            },
          );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<Product> fetchedProducts = data
            .map((item) => Product.fromJson(item))
            .toList();
        _products = fetchedProducts;
      } else {
        throw Exception(
          'Failed to load products. Status code: ${response.statusCode}',
        );
      }
    } on TimeoutException {
      print('Error fetching products: Timeout after 5 seconds');
      _products = [];
      _hasTimeoutError = true;
    } catch (e) {
      print('Error fetching products: $e');
      _products = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
