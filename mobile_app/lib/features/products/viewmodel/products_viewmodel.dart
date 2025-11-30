import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/products/model/product.dart';

class ProductsViewmodel extends ChangeNotifier {
  final String _baseUrl = 'http://100.82.90.77:6969/products';

  bool _isLoading = false;
  bool get isLoading => _isLoading;

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
    notifyListeners();

    try {
      final uri = Uri.parse(_baseUrl);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<Product> fetchedProducts = data
            .map((item) => Product.fromJson(item))
            .toList();
        print(fetchedProducts[0].name);
        _products = fetchedProducts;
        notifyListeners();
      } else {
        throw Exception(
          'Failed to load products. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error fetching products: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
