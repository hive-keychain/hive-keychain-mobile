import {Delegator} from 'actions/interfaces';
import api from 'api/keychain';
//TODO Implementation based on end point request.
export default {
  get: (response: {data: {rpc: string}}, error?: any) => {
    if (error) {
      api.get = jest.fn().mockRejectedValue(error);
    } else {
      api.get = jest.fn().mockResolvedValue(response);
    }
  },
  getDelegators: (response: {data: Delegator[]}, error?: boolean) => {
    if (error) {
      api.get = jest.fn().mockRejectedValue(error);
    } else {
      api.get = jest.fn().mockResolvedValue(response);
    }
  },
};
