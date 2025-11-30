import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/features/products/model/product.dart';

void main() {
  group('Product Model', () {
    test('fromJson creates a valid Product object', () {
      final json = {
        'id': '1',
        'name': 'Mleko',
        'location': [52.0, 21.0],
        'series': 'A',
        'price_original': 3.50,
        'price_users': 2.99,
        'exp_date': '2023-12-31',
        'category': 'nabiał',
        'store': 'Biedronka',
        'store_id': 101,
        'quantity': 10,
        'photo_url': 'http://example.com/photo.jpg',
      };

      final product = Product.fromJson(json);

      expect(product.id, '1');
      expect(product.name, 'Mleko');
      expect(product.location, [52.0, 21.0]);
      expect(product.priceOriginal, 3.50);
      expect(product.priceUsers, 2.99);
      expect(product.store, 'Biedronka');
    });

    test('fromJson handles missing location gracefully', () {
      final json = {
        'id': '2',
        'name': 'Chleb',
        'location': null, // Missing location
        'series': 'B',
        'price_original': 4.00,
        'price_users': 3.50,
        'exp_date': '2023-12-30',
        'category': 'pieczywo',
        'store': 'Lidl',
        'store_id': 102,
        'quantity': 5,
        'photo_url': '',
      };

      final product = Product.fromJson(json);

      expect(product.location, [0.0, 0.0]); // Default fallback
    });
  });
}
