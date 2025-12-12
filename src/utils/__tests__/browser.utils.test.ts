import {BrowserUtils, urlTransformer} from '../browser.utils';
import URL from 'url-parse';

describe('browser.utils', () => {
  describe('urlTransformer', () => {
    it('should transform URL correctly', () => {
      const result = urlTransformer('https://www.example.com/path');
      expect(result.hostname).toBe('example.com');
      expect(result.isHttps).toBe(true);
      expect(result.pathname).toBe('/path');
    });

    it('should remove www prefix', () => {
      const result = urlTransformer('https://www.test.com');
      expect(result.hostname).toBe('test.com');
    });

    it('should handle root pathname', () => {
      const result = urlTransformer('https://example.com/');
      expect(result.pathname).toBe('');
    });

    it('should handle non-https URLs', () => {
      const result = urlTransformer('http://example.com');
      expect(result.isHttps).toBe(false);
    });

    it('should lowercase hostname', () => {
      const result = urlTransformer('https://EXAMPLE.COM');
      expect(result.hostname).toBe('example.com');
    });
  });

  describe('BrowserUtils.findTabById', () => {
    it('should find tab by id', () => {
      const tabs = [
        {id: 1, url: 'https://example.com'},
        {id: 2, url: 'https://test.com'},
      ];
      const result = BrowserUtils.findTabById(tabs as any, 2);
      expect(result?.id).toBe(2);
      expect(result?.url).toBe('https://test.com');
    });

    it('should return undefined if tab not found', () => {
      const tabs = [{id: 1, url: 'https://example.com'}];
      const result = BrowserUtils.findTabById(tabs as any, 999);
      expect(result).toBeUndefined();
    });

    it('should handle empty array', () => {
      const result = BrowserUtils.findTabById([], 1);
      expect(result).toBeUndefined();
    });
  });
});
















