const SSC = require('sscjs');
import axios from 'axios';

export default new SSC('https://engine.rishipanthee.com');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://history.hive-engine.com/',
});
