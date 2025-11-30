import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';
import 'package:mocktail/mocktail.dart';

class MockClient extends Mock implements http.Client {}

void main() {
  late MockClient mockClient;
  late ProductsViewmodel viewModel;
  
  final mockResponse = jsonEncode([
    {
      'id': '1',
      'name': 'Mleko',
      'location': [52.0, 21.0],
      'series': 'A',
      'price_original': 3.50,
      'price_users': 2.99,
      'exp_date': '2023-12-31',
      'category': 'nabial',
      'store': 'Biedronka',
      'store_id': 101,
      'quantity': 10,
      'photo_url': 'http://example.com/photo.jpg',
    }
  ]);

  setUp(() {
    mockClient = MockClient();
    registerFallbackValue(Uri());
  });

  group('ProductsViewModel', () {
    test('fetchProducts populates products list on success', () async {
      // Stub success BEFORE creating ViewModel
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response(mockResponse, 200),
      );

      viewModel = ProductsViewmodel(client: mockClient);
      
      // Wait for the async fetch triggered in constructor
      await Future.delayed(Duration.zero); 

      expect(viewModel.allProducts.length, 1);
      expect(viewModel.allProducts.first.name, 'Mleko');
      expect(viewModel.isLoading, false);
    });

    test('fetchProducts handles error gracefully', () async {
      // Stub error BEFORE creating ViewModel
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response('Error', 500),
      );

      viewModel = ProductsViewmodel(client: mockClient);
      
      await Future.delayed(Duration.zero);

      expect(viewModel.allProducts.isEmpty, true);
      expect(viewModel.isLoading, false);
    });

    test('filterByStore updates selectedStore', () async {
      // Stub success to avoid errors
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response(mockResponse, 200),
      );
      
      viewModel = ProductsViewmodel(client: mockClient);
      await Future.delayed(Duration.zero);

      viewModel.filterByStore('Biedronka');
      expect(viewModel.selectedStore, 'Biedronka');
    });

    test('getDiscountPercentage calculates correctly', () async {
       // Stub success to avoid errors
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response(mockResponse, 200),
      );

      viewModel = ProductsViewmodel(client: mockClient);
      await Future.delayed(Duration.zero);

      final discount = viewModel.getDiscountPercentage(100.0, 80.0);
      expect(discount, 20);
    });
  });
}
