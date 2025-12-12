import {setToggleElement, getToggleElement} from '../toggle';

describe('toggle hook', () => {
  beforeEach(() => {
    // Reset toggle element before each test
    setToggleElement('');
  });

  describe('setToggleElement', () => {
    it('should set toggle element', () => {
      setToggleElement('test');
      expect(getToggleElement()).toBe('test');
    });
  });

  describe('getToggleElement', () => {
    it('should return null when no element is set', () => {
      expect(getToggleElement()).toBeNull();
    });

    it('should return element when set', () => {
      setToggleElement('testElement');
      expect(getToggleElement()).toBe('testElement');
    });

    it('should replace Primary with WalletScreen', () => {
      setToggleElement('Primary');
      expect(getToggleElement()).toBe('WalletScreen');
    });

    it('should replace Tokens with EngineWalletScreen', () => {
      setToggleElement('Tokens');
      expect(getToggleElement()).toBe('EngineWalletScreen');
    });

    it('should handle multiple replacements', () => {
      setToggleElement('PrimaryTokens');
      expect(getToggleElement()).toBe('WalletScreenEngineWalletScreen');
    });
  });
});
















