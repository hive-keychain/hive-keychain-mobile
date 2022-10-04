import api from 'api/keychain';

export default {
  get: (response: {data: {rpc: string}}, error?: any) => {
    if (error) {
      api.get = jest.fn().mockRejectedValue(error);
    } else {
      api.get = jest.fn().mockResolvedValue(response);
    }
  },
};
