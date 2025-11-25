import api from '../keychain.api';

describe('keychain.api', () => {
  it('should create axios instance with correct baseURL', () => {
    expect(api.defaults.baseURL).toBe('https://api.hive-keychain.com/');
  });

  it('should have axios instance methods', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
  });
});
