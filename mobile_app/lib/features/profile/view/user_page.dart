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
  bool _isLoggingOut = false;

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
    final String password =
        _passwordController.text; // Hasło nie powinno być trimowane

    try {
      // 1. Walidacja loginu i hasła
      final bool validated = await widget.userViewModel.validateLogin(
        username: username,
        password: password,
      );

      if (validated) {
        // 2. Jeśli walidacja się powiodła, pobieramy dane użytkownika
        await widget.userViewModel.fetchUser(username: username);
      } else {
        // 3. Walidacja nie powiodła się
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Błąd logowania: Niepoprawny login lub hasło.'),
            ),
          );
        }
      }
    } catch (e) {
      // Obsługa błędów sieci, serwera itp.
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Błąd połączenia. Spróbuj ponownie.')),
        );
      }
    } finally {
      setState(() {
        _isLoggingIn = false;
      });
    }
  }

  Future<void> _handleLogout() async {
    setState(() {
      _isLoggingOut = true;
    });

    try {
      await widget.userViewModel.logout();
      // Czyścimy lokalne pola
      _usernameController.clear();
      _passwordController.clear();

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Pomyślnie wylogowano.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Wylogowanie nie powiodło się.')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoggingOut = false;
        });
      }
    }
  }

  // Nowy widget dla Slidera
  Widget _buildDistanceSlider(
    double currentDistance,
    ValueSetter<double> onDistanceChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Maksymalna odległość sklepu: ${currentDistance.round()} km',
              style: AppTypography.price.copyWith(color: AppColors.textPrimary),
            ),
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              activeTrackColor: AppColors.accent,
              inactiveTrackColor: AppColors.productCardText,
              thumbColor: AppColors.accent,
              overlayColor: AppColors.accent.withOpacity(0.1),
              valueIndicatorColor: AppColors.accent,
              showValueIndicator: ShowValueIndicator.always,
              trackHeight: 8.0,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8.0),
            ),
            child: Slider(
              value: currentDistance,
              min: 1.0,
              max: 50.0,
              divisions: 49,
              label: '${currentDistance.round()} km',

              onChanged: (double newValue) {
                onDistanceChanged(newValue);
              },
            ),
          ),
        ],
      ),
    );
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
          final double currentMaxDistance = widget.userViewModel.maxDistanceKm;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    PopupMenuButton<String>(
                      onSelected: (value) async {
                        if (value == 'logout') {
                          await _handleLogout();
                        }
                      },
                      itemBuilder: (context) => [
                        PopupMenuItem<String>(
                          value: 'logout',
                          child: Row(
                            children: [
                              if (_isLoggingOut)
                                const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              else
                                const Icon(Icons.logout, size: 18),
                              const SizedBox(width: 8),
                              const Text('Wyloguj się'),
                            ],
                          ),
                        ),
                      ],
                      child: Row(
                        children: [
                          const SizedBox(width: 8),
                          Text(
                            widget.userViewModel.username.toUpperCase(),
                            style: AppTypography.body,
                          ),
                          Icon(
                            Icons.arrow_drop_down,
                            color: AppColors.textPrimary,
                          ),
                          const SizedBox(width: 8),
                        ],
                      ),
                    ),
                  ],
                ),
                // WIDŻET OSZCZĘDNOŚCI
                SavedMoneyWidget(
                  totalSavings: widget.userViewModel.points.toDouble(),
                ),

                const SizedBox(height: 32),

                Text(
                  'Twój kod QR:',
                  style: AppTypography.price.copyWith(
                    color: AppColors.textPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                // Kod QR
                Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(16.0),

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
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Zeskanuj kod, aby potwierdzić swoją tożsamość.',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // WIDŻET SUWAKA ODLEGŁOŚCI
                _buildDistanceSlider(
                  currentMaxDistance,
                  // Przekazujemy funkcję, która bezpośrednio aktualizuje ViewModel
                  (newValue) => widget.userViewModel.setMaxDistanceKm(newValue),
                ),
              ],
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
    final String formattedSavings =
        '${(totalSavings / 100).toStringAsFixed(2)} PLN';

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Łącznie zaoszczędzono:',
          style: AppTypography.price.copyWith(
            fontWeight: FontWeight.bold,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              decoration: BoxDecoration(
                color: AppColors.textUrgent,
                border: Border.all(color: AppColors.textUrgent, width: 2),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                formattedSavings,
                style: AppTypography.price.copyWith(
                  fontSize: 32.0,
                  fontWeight: FontWeight.w900,
                  color: AppColors.productBackground,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
