import {
  ClaimsConfig,
  HASConfig,
  hiveEngineWebsiteURL,
  tutorialBaseUrl,
  hiveEngine,
  hiveConfig,
  TransakConfig,
  BrowserConfig,
  KeychainConfig,
  MultisigConfig,
  WitnessesConfig,
  SwapsConfig,
  ProposalConfig,
  PeakdNotificationsConfig,
} from '../config.utils';

describe('config.utils', () => {
  describe('hiveEngineWebsiteURL', () => {
    it('should be a valid URL', () => {
      expect(hiveEngineWebsiteURL).toBe('https://hive-engine.com/');
      expect(hiveEngineWebsiteURL).toMatch(/^https?:\/\//);
    });
  });

  describe('tutorialBaseUrl', () => {
    it('should have a default URL', () => {
      expect(tutorialBaseUrl).toBeDefined();
      expect(tutorialBaseUrl).toMatch(/^https?:\/\//);
    });

    it('should be a valid URL string', () => {
      expect(typeof tutorialBaseUrl).toBe('string');
      expect(tutorialBaseUrl.length).toBeGreaterThan(0);
    });
  });

  describe('hiveEngine', () => {
    it('should have CHAIN_ID', () => {
      expect(hiveEngine.CHAIN_ID).toBe('ssc-mainnet-hive');
    });
  });

  describe('hiveConfig', () => {
    it('should have CREATE_ACCOUNT_URL', () => {
      expect(hiveConfig.CREATE_ACCOUNT_URL).toBe('https://signup.hive.io/');
      expect(hiveConfig.CREATE_ACCOUNT_URL).toMatch(/^https?:\/\//);
    });
  });

  describe('HASConfig', () => {
    it('should have protocol config', () => {
      expect(HASConfig.protocol).toBe('has://');
    });

    it('should have auth_req config', () => {
      expect(HASConfig.auth_req).toBe('has://auth_req/');
    });

    it('should have socket config', () => {
      expect(HASConfig.socket).toBe('wss://hive-auth.arcange.eu');
      expect(HASConfig.socket).toMatch(/^wss?:\/\//);
    });
  });

  describe('TransakConfig', () => {
    it('should have apiKey', () => {
      expect(TransakConfig.apiKey).toBeDefined();
      expect(typeof TransakConfig.apiKey).toBe('string');
    });
  });

  describe('BrowserConfig', () => {
    it('should have HOMEPAGE_URL', () => {
      expect(BrowserConfig.HOMEPAGE_URL).toBe('about:blank');
    });

    it('should have FOOTER_HEIGHT', () => {
      expect(BrowserConfig.FOOTER_HEIGHT).toBe(40);
      expect(typeof BrowserConfig.FOOTER_HEIGHT).toBe('number');
    });

    it('should have HEADER_HEIGHT', () => {
      expect(BrowserConfig.HEADER_HEIGHT).toBe(45);
      expect(typeof BrowserConfig.HEADER_HEIGHT).toBe('number');
    });

    it('should have EDGE_THRESHOLD', () => {
      expect(BrowserConfig.EDGE_THRESHOLD).toBe(30);
    });

    it('should have HOMEPAGE_FAVICON', () => {
      expect(BrowserConfig.HOMEPAGE_FAVICON).toMatch(/^https?:\/\//);
    });
  });

  describe('KeychainConfig', () => {
    it('should have ANONYMOUS_REQUESTS array', () => {
      expect(Array.isArray(KeychainConfig.ANONYMOUS_REQUESTS)).toBe(true);
      expect(KeychainConfig.ANONYMOUS_REQUESTS.length).toBeGreaterThan(0);
    });

    it('should include expected request types', () => {
      expect(KeychainConfig.ANONYMOUS_REQUESTS).toContain('delegation');
      expect(KeychainConfig.ANONYMOUS_REQUESTS).toContain('signBuffer');
      expect(KeychainConfig.ANONYMOUS_REQUESTS).toContain('transfer');
    });
  });

  describe('ClaimsConfig', () => {
    it('should have freeAccount config', () => {
      expect(ClaimsConfig.freeAccount).toBeDefined();
      expect(ClaimsConfig.freeAccount.MIN_RC_PCT).toBeDefined();
      expect(ClaimsConfig.freeAccount.MIN_RC).toBeDefined();
      expect(typeof ClaimsConfig.freeAccount.MIN_RC_PCT).toBe('number');
      expect(typeof ClaimsConfig.freeAccount.MIN_RC).toBe('number');
    });

    it('should have FREQUENCY', () => {
      expect(ClaimsConfig.FREQUENCY).toBe(10);
      expect(typeof ClaimsConfig.FREQUENCY).toBe('number');
    });

    it('should have savings config', () => {
      expect(ClaimsConfig.savings).toBeDefined();
      expect(ClaimsConfig.savings.delay).toBeDefined();
      expect(typeof ClaimsConfig.savings.delay).toBe('number');
    });

    it('should have autoStakeTokens config', () => {
      expect(ClaimsConfig.autoStakeTokens).toBeDefined();
      expect(ClaimsConfig.autoStakeTokens.FREQUENCY).toBeDefined();
      expect(typeof ClaimsConfig.autoStakeTokens.FREQUENCY).toBe('number');
    });
  });

  describe('MultisigConfig', () => {
    it('should have baseURL', () => {
      expect(MultisigConfig.baseURL).toBeDefined();
      expect(MultisigConfig.baseURL).toMatch(/^https?:\/\//);
    });
  });

  describe('WitnessesConfig', () => {
    it('should have feedWarningLimitInHours', () => {
      expect(WitnessesConfig.feedWarningLimitInHours).toBe(5);
      expect(typeof WitnessesConfig.feedWarningLimitInHours).toBe('number');
    });
  });

  describe('SwapsConfig', () => {
    it('should have baseURL', () => {
      expect(SwapsConfig.baseURL).toBeDefined();
      expect(SwapsConfig.baseURL).toMatch(/^https?:\/\//);
    });

    it('should have autoRefreshPeriodSec', () => {
      expect(SwapsConfig.autoRefreshPeriodSec).toBeDefined();
      expect(typeof SwapsConfig.autoRefreshPeriodSec).toBe('number');
    });

    it('should have autoRefreshHistoryPeriodSec', () => {
      expect(SwapsConfig.autoRefreshHistoryPeriodSec).toBeDefined();
      expect(typeof SwapsConfig.autoRefreshHistoryPeriodSec).toBe('number');
    });
  });

  describe('ProposalConfig', () => {
    it('should have KEYCHAIN_PROPOSAL', () => {
      expect(ProposalConfig.KEYCHAIN_PROPOSAL).toBe(341);
      expect(typeof ProposalConfig.KEYCHAIN_PROPOSAL).toBe('number');
    });

    it('should have PROPOSAL_MIN_VOTE_DIFFERENCE_HIDE_POPUP', () => {
      expect(ProposalConfig.PROPOSAL_MIN_VOTE_DIFFERENCE_HIDE_POPUP).toBe(
        8 * 10 ** 6,
      );
      expect(
        typeof ProposalConfig.PROPOSAL_MIN_VOTE_DIFFERENCE_HIDE_POPUP,
      ).toBe('number');
    });
  });

  describe('PeakdNotificationsConfig', () => {
    it('should have baseURL', () => {
      expect(PeakdNotificationsConfig.baseURL).toBe(
        'https://notifications.hivehub.dev',
      );
      expect(PeakdNotificationsConfig.baseURL).toMatch(/^https?:\/\//);
    });
  });
});
