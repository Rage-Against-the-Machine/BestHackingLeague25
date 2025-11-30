import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:mobile_app/features/products/view/product_card.dart';
import 'package:mobile_app/features/products/view/product_card_skeleton.dart';
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
            Consumer<ProductsViewmodel>(
              builder: (context, viewModel, child) {
                return SizedBox(
                  height: 50,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    itemCount: viewModel.categories.length,
                    itemBuilder: (context, index) {
                      final category = viewModel.categories[index];
                      final isSelected = viewModel.selectedCategory == category;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(
                            category.toUpperCase(),
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) {
                              viewModel.setCategory(category);
                            }
                          },
                          selectedColor: AppColors.accent,
                          backgroundColor: AppColors.productBackground,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected
                                  ? AppColors.accent
                                  : AppColors.productCardText,
                            ),
                          ),
                          showCheckmark: false,
                        ),
                      );
                    },
                  ),
                );
              },
            ),
            const SizedBox(height: 8),
            Consumer<ProductsViewmodel>(
              builder: (context, viewModel, child) {
                if (viewModel.selectedStore != null) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      children: [
                        InputChip(
                          label: Text('Sklep: ${viewModel.selectedStore}'),
                          onDeleted: () {
                            viewModel.clearStoreFilter();
                          },
                          deleteIcon: const Icon(Icons.close, size: 18),
                          backgroundColor: AppColors.accent.withOpacity(0.1),
                          labelStyle: TextStyle(color: AppColors.accent),
                        ),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
            Expanded(
              child: Consumer<ProductsViewmodel>(
                builder: (context, viewModel, child) {
                  if (viewModel.isLoading && viewModel.productsList.isEmpty) {
                    return ListView.builder(
                      padding: const EdgeInsets.only(top: 8.0),
                      itemCount: 6, // Show 6 skeletons
                      itemBuilder: (context, index) {
                        return const ProductCardSkeleton();
                      },
                    );
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
                    child: AnimationLimiter(
                      child: ListView.builder(
                        padding: const EdgeInsets.only(top: 8.0),
                        itemCount: viewModel.productsList.length,
                        itemBuilder: (context, index) {
                          final product = viewModel.productsList[index];
                          final discountPercent =
                              viewModel.getDiscountPercentage(
                                product.priceOriginal,
                                product.priceUsers,
                              );
                          return AnimationConfiguration.staggeredList(
                            position: index,
                            duration: const Duration(milliseconds: 375),
                            child: SlideAnimation(
                              verticalOffset: 50.0,
                              child: FadeInAnimation(
                                child: ProductCard(
                                  product: product,
                                  discountPercent: discountPercent,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
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
