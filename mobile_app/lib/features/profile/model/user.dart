import 'package:mobile_app/features/map/model/map_location.dart';

class User {
  final String id;
  final MapLocation? location;

  User({required this.id, this.location});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(id: json['id']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id};
  }
}
