import {BaseApi} from '../base.api';

// Mock fetch globally
global.fetch = jest.fn();

describe('BaseApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should make GET request and return JSON', async () => {
      const mockData = {success: true, data: 'test'};
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await BaseApi.get('https://api.example.com/data');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });
    });

    it('should resolve with undefined on non-200 status', async () => {
      // Note: The implementation resolves with undefined when status is not 200
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 404,
        json: jest.fn(),
      });

      const result = await BaseApi.get('https://api.example.com/data');
      expect(result).toBeUndefined();
    });

    it('should reject on fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(BaseApi.get('https://api.example.com/data')).rejects.toBeDefined();
    });

    it('should reject on JSON parse error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockRejectedValueOnce(new Error('Parse error')),
      });

      await expect(BaseApi.get('https://api.example.com/data')).rejects.toBeDefined();
    });
  });

  describe('post', () => {
    it('should make POST request with body and return JSON', async () => {
      const mockData = {success: true};
      const body = {key: 'value'};
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await BaseApi.post('https://api.example.com/data', body);
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
    });

    it('should resolve with undefined on non-200 status', async () => {
      // Note: The implementation resolves with undefined when status is not 200
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn(),
      });

      const result = await BaseApi.post('https://api.example.com/data', {});
      expect(result).toBeUndefined();
    });

    it('should reject on fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        BaseApi.post('https://api.example.com/data', {}),
      ).rejects.toBeDefined();
    });
  });
});

