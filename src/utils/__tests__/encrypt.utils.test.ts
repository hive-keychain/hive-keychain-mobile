import {encryptJson, decryptToJson} from '../encrypt.utils';

jest.mock('crypto-es', () => ({
  lib: {
    WordArray: {
      random: jest.fn(() => ({
        toString: jest.fn(() => '0123456789abcdef0123456789abcdef'),
      })),
    },
  },
  enc: {
    Utf8: 'utf8',
    Hex: {
      parse: jest.fn((str) => str),
    },
  },
  algo: {
    SHA256: 'sha256',
    SHA1: 'sha1',
  },
  pad: {
    Pkcs7: 'pkcs7',
  },
  mode: {
    CBC: 'cbc',
  },
  PBKDF2: jest.fn(() => 'mockKey'),
  AES: {
    encrypt: jest.fn(() => ({
      toString: jest.fn(() => 'encryptedData'),
    })),
    decrypt: jest.fn(() => ({
      toString: jest.fn(() => JSON.stringify({hash: 'mockhash', list: [1, 2, 3]})),
    })),
  },
}));

jest.mock('md5', () => jest.fn((data) => 'mockhash'));

describe('encrypt.utils', () => {
  describe('encryptJson', () => {
    it('should encrypt JSON with hash', () => {
      const json = {list: [1, 2, 3]};
      const result = encryptJson(json, 'password');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('decryptToJson', () => {
    it('should decrypt JSON and verify hash', () => {
      const encrypted = 'mockEncryptedData';
      const result = decryptToJson(encrypted, 'password');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('list');
    });

    it('should return null if hash mismatch', () => {
      const CryptoJS = require('crypto-es');
      CryptoJS.AES.decrypt = jest.fn(() => ({
        toString: jest.fn(() => JSON.stringify({hash: 'wronghash', list: [1, 2, 3]})),
      }));
      const encrypted = 'mockEncryptedData';
      const result = decryptToJson(encrypted, 'password');
      expect(result).toBeNull();
    });
  });
});
