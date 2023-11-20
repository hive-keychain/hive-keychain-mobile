const SSC = require('sscjs');
import axios from 'axios';
import {TokenRequestParams} from 'src/interfaces/token-request-params.interface';

export default new SSC('https://engine.rishipanthee.com');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://history.hive-engine.com/',
});

//TODO new additions to discuss with quentin

let rpc = 'https://api.hive-engine.com/rpc';
const getHiveEngineApi = () => {
  return rpc;
};

export const hiveEngineGet = async <T>(
  params: TokenRequestParams,
  timeout: number = 10,
): Promise<T> => {
  const url = `${getHiveEngineApi()}/contracts`;
  return new Promise((resolve, reject) => {
    let resolved = false;
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
          resolved = true;
          return res.json();
        }
      })
      .then((res: any) => {
        resolve((res.result as unknown) as T);
      });

    setTimeout(() => {
      if (!resolved) {
        reject(new Error('get HE Error'));
      }
    }, timeout * 1000);
  });
};
