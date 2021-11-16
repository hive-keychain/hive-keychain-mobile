const SSC = require('sscjs');
import axios from 'axios';

export default new SSC('https://api.hive-engine.com/rpc');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://history.hive-engine.com/',
});
