const SSC = require('sscjs');
import axios from 'axios';
import {TokenRequestParams} from 'src/interfaces/token-request-params.interface';
import {HiveEngineConfigUtils} from 'utils/hive-engine-config.utils';

export default new SSC('https://engine.rishipanthee.com');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://history.hive-engine.com/',
});

export const hiveEngineGet = async <T>(
  params: TokenRequestParams,
): Promise<T> => {
  const url = `${HiveEngineConfigUtils.getApi()}/contracts`;
  return new Promise((resolve, reject) => {
    let start = Date.now();
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 60000);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'find',
        params,
        id: 1,
      }),
      headers: {'Content-Type': 'application/json'},
      signal: controller.signal,
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((res: any) => {
        clearTimeout(id);
        resolve((res.result as unknown) as T);
        // console.log(`hiveEngineGet Resolved after: ${Date.now() - start} ms`);
      })
      .catch((reason: any) => {
        console.log(`hiveEngineGet Aborted after: ${Date.now() - start} ms`);
        console.log({reason, m: reason.message});
        clearTimeout(id);
        if (
          reason.name === 'AbortError' ||
          (reason.message && reason.message.includes('Network request failed'))
        ) {
          console.log('HE Node Timeout');
          reject(new Error('tokens timeout'));
        }
      });
  });
};
