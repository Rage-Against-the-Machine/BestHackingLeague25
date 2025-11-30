import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/shopping_list/viewmodel/shopping_list_viewmodel.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';

class ShoppingListPage extends StatelessWidget {
  const ShoppingListPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('LISTA ZAKUPÓW', style: AppTypography.headline),
                  Consumer<ShoppingListViewModel>(
                    builder: (context, viewModel, child) {
                      return IconButton(
                        icon: const Icon(Icons.share, color: AppColors.accent),
                        onPressed: () {
                          Share.share(viewModel.shareableText);
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
            Expanded(
              child: Consumer<ShoppingListViewModel>(
                builder: (context, viewModel, child) {
                  if (viewModel.shoppingList.isEmpty) {
                    return Center(
                      child: Text(
                        'Twoja lista jest pusta.',
                        style: AppTypography.body,
                      ),
                    );
                  }
                  final groupedList = viewModel.groupedShoppingList;
                  return ListView.builder(
                    itemCount: groupedList.length,
                    itemBuilder: (context, index) {
                      final storeName = groupedList.keys.elementAt(index);
                      final items = groupedList[storeName]!;
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                            child: Text(
                              storeName,
                              style: AppTypography.headline.copyWith(
                                fontSize: 20,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ),
                          ...items.map((item) {
                            final product = item.product;
                            return Card(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 8.0,
                              ),
                              color: AppColors.productBackground,
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8.0),
                                      child: Image.network(
                                        product.photoUrl,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                        errorBuilder:
                                            (context, error, stackTrace) =>
                                                Container(
                                                  width: 60,
                                                  height: 60,
                                                  color: Colors.grey[300],
                                                  child: const Icon(
                                                    Icons.error,
                                                  ),
                                                ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            product.name,
                                            style: AppTypography.productLabel,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                '${product.priceOriginal.toStringAsFixed(2)} PLN',
                                                style: AppTypography
                                                    .discountedPrice,
                                              ),
                                              Text(
                                                '${product.priceUsers.toStringAsFixed(2)} PLN',
                                                style: AppTypography.price,
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(
                                            Icons.remove_circle_outline,
                                          ),
                                          color: AppColors.textSecondary,
                                          onPressed: () {
                                            viewModel.decrementQuantity(
                                              product,
                                            );
                                          },
                                        ),
                                        Text(
                                          '${item.quantity}',
                                          style: AppTypography.body.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        IconButton(
                                          icon: const Icon(
                                            Icons.add_circle_outline,
                                          ),
                                          color:
                                              item.quantity >= product.quantity
                                              ? Colors.grey
                                              : AppColors.accent,
                                          onPressed:
                                              item.quantity >= product.quantity
                                              ? null
                                              : () {
                                                  viewModel.incrementQuantity(
                                                    product,
                                                  );
                                                },
                                        ),
                                      ],
                                    ),
                                    IconButton(
                                      icon: const Icon(
                                        Icons.delete,
                                        color: AppColors.textUrgent,
                                      ),
                                      onPressed: () {
                                        viewModel.removeProduct(product);
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                        ],
                      );
                    },
                  );
                },
              ),
            ),
            Consumer<ShoppingListViewModel>(
              builder: (context, viewModel, child) {
                return Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: AppColors.productBackground,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Suma:', style: AppTypography.headline),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '${viewModel.totalOriginalPrice.toStringAsFixed(2)} PLN',
                            style: AppTypography.discountedPrice.copyWith(
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            '${viewModel.totalPrice.toStringAsFixed(2)} PLN',
                            style: AppTypography.headline.copyWith(
                              color: AppColors.accent,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
