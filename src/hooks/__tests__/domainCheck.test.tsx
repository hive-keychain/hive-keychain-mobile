import {renderHook, waitFor} from '@testing-library/react-native';
import {useDomainCheck} from '../domainCheck';
import PhishingUtils from 'utils/phishing.utils';
import {urlTransformer} from 'utils/browser.utils';

jest.mock('utils/phishing.utils');
jest.mock('utils/browser.utils');

describe('useDomainCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined when domain is not blacklisted', async () => {
    (PhishingUtils.getBlacklistedDomains as jest.Mock).mockResolvedValueOnce(
      [],
    );
    (urlTransformer as jest.Mock).mockReturnValue({
      hostname: 'example.com',
      hash: '',
      pathname: '/',
    });

    const {result} = renderHook(() =>
      useDomainCheck({domain: 'https://example.com'}),
    );

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should return warning when hostname is blacklisted', async () => {
    (PhishingUtils.getBlacklistedDomains as jest.Mock).mockResolvedValueOnce([
      'phishing.com',
    ]);
    (urlTransformer as jest.Mock).mockReturnValue({
      hostname: 'phishing.com',
      hash: '',
      pathname: '/',
    });

    const {result} = renderHook(() =>
      useDomainCheck({domain: 'https://phishing.com'}),
    );

    await waitFor(() => {
      // translate mock returns the key with params, so check for the key
      expect(result.current).toContain('wallet.operations.phishing_domain');
      expect(result.current).toContain('phishing.com');
    });
  });

  it('should check hostname + pathname combination', async () => {
    (PhishingUtils.getBlacklistedDomains as jest.Mock).mockResolvedValueOnce([
      'example.com/path',
    ]);
    (urlTransformer as jest.Mock).mockReturnValue({
      hostname: 'example.com',
      hash: '',
      pathname: '/path',
    });

    const {result} = renderHook(() =>
      useDomainCheck({domain: 'https://example.com/path'}),
    );

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current).toContain('wallet.operations.phishing_domain');
    });
  });

  it('should check hostname + hash combination', async () => {
    (PhishingUtils.getBlacklistedDomains as jest.Mock).mockResolvedValueOnce([
      'example.com#hash',
    ]);
    (urlTransformer as jest.Mock).mockReturnValue({
      hostname: 'example.com',
      hash: '#hash',
      pathname: '/',
    });

    const {result} = renderHook(() =>
      useDomainCheck({domain: 'https://example.com#hash'}),
    );

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current).toContain('wallet.operations.phishing_domain');
    });
  });
});

