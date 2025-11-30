import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/products/view/product_card.dart';
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';
import 'package:provider/provider.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({super.key});

  Widget _buildMessageContainer({
    required String message,
    required BuildContext context,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Center(
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.productBackground,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.background, width: 1),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              message,
              style: AppTypography.body,
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: Text('GAZETKA', style: AppTypography.headline),
            ),
            Expanded(
              child: Consumer<ProductsViewmodel>(
                builder: (context, viewModel, child) {
                  if (viewModel.isLoading && viewModel.productsList.isEmpty) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (viewModel.productsList.isEmpty &&
                      viewModel.hasTimeoutError) {
                    return RefreshIndicator(
                      onRefresh: viewModel.fetchProducts,
                      child: ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        children: [
                          _buildMessageContainer(
                            message:
                                'Nie udało się pobrać danych. Spróbuj ponownie później.',
                            context: context,
                          ),
                        ],
                      ),
                    );
                  }

                  if (viewModel.productsList.isEmpty) {
                    return RefreshIndicator(
                      onRefresh: viewModel.fetchProducts,
                      child: ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        children: [
                          _buildMessageContainer(
                            message: 'Brak dostępnych produktów w okolicy.',
                            context: context,
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: viewModel.fetchProducts,
                    child: ListView.builder(
                      padding: const EdgeInsets.only(top: 8.0),
                      itemCount: viewModel.productsList.length,
                      itemBuilder: (context, index) {
                        final product = viewModel.productsList[index];
                        final discountPercent = viewModel.getDiscountPercentage(
                          product.priceOriginal,
                          product.priceUsers,
                        );

                        return ProductCard(
                          product: product,
                          discountPercent: discountPercent,
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
