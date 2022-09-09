import Crypto from 'crypto-js';

export default {
    AES: {
        encrypt: (value: string) => Crypto.AES.encrypt = jest.fn().mockReturnValue(value),
    },
};