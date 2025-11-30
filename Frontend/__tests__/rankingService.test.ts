// __tests__/rankingService.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rankingService } from '../services/rankingService';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('rankingService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getRanking should fetch from the base URL if no province is provided', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    // Act
    await rankingService.getRanking();

    // Assert
    expect(fetchMock).toHaveBeenCalledWith('http://100.82.90.77:6969/stores-ranking');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('getRanking should include the province in the URL if provided', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    const province = 'mazowieckie';

    // Act
    await rankingService.getRanking(province);

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(`http://100.82.90.77:6969/stores-ranking?province=${province}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
