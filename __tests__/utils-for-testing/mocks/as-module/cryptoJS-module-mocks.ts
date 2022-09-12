import Crypto from 'crypto-js';

export default {
  AES: {
    encrypt: (value: string) =>
      (Crypto.AES.encrypt = jest.fn().mockReturnValue(value)),
    decrypt: (value: string) =>
      (Crypto.AES.decrypt = jest.fn().mockReturnValue(value)),
  },
};
