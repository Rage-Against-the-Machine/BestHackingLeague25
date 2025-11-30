import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme/app_colors.dart';
import 'package:mobile_app/core/theme/app_theme.dart';
import 'package:mobile_app/features/map/view/map_page.dart';
import 'package:mobile_app/features/map/viewModel/map_viewmodel.dart';
import 'package:mobile_app/features/products/view/products_page.dart';
import 'package:mobile_app/features/products/viewmodel/products_viewmodel.dart';
import 'package:mobile_app/features/profile/view/user_page.dart';
import 'package:mobile_app/features/profile/viewModel/user_viewmodel.dart';
import 'package:mobile_app/features/shopping_list/view/shopping_list_page.dart';
import 'package:mobile_app/features/shopping_list/viewmodel/shopping_list_viewmodel.dart';
import 'package:mobile_app/features/navigation/viewmodel/navigation_viewmodel.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NavigationViewModel()),
        ChangeNotifierProvider(create: (_) => ShoppingListViewModel()),
        ChangeNotifierProvider(create: (_) => UserViewModel()),
        ChangeNotifierProxyProvider<UserViewModel, ProductsViewmodel>(
          create: (_) => ProductsViewmodel(),
          update: (_, userViewModel, productsViewModel) =>
              productsViewModel!..update(userViewModel),
        ),
        ChangeNotifierProxyProvider<UserViewModel, MapViewModel>(
          create: (context) => MapViewModel(
            productsViewModel: context.read<ProductsViewmodel>(),
          ),
          update: (_, userViewModel, mapViewModel) =>
              mapViewModel!..update(userViewModel),
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
  late final List<Widget> _pages = [
    ProductsPage(),
    MapPage(),
    ShoppingListPage(),
    UserPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Pamiętaj, aby upewnić się, że AppTheme.lightTheme.colorScheme jest poprawnie zdefiniowany
      theme: ThemeData(colorScheme: AppTheme.lightTheme.colorScheme),
      title: 'GAZETKA',
      debugShowCheckedModeBanner: false,
      home: Consumer<NavigationViewModel>(
        builder: (context, navViewModel, child) {
          return Scaffold(
            backgroundColor: AppColors.background,
            bottomNavigationBar: Container(
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
                child: NavigationBar(
                  backgroundColor: Colors.white,
                  surfaceTintColor: Colors.transparent,
                  indicatorColor: AppColors.accent,
                  onDestinationSelected: (int index) {
                    navViewModel.setIndex(index);
                  },
                  selectedIndex: navViewModel.selectedIndex,
                  destinations: [
                    NavigationDestination(
                      icon: const Icon(
                        Icons.local_offer_outlined,
                        color: AppColors.textSecondary,
                      ),
                      selectedIcon: const Icon(
                        Icons.local_offer,
                        color: Colors.white,
                      ),
                      label: 'Produkty',
                    ),
                    NavigationDestination(
                      icon: const Icon(
                        Icons.map_outlined,
                        color: AppColors.textSecondary,
                      ),
                      selectedIcon: const Icon(Icons.map, color: Colors.white),
                      label: 'Mapa',
                    ),
                    NavigationDestination(
                      icon: const Icon(
                        Icons.list_alt_outlined,
                        color: AppColors.textSecondary,
                      ),
                      selectedIcon: const Icon(
                        Icons.list_alt,
                        color: Colors.white,
                      ),
                      label: 'Lista',
                    ),
                    NavigationDestination(
                      icon: const Icon(
                        Icons.person_outline,
                        color: AppColors.textSecondary,
                      ),
                      selectedIcon: const Icon(
                        Icons.person,
                        color: Colors.white,
                      ),
                      label: 'Profil',
                    ),
                  ],
                ),
              ),
            ),

            body: _pages[navViewModel.selectedIndex],
          );
        },
      ),
    );
  }
}
