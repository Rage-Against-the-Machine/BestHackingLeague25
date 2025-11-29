
import { RankingEntry } from "../types";

const MOCK_RANKING_DATA: RankingEntry[] = [
    { id: 1, name: 'Biedronka', location: 'ul. Marszałkowska 10', score: 98, saved: 1240 },
    { id: 2, name: 'Lidl', location: 'Al. Jerozolimskie 50', score: 95, saved: 980 },
    { id: 3, name: 'Lokalny Warzywniak', location: 'Rynek Główny 5', score: 92, saved: 450 },
    { id: 4, name: 'Carrefour', location: 'Złote Tarasy', score: 88, saved: 760 },
    { id: 5, name: 'Żabka', location: 'ul. Poznańska 3', score: 85, saved: 320 },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rankingService = {
    getRanking: async (): Promise<RankingEntry[]> => {
        await delay(500);
        return MOCK_RANKING_DATA;
    }
};
