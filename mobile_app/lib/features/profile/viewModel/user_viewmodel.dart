import 'package:mobile_app/features/profile/model/user.dart';

class UserViewModel {
  final User qrCode = User(id: '1234567890');

  String get qrData {
    return qrCode.id;
  }
}
