import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_theme.dart';
import 'package:mobile_app/features/map/view/map_page.dart';
import 'package:mobile_app/features/map/viewModel/map_viewmodel.dart';
import 'package:mobile_app/features/products/view/products_page.dart';
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';
import 'package:mobile_app/features/profile/view/user_page.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewModel.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProductsViewmodel()),

        ChangeNotifierProvider(
          create: (context) => MapViewModel(
            productsViewModel: context.read<ProductsViewmodel>(),
          ),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int currentPageIndex = 0;
  UserViewModel userViewModel = UserViewModel();

  late final List<Widget> _pages = [
    ProductsPage(),
    MapPage(),
    UserPage(userViewModel: userViewModel),
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Pamiętaj, aby upewnić się, że AppTheme.lightTheme.colorScheme jest poprawnie zdefiniowany
      theme: ThemeData(colorScheme: AppTheme.lightTheme.colorScheme),
      title: 'GAZETKA',
      home: Scaffold(
        backgroundColor: AppColors.background,
        bottomNavigationBar: NavigationBar(
          onDestinationSelected: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
          selectedIndex: currentPageIndex,
          indicatorColor: AppColors.accent,

          destinations: [
            NavigationDestination(
              icon: Icon(
                Icons.discount,
                color: currentPageIndex == 0
                    ? AppColors.productCardText
                    : AppColors.discountBadgeBackground,
              ),
              label: 'Produkty',
            ),
            NavigationDestination(
              icon: Icon(
                Icons.map,
                color: currentPageIndex == 1
                    ? AppColors.productCardText
                    : AppColors.discountBadgeBackground,
              ),
              label: 'Mapa',
            ),
            NavigationDestination(
              icon: Icon(
                Icons.person,
                color: currentPageIndex == 2
                    ? AppColors.productCardText
                    : AppColors.discountBadgeBackground,
              ),
              label: 'Profil',
            ),
          ],
        ),

        body: _pages[currentPageIndex],
      ),
    );
  }
}
