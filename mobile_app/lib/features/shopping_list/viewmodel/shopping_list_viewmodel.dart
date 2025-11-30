import 'package:flutter/material.dart';
import 'package:mobile_app/features/products/model/product.dart';

class ShoppingListItem {
  final Product product;
  int quantity;

  ShoppingListItem({required this.product, this.quantity = 1});
}

class ShoppingListViewModel extends ChangeNotifier {
  final List<ShoppingListItem> _shoppingList = [];
  List<ShoppingListItem> get shoppingList => _shoppingList;

  Map<String, List<ShoppingListItem>> get groupedShoppingList {
    final Map<String, List<ShoppingListItem>> grouped = {};
    for (final item in _shoppingList) {
      if (!grouped.containsKey(item.product.store)) {
        grouped[item.product.store] = [];
      }
      grouped[item.product.store]!.add(item);
    }
    return grouped;
  }

  void addProduct(Product product) {
    final index = _shoppingList.indexWhere((item) => item.product.id == product.id);
    if (index != -1) {
      if (_shoppingList[index].quantity < product.quantity) {
        _shoppingList[index].quantity++;
        notifyListeners();
      }
    } else {
      if (product.quantity > 0) {
        _shoppingList.add(ShoppingListItem(product: product));
        notifyListeners();
      }
    }
  }

  void toggleProduct(Product product) {
    final index = _shoppingList.indexWhere((item) => item.product.id == product.id);
    if (index != -1) {
      _shoppingList.removeAt(index);
    } else {
      if (product.quantity > 0) {
        _shoppingList.add(ShoppingListItem(product: product));
      }
    }
    notifyListeners();
  }

  void removeProduct(Product product) {
    _shoppingList.removeWhere((item) => item.product.id == product.id);
    notifyListeners();
  }

  void incrementQuantity(Product product) {
    final index = _shoppingList.indexWhere((item) => item.product.id == product.id);
    if (index != -1) {
      if (_shoppingList[index].quantity < product.quantity) {
        _shoppingList[index].quantity++;
        notifyListeners();
      }
    }
  }

  void decrementQuantity(Product product) {
    final index = _shoppingList.indexWhere((item) => item.product.id == product.id);
    if (index != -1) {
      if (_shoppingList[index].quantity > 1) {
        _shoppingList[index].quantity--;
      } else {
        _shoppingList.removeAt(index);
      }
      notifyListeners();
    }
  }

  bool isProductInList(Product product) {
    return _shoppingList.any((item) => item.product.id == product.id);
  }

  int getProductQuantity(Product product) {
    final index = _shoppingList.indexWhere((item) => item.product.id == product.id);
    return index != -1 ? _shoppingList[index].quantity : 0;
  }

  double get totalPrice {
    return _shoppingList.fold(0, (sum, item) => sum + (item.product.priceUsers * item.quantity));
  }

  double get totalOriginalPrice {
    return _shoppingList.fold(0, (sum, item) => sum + (item.product.priceOriginal * item.quantity));
  }

  String get shareableText {
    final buffer = StringBuffer();
    buffer.writeln('Lista zakupów:');
    
    final grouped = groupedShoppingList;
    
    for (final entry in grouped.entries) {
      buffer.writeln('\n${entry.key}:');
      for (final item in entry.value) {
        buffer.writeln(
          '- ${item.product.name} (${item.quantity} szt.) - ${(item.product.priceUsers * item.quantity).toStringAsFixed(2)} PLN',
        );
      }
    }
    
    buffer.writeln('\nSuma: ${totalPrice.toStringAsFixed(2)} PLN');
    return buffer.toString();
  }
}
