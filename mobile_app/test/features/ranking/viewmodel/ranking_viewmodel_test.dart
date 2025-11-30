import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/features/ranking/viewmodel/ranking_viewmodel.dart';
import 'package:mocktail/mocktail.dart';

class MockClient extends Mock implements http.Client {}

void main() {
  late MockClient mockClient;
  late RankingViewModel viewModel;

  final mockResponse = jsonEncode([
    {
      'name': 'Sklep A',
      'points': 100,
      'location': {
        'city': 'Warszawa',
        'province': 'Mazowieckie',
        'coords': [52.0, 21.0]
      },
      'store_id': 1
    }
  ]);

  setUp(() {
    mockClient = MockClient();
    registerFallbackValue(Uri());
  });

  group('RankingViewModel', () {
    test('fetchRankings populates rankings list on success', () async {
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response(mockResponse, 200),
      );

      viewModel = RankingViewModel(client: mockClient);
      
      await Future.delayed(Duration.zero);

      expect(viewModel.rankings.length, 1);
      expect(viewModel.rankings.first.name, 'Sklep A');
      expect(viewModel.errorMessage, null);
    });

    test('fetchRankings sets errorMessage on failure', () async {
      when(() => mockClient.get(any())).thenAnswer(
        (_) async => http.Response('Error', 500),
      );

      viewModel = RankingViewModel(client: mockClient);
      
      await Future.delayed(Duration.zero);

      expect(viewModel.rankings.isEmpty, true);
      expect(viewModel.errorMessage, contains('Nie udało się pobrać rankingu'));
    });
  });
}
