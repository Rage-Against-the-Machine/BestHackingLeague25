import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewModel.dart';
import 'package:qr_flutter/qr_flutter.dart';

class UserPage extends StatelessWidget {
  final UserViewModel userViewModel;
  const UserPage({super.key, required this.userViewModel});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 32.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.person_outline_outlined,
                      size: 32,
                      color: AppColors.textPrimary,
                    ),
                    Text(
                      userViewModel.user.id,
                      style: AppTypography.productLabel,
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(color: Colors.white),
                child: QrImageView(
                  data: userViewModel.qrData,
                  version: QrVersions.auto,
                  size: 220.0,
                  gapless: true,
                  dataModuleStyle: QrDataModuleStyle(
                    color: AppColors.textPrimary,
                    dataModuleShape: QrDataModuleShape.square,
                  ),
                  eyeStyle: QrEyeStyle(
                    color: AppColors.textPrimary,
                    eyeShape: QrEyeShape.square,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Zeskanuj kod aby potwierdzić swoją tożsamość.',
                style: AppTypography.caption.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              SavedMoneyWidget(
                totalSavings: userViewModel.totalSavings.toDouble(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SavedMoneyWidget extends StatelessWidget {
  final double totalSavings;

  const SavedMoneyWidget({required this.totalSavings, super.key});

  @override
  Widget build(BuildContext context) {
    // Formatowanie kwoty na string z dwoma miejscami po przecinku i walutą
    final String formattedSavings = '${totalSavings.toStringAsFixed(2)} PLN';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
      decoration: BoxDecoration(
        border: Border.all(
          color: AppColors.discountBadgeBackground,
          width: 1.5,
        ),
      ),
      child: Column(
        children: [
          Text(
            'Łącznie zaoszczędzono:'.toUpperCase(),
            style: AppTypography.caption.copyWith(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            formattedSavings,
            style: AppTypography.price.copyWith(
              fontSize: 32.0, // Duża czcionka, by podkreślić wartość
              fontWeight: FontWeight.w900,
              color: AppColors.discountBadgeBackground,
            ),
          ),
        ],
      ),
    );
  }
}
