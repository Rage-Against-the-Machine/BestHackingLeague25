import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/products/view/product_card.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text('GAZETKA', style: AppTypography.headline),
            ),

            Expanded(
              child: ListView.builder(
                itemCount: 20,
                itemBuilder: (context, index) {
                  return ProductCard();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
