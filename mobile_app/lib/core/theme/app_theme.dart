import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: AppColors.textPrimary,
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: ColorScheme.light(
      primary: AppColors.textPrimary,
      secondary: AppColors.textSecondary,
    ),
    textTheme: TextTheme(
      headlineLarge: AppTypography.headline,
      bodyMedium: AppTypography.body,
      bodySmall: AppTypography.caption,
    ),
  );
}
