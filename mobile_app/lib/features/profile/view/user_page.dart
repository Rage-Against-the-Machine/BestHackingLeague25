import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_typography.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewModel.dart';
import 'package:qr_flutter/qr_flutter.dart';

class UserPage extends StatefulWidget {
  final UserViewModel userViewModel;
  const UserPage({super.key, required this.userViewModel});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  final TextEditingController _usernameController = TextEditingController();

  final TextEditingController _passwordController = TextEditingController();

  bool _isLoggingIn = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    setState(() {
      _isLoggingIn = true;
    });

    final String username = _usernameController.text.trim();

    try {
      await widget.userViewModel.fetchUser(username: username);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Błąd logowania: Niepoprawny login lub hasło.'),
          ),
        );
      }
    } finally {
      setState(() {
        _isLoggingIn = false;
      });
    }
  }

  Widget _buildLoginView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_outline, size: 60, color: AppColors.accent),
            const SizedBox(height: 24),
            Text(
              'Zaloguj się do swojego profilu',
              style: AppTypography.headline.copyWith(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            TextField(
              controller: _usernameController,
              decoration: InputDecoration(
                labelText: 'Nazwa użytkownika',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.person),
              ),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Hasło',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.lock),
              ),
            ),
            const SizedBox(height: 24),

            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onPressed: _isLoggingIn ? null : _handleLogin,
              child: _isLoggingIn
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      'Zaloguj się',
                      style: AppTypography.productLabel.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListenableBuilder(
        listenable: widget.userViewModel,
        builder: (context, child) {
          if (widget.userViewModel.user == null) {
            return _buildLoginView();
          }

          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.person_outline_outlined,
                          size: 32,
                          color: AppColors.textPrimary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          widget.userViewModel.username,
                          style: AppTypography.productLabel.copyWith(
                            fontSize: 24,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // WIDŻET OSZCZĘDNOŚCI (przeniesiony na górę, jest ważniejszy niż QR)
                  SavedMoneyWidget(
                    totalSavings: widget.userViewModel.points.toDouble(),
                  ),
                  const SizedBox(height: 32),

                  // Kod QR
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 5,
                        ),
                      ],
                    ),
                    child: QrImageView(
                      data: widget.userViewModel.qrData,
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
                    'Zeskanuj kod, aby potwierdzić swoją tożsamość.',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
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
