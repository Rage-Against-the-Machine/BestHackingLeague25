import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewModel.dart';
import 'package:qr_flutter/qr_flutter.dart'; // Importujemy bibliotekę QR

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
                child: Text('Mój Profil', style: AppTypography.headline),
              ),

              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      spreadRadius: 2,
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
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
                    color: AppColors.accent,
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

              // Możesz dodać tutaj inne elementy, np. przyciski, linki
            ],
          ),
        ),
      ),
    );
  }
}
