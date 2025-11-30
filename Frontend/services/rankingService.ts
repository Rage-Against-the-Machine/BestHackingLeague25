import { RankingEntry } from "../types";

const API_BASE_URL = 'http://100.82.90.77:6969';

const transformRanking = (backendEntry: any): RankingEntry => ({
  id: backendEntry.store_id,
  name: backendEntry.name,
  location: backendEntry.city,
  score: backendEntry.points,
  saved: 0, // 'saved' is not provided by the backend, default to 0
});


export const rankingService = {
    getRanking: async (province?: string): Promise<RankingEntry[]> => {
        let url = `${API_BASE_URL}/stores-ranking`;
        if (province) {
            url += `?province=${encodeURIComponent(province)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch ranking');
        }
        const data = await response.json();
        return data.map(transformRanking);
    }
};
