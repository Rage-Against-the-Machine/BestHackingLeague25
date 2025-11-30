import 'package:mobile_app/features/profile/model/user.dart';

class UserViewModel {
  final User user = User(id: '1234567890', totalSavings: 100);

  String get qrData {
    return user.id;
  }

  int get totalSavings {
    return user.totalSavings ?? 0;
  }
}
