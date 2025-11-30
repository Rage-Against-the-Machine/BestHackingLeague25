import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/products/model/product.dart';

class ProductsViewmodel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969/products';

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _hasTimeoutError = false;
  bool get hasTimeoutError => _hasTimeoutError;

  List<Product> _products = [];
  List<Product> get productsList => _products;

  bool _initialized = false;

  ProductsViewmodel() {
    if (!_initialized) {
      fetchProducts();
      _initialized = true;
    }
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
            const Duration(seconds: 5),
            onTimeout: () {
              throw TimeoutException(
                'Nie udało się pobrać danych w ciągu 5 sekund.',
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
