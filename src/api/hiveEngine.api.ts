const SSC = require('sscjs');
import axios from 'axios';
import {TokenRequestParams} from 'src/interfaces/tokenRequestParams.interface';
import {HiveEngineConfigUtils} from 'utils/hiveEngineConfig.utils';

const getSSC = () => {
  const baseURL = HiveEngineConfigUtils.getApi();
  // console.log('baseURL', baseURL);
  return new SSC(baseURL);
};

const getHistoryApi = () => {
  const baseURL = HiveEngineConfigUtils.getAccountHistoryApi();
  // console.log('baseURL', baseURL);
  return axios.create({
    baseURL: baseURL,
  });
};

const get = async <T>(params: TokenRequestParams): Promise<T> => {
  const baseURL = HiveEngineConfigUtils.getApi();
  // console.log('baseURL', baseURL);
  const url = `${baseURL}/contracts`;
  return new Promise((resolve, reject) => {
    let start = Date.now();
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);
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
        if (!res) {
          throw new Error('No response from Hive Engine API');
        }
        if (res.status !== 200) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((res: any) => {
        clearTimeout(id);
        if (!res || typeof res.result === 'undefined') {
          reject(new Error('Invalid response: missing result'));
          return;
        }
        resolve(res.result as unknown as T);
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
          console.log('HE Node Timeout', HiveEngineConfigUtils.getApi());
          reject(new Error('tokens timeout'));
        } else {
          reject(reason);
        }
      });
  });
};

export const HiveEngineApi = {
  get,
  getHistoryApi,
  getSSC,
};
