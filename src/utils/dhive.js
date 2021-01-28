let hive = require('@hiveio/dhive');
// import 'utils/decode.min.js';
// hive.decodeMemo = window.decodeMemo;
// hive.encodeMemo = window.encodeMemo;
let client = new hive.Client('https://api.hive.blog');
export const setRpc = (rpc) => {
  client = new hive.Client(rpc);
};
export const getClient = () => client;
export default hive;
