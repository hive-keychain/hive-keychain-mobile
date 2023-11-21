const SSC = require('sscjs');
import axios from 'axios';
import {TokenRequestParams} from 'src/interfaces/token-request-params.interface';

export default new SSC('https://engine.rishipanthee.com');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://history.hive-engine.com/',
});

let rpc = 'https://engine.rishipanthee.com';

const getHiveEngineApi = () => {
  return rpc;
};

export const hiveEngineGet = async <T>(
  params: TokenRequestParams,
): Promise<T> => {
  const url = `${getHiveEngineApi()}/contracts`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'find',
        params,
        id: 1,
      }),
      headers: {'Content-Type': 'application/json'},
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((res: any) => {
        resolve((res.result as unknown) as T);
      })
      .catch((e: any) => reject({e}));
  });
};
