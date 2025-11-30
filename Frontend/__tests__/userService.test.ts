// __tests__/userService.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { userService } from '../services/userService';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('userService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getUser should fetch user data with the correct username', async () => {
    // Arrange
    const username = 'testuser';
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ username: 'testuser', email: 'test@example.com' }),
    });

    // Act
    await userService.getUser(username);

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(`/api/get-user?username=${username}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('generateQr should request a QR code for the correct username', async () => {
    // Arrange
    const username = 'testuser';
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ qr_code: 'some-qr-code-data' }),
    });

    // Act
    await userService.generateQr(username);

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(`/api/generate-qr?username=${username}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
