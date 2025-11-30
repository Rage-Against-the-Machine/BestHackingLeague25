import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTypography {
  static const fontFamily = 'Roboto';
  static const headline = TextStyle(
    fontFamily: 'PlayfairDisplay',
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  static const productLabel = TextStyle(
    fontFamily: 'PlayfairDisplay',
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  static const body = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 16,
    color: AppColors.textPrimary,
  );
  static const price = TextStyle(
    fontFamily: 'PlayfairDisplay',
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: AppColors.textUrgent,
  );
  static const discountedPrice = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 12,
    decoration: TextDecoration.lineThrough,
    color: AppColors.textSecondary,
  );
  static const discountPercent = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 12,
    color: AppColors.productCardText,
  );
  static const expiryDate = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 12,
    color: AppColors.textSecondary,
  );
  static const caption = TextStyle(
    fontFamily: 'SpaceGrotesk',
    fontSize: 12,
    color: AppColors.textSecondary,
  );
}
