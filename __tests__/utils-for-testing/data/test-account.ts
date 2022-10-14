import {AuthorityType, ExtendedAccount} from '@hiveio/dhive';
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

const extended = {
  name: _default.name,
  reputation: 100,
  reward_hbd_balance: '100 HBD',
  reward_hive_balance: '100 HIVE',
  reward_vesting_balance: '1000 VESTS',
  delegated_vesting_shares: '100 VESTS',
  received_vesting_shares: '20000 VESTS',
  balance: '1000 HIVE',
  hbd_balance: '1000 HBD',
  savings_balance: '10000 HBD',
  savings_hbd_balance: '10000 HBD',
  vesting_shares: '1000000000 VESTS',
  proxy: '',
  witness_votes: ['aggroed', 'blocktrades'],
  posting: {
    weight_threshold: 1,
    account_auths: [['theghost1980', 1]],
    key_auths: [[_default.keys.postingPubkey, 1]],
  } as AuthorityType,
  active: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[_default.keys.activePubkey, 1]],
  } as AuthorityType,
  owner: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [],
  } as AuthorityType,
  memo_key: _default.keys.memoPubkey,
  witnesses_voted_for: 2,
  voting_manabar: {
    current_mana: 1000000000,
    last_update_time: 100,
  },
  vesting_withdraw_rate: '0.000 VESTS',
} as ExtendedAccount;

export default {
  _default,
  otherKeys,
  extended,
};
