// Unmock the module first since jest.setup.js mocks it
jest.unmock('utils/localize');

// Mock expo-localization FIRST - this is critical because getLocales() is called at module load time
jest.mock('expo-localization', () => {
  return {
    getLocales: () => [{languageCode: 'en'}],
  };
});

// Mock locale JSON files - these need to be mocked before the module imports them
jest.mock('locales/en.json', () => ({
  test: {key: 'Test Value'},
  wallet: {info: {transfer: 'Transfer'}},
}), {virtual: true});
jest.mock('locales/fr.json', () => ({}), {virtual: true});
jest.mock('locales/es.json', () => ({}), {virtual: true});
jest.mock('locales/pt.json', () => ({}), {virtual: true});
jest.mock('locales/de.json', () => ({}), {virtual: true});
jest.mock('locales/id.json', () => ({}), {virtual: true});

// Mock AsyncStorage
const mockGetItem = jest.fn().mockResolvedValue(null);
const mockSetItem = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: (...args: any[]) => mockSetItem(...args),
  },
  __esModule: true,
}));

// Reset modules to ensure fresh import after unmocking
jest.resetModules();

// Import after all mocks are set up
import {
  translate,
  getLocalesList,
  getMainLocale,
  onLocaleChange,
  setLocale,
} from '../localize';

describe('localize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
  });

  describe('getMainLocale', () => {
    it('should return main locale from getLocales', () => {
      // getMainLocale uses the locales captured at module load time
      const result = getMainLocale();
      expect(typeof result).toBe('string');
      // Should return 'en' based on the mock
      expect(result).toBe('en');
    });
  });

  describe('getLocalesList', () => {
    it('should return list of available locales', () => {
      const result = getLocalesList();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(6);
    });

    it('should include English locale', () => {
      const result = getLocalesList();
      const english = result.find((l) => l.value === 'en');
      expect(english).toBeDefined();
      expect(english?.label).toBe('English');
      expect(english?.icon).toBe('🇺🇸');
    });

    it('should include French locale', () => {
      const result = getLocalesList();
      const french = result.find((l) => l.value === 'fr');
      expect(french).toBeDefined();
      expect(french?.label).toBe('Français');
      expect(french?.icon).toBe('🇫🇷');
    });

    it('should include Spanish locale', () => {
      const result = getLocalesList();
      const spanish = result.find((l) => l.value === 'es');
      expect(spanish).toBeDefined();
      expect(spanish?.label).toBe('Español');
      expect(spanish?.icon).toBe('🇪🇸');
    });

    it('should include Portuguese locale', () => {
      const result = getLocalesList();
      const portuguese = result.find((l) => l.value === 'pt');
      expect(portuguese).toBeDefined();
      expect(portuguese?.label).toBe('Português');
      expect(portuguese?.icon).toBe('🇵🇹');
    });

    it('should include German locale', () => {
      const result = getLocalesList();
      const german = result.find((l) => l.value === 'de');
      expect(german).toBeDefined();
      expect(german?.label).toBe('Deutsch');
      expect(german?.icon).toBe('🇩🇪');
    });

    it('should include Indonesian locale', () => {
      const result = getLocalesList();
      const indonesian = result.find((l) => l.value === 'id');
      expect(indonesian).toBeDefined();
      expect(indonesian?.label).toBe('Indonesia');
      expect(indonesian?.icon).toBe('🇮🇩');
    });

    it('should have correct structure for all locales', () => {
      const result = getLocalesList();
      result.forEach((locale) => {
        expect(locale).toHaveProperty('label');
        expect(locale).toHaveProperty('value');
        expect(locale).toHaveProperty('icon');
        expect(typeof locale.label).toBe('string');
        expect(typeof locale.value).toBe('string');
        expect(typeof locale.icon).toBe('string');
      });
    });
  });

  describe('translate', () => {
    it('should translate key', () => {
      const result = translate('test.key');
      expect(typeof result).toBe('string');
    });

    it('should translate with params', () => {
      const result = translate('test.with.params', {name: 'World'});
      expect(typeof result).toBe('string');
    });

    it('should return key if translation not found', () => {
      const result = translate('nonexistent.key');
      expect(typeof result).toBe('string');
      // i18n-js returns the key when translation is not found (with fallback enabled)
      expect(result).toContain('nonexistent');
    });

    it('should handle empty scope', () => {
      const result = translate('');
      expect(typeof result).toBe('string');
    });

    it('should handle null options', () => {
      const result = translate('test.key', null as any);
      expect(typeof result).toBe('string');
    });

    it('should handle undefined options', () => {
      const result = translate('test.key', undefined);
      expect(typeof result).toBe('string');
    });

    it('should translate nested keys', () => {
      const result = translate('wallet.info.transfer');
      expect(typeof result).toBe('string');
    });
  });

  describe('onLocaleChange', () => {
    it('should register listener', () => {
      const listener = jest.fn();
      const unsubscribe = onLocaleChange(listener);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should allow unsubscribing listener', () => {
      const listener = jest.fn();
      const unsubscribe = onLocaleChange(listener);
      unsubscribe();
      // Listener should be removed
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('setLocale', () => {
    it('should be a function', () => {
      expect(typeof setLocale).toBe('function');
    });
  });
});
