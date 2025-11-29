import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_theme.dart';
import 'package:mobile_app/features/products/view/products_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(colorScheme: AppTheme.lightTheme.colorScheme),
      title: 'GAZETKA',
      home: Scaffold(
        bottomNavigationBar: NavigationBar(
          onDestinationSelected: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
          selectedIndex: currentPageIndex,
          indicatorColor: AppColors.accent,

          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.discount),
              label: 'Produkty',
            ),
            NavigationDestination(icon: Icon(Icons.map), label: 'Mapa'),
            NavigationDestination(icon: Icon(Icons.person), label: 'Profil'),
          ],
        ),
        body: ProductsPage(),
      ),
    );
  }
}
