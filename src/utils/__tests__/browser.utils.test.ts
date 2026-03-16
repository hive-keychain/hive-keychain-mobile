import {
  BrowserUtils,
  getAllowedBrowserNavigationUrl,
  isInsecureBrowserUrl,
  urlTransformer,
} from '../browser.utils';

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

  describe('getAllowedBrowserNavigationUrl', () => {
    it('allows https urls', () => {
      expect(
        getAllowedBrowserNavigationUrl('https://example.com/path'),
      ).toEqual({
        protocol: 'https:',
        url: 'https://example.com/path',
      });
    });

    it('allows http urls for local development', () => {
      expect(
        getAllowedBrowserNavigationUrl('http://localhost:3000'),
      ).toEqual({
        protocol: 'http:',
        url: 'http://localhost:3000',
      });
    });

    it('allows about blank', () => {
      expect(getAllowedBrowserNavigationUrl('about:blank')).toEqual({
        protocol: 'about:',
        url: 'about:blank',
      });
    });

    it('blocks unsupported custom schemes', () => {
      expect(
        getAllowedBrowserNavigationUrl('intent://scan/#Intent;scheme=zxing;end'),
      ).toBeNull();
      expect(getAllowedBrowserNavigationUrl('javascript:alert(1)')).toBeNull();
      expect(getAllowedBrowserNavigationUrl('file:///tmp/test.html')).toBeNull();
      expect(getAllowedBrowserNavigationUrl('content://downloads/test')).toBeNull();
    });

    it('blocks malformed or empty urls', () => {
      expect(getAllowedBrowserNavigationUrl('')).toBeNull();
      expect(getAllowedBrowserNavigationUrl('   ')).toBeNull();
      expect(getAllowedBrowserNavigationUrl('example.com')).toBeNull();
      expect(getAllowedBrowserNavigationUrl('https://')).toBeNull();
    });
  });

  describe('isInsecureBrowserUrl', () => {
    it('flags http urls as insecure', () => {
      expect(isInsecureBrowserUrl('http://127.0.0.1:8080')).toBe(true);
    });

    it('does not flag https or about blank urls', () => {
      expect(isInsecureBrowserUrl('https://example.com')).toBe(false);
      expect(isInsecureBrowserUrl('about:blank')).toBe(false);
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

















