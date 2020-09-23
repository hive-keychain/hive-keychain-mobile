var hive = require('@hivechain/dhive');
// import 'utils/decode.min.js';
// hive.decodeMemo = window.decodeMemo;
// hive.encodeMemo = window.encodeMemo;
export default hive;
export const client = new hive.Client('https://anyx.io');
