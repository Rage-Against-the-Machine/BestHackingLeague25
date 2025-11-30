class User {
  final String id;
  final String email;
  final int points;

  User({required this.id, required this.email, this.points = 0});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['username'] ?? 'unknown',
      email: json['email'] ?? '',
      points: json['points'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id};
  }
}
