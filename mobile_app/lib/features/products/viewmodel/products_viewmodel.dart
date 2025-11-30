import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/products/model/product.dart';

class ProductsViewmodel extends ChangeNotifier {
  final String _baseUrl = 'http://localhost:6969/products';

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

  Future<void> fetchProducts() async {
    if (_isLoading) return;

    _isLoading = true;
    notifyListeners();

    try {
      final uri = Uri.parse(_baseUrl);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(
          utf8.decode(response.bodyBytes),
        );

        _products = jsonList.map((json) => Product.fromJson(json)).toList();
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
