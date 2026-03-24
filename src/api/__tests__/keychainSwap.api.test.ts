import {KeychainSwapApi} from '../keychainSwap.api';
import {BaseApi} from '../base.api';

jest.mock('utils/config.utils', () => ({
  SwapsConfig: {baseURL: 'https://swap.test'},
}));

jest.mock('../base.api', () => ({
  BaseApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('KeychainSwapApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('delegates to BaseApi with swap base URL', async () => {
      (BaseApi.get as jest.Mock).mockResolvedValue({ok: true});

      const result = await KeychainSwapApi.get('quotes/1');

      expect(result).toEqual({ok: true});
      expect(BaseApi.get).toHaveBeenCalledWith('https://swap.test/quotes/1');
    });

    it('maps Failed to fetch to swap_server_unavailable', async () => {
      (BaseApi.get as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch'),
      );

      await expect(KeychainSwapApi.get('x')).rejects.toMatchObject({
        code: 500,
        reason: {template: 'swap_server_unavailable'},
      });
    });

    it('maps Network request failed to swap_server_unavailable', async () => {
      (BaseApi.get as jest.Mock).mockRejectedValue(
        new Error('Network request failed'),
      );

      await expect(KeychainSwapApi.get('x')).rejects.toMatchObject({
        code: 500,
        message: 'Network request failed',
      });
    });

    it('returns undefined for other errors', async () => {
      (BaseApi.get as jest.Mock).mockRejectedValue(new Error('other'));

      await expect(KeychainSwapApi.get('x')).resolves.toBeUndefined();
    });
  });

  describe('post', () => {
    it('delegates to BaseApi with swap base URL', async () => {
      (BaseApi.post as jest.Mock).mockResolvedValue({id: 1});
      const body = {a: 1};

      const result = await KeychainSwapApi.post('submit', body);

      expect(result).toEqual({id: 1});
      expect(BaseApi.post).toHaveBeenCalledWith(
        'https://swap.test/submit',
        body,
      );
    });

    it('maps Failed to fetch on post to swap_server_unavailable', async () => {
      (BaseApi.post as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

      await expect(KeychainSwapApi.post('x', {})).rejects.toMatchObject({
        code: 500,
        reason: {template: 'swap_server_unavailable'},
      });
    });

    it('returns undefined for other post errors', async () => {
      (BaseApi.post as jest.Mock).mockRejectedValue(new Error('bad'));

      await expect(KeychainSwapApi.post('x', {})).resolves.toBeUndefined();
    });
  });
});
