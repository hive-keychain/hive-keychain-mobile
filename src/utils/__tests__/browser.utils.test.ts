import * as FileSystem from 'expo-file-system/legacy';
import {captureRef} from 'react-native-view-shot';
import {
  BrowserUtils,
  getAllowedBrowserNavigationUrl,
  isInsecureBrowserUrl,
  urlTransformer,
} from '../browser.utils';

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///docs/',
  getInfoAsync: jest.fn(async () => ({exists: false})),
  makeDirectoryAsync: jest.fn(async () => undefined),
  copyAsync: jest.fn(async () => undefined),
  deleteAsync: jest.fn(async () => undefined),
}));

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

  describe('tab previews', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({exists: false});
    });

    it('persists a capture to the documents directory and returns a relative key', async () => {
      const result = await BrowserUtils.captureTab({current: {}}, 123);

      expect(captureRef).toHaveBeenCalledWith(
        {},
        {format: 'jpg', quality: 0.2},
      );
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        'file:///docs/tab-previews',
        {intermediates: true},
      );
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///docs/tab-previews/123.jpg',
        {idempotent: true},
      );
      expect(FileSystem.copyAsync).toHaveBeenCalledWith({
        from: 'mock-uri',
        to: 'file:///docs/tab-previews/123.jpg',
      });
      expect(result).toBe('tab-previews/123.jpg');
    });

    it('does not recreate the preview directory when it already exists', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({exists: true});

      await BrowserUtils.captureTab({current: {}}, 1);

      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });

    it('resolves relative preview keys against documentDirectory', () => {
      expect(BrowserUtils.resolveTabPreviewUri('tab-previews/1.jpg')).toBe(
        'file:///docs/tab-previews/1.jpg',
      );
    });

    it('ignores legacy tmpfile preview URIs', () => {
      expect(
        BrowserUtils.resolveTabPreviewUri(
          'file:///tmp/ReactNative-snapshot-image123.jpg',
        ),
      ).toBeUndefined();
      expect(BrowserUtils.resolveTabPreviewUri(undefined)).toBeUndefined();
    });

    it('deletes a single tab preview idempotently', async () => {
      await BrowserUtils.deleteTabPreview(5);

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///docs/tab-previews/5.jpg',
        {idempotent: true},
      );
    });

    it('deletes all tab previews idempotently', async () => {
      await BrowserUtils.deleteAllTabPreviews();

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///docs/tab-previews',
        {idempotent: true},
      );
    });
  });
});

















