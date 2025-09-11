import {PeakdNotificationsConfig} from 'utils/config.utils';
import {BaseApi} from './base';

const buildUrl = (url: string) => {
  return `${PeakdNotificationsConfig.baseURL}/${url}`;
};

const get = async (url: string): Promise<any> => {
  return await BaseApi.get(buildUrl(url));
};

const post = async (url: string, body: any): Promise<any> => {
  return await BaseApi.post(buildUrl(url), body);
};

export const PeakDNotificationsApi = {
  get,
  post,
};
