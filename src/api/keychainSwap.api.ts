import {SwapsConfig} from 'utils/config.utils';
import {BaseApi} from './base.api';

const buildUrl = (url: string) => {
  const baseURL = SwapsConfig.baseURL;
  return `${baseURL}/${url}`;
};

const get = async (url: string): Promise<any> => {
  try {
    return await BaseApi.get(buildUrl(url));
  } catch (err) {
    if (
      err.message === 'Failed to fetch' ||
      err.message === 'Network request failed'
    ) {
      throw {
        code: 500,
        message: err.message,
        reason: {
          template: 'swap_server_unavailable',
        },
      };
    }
  }
};

const post = async (url: string, body: any): Promise<any> => {
  try {
    return await BaseApi.post(buildUrl(url), body);
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw {
        code: 500,
        message: err.message,
        reason: {
          template: 'swap_server_unavailable',
        },
      };
    }
  }
};

export const KeychainSwapApi = {
  get,
  post,
};
