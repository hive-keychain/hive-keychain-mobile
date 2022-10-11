import {Account, AccountKeys} from 'actions/interfaces';
require('dotenv').config();

const _default = {
  name: process.env._TEST_USERNAME || 'error, please check',
  keys: {
    active: process.env._TEST_ACTIVE || 'error, please check',
    posting: process.env._TEST_POSTING || 'error, please check',
    memo: process.env._TEST_MEMO || 'error, please check',
    activePubkey: process.env._TEST_ACTIVE_PUB || 'error, please check',
    postingPubkey: process.env._TEST_POSTING_PUB || 'error, please check',
    memoPubkey: process.env._TEST_MEMO_PUB || 'error, please check',
  } as AccountKeys,
} as Account;

const otherKeys = {
  ownerPubkey: process.env._TEST_OWNER_PUB || 'error, please check',
  owner: process.env._TEST_OWNER || 'error, please check',
  master: process.env._TEST_MASTER || 'error, please check',
  fakeKey: '5Jq1oDi61PWMq7DNeJWQUVZV3v85QVFMN9ro3Dnmi1DySjgU1v9',
  randomStringKey51: 'MknOPyeXr5CGsCgvDewdny55MREtDpAjhkT9OsPPLCujYD82Urk',
};

export default {
  _default,
  otherKeys,
};
