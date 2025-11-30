import 'package:mobile_app/features/map/model/map_location.dart';

class User {
  final String id;
  final String email;
  final int points;
  final MapLocation? location;

  User({required this.id, required this.email, this.location, this.points = 0});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'] ?? '',
      points: json['points'] ?? 0,
      location: json['location'] != null
          ? MapLocation.from(json['location'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id};
  }
}
