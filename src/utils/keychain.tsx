import {CommentOptionsOperation} from '@hiveio/dhive';
import {Account, KeyTypes} from 'actions/interfaces';
import {MutableRefObject} from 'react';
import WebView from 'react-native-webview';
import {KeychainConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {
  HiveErrorMessage,
  KeychainRequest,
  KeychainRequestTypes,
  RequestAddAccountKeys,
  RequestDelegation,
  RequestError,
  RequestPost,
  RequestSuccess,
  RequestTransfer,
} from './keychain.types';

export const validateAuthority = (
  accounts: Account[],
  req: KeychainRequest,
) => {
  const {type, username} = req;
  if (type === KeychainRequestTypes.addAccount) return {valid: true};
  const wifType = getRequiredWifType(req);
  if (username) {
    const account = accounts.find((e) => e.name === username);
    if (!account) {
      return {
        valid: false,
        error: translate('request.error.no_account', {account: username}),
      };
    } else if (
      accounts.length > 1 &&
      !accounts.filter((e) => !!e.keys[wifType]).length
    ) {
      return {
        valid: false,
        error: translate('request.error.no_active_auth'),
      };
    } else if (!account.keys[wifType] && accounts.length === 1) {
      return {
        valid: false,
        error: translate('request.error.no_auth', {
          account: username,
          auth: wifType,
        }),
      };
    }
  } else if (KeychainConfig.NO_USERNAME_TYPES.includes(type)) {
    if (!accounts.filter((e) => !!e.keys[wifType]).length) {
      return {
        valid: false,
        error: translate('request.error.no_active_auth'),
      };
    }
  }
  return {valid: true};
};

export const getValidAuthorityAccounts = (
  accounts: Account[],
  wifType: KeyTypes,
) => {
  return accounts.filter((e) => !!e.keys[wifType]);
};

export const sendError = (
  tabRef: MutableRefObject<WebView>,
  error: RequestError,
) => {
  console.log('send error');
  tabRef.current.injectJavaScript(
    `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
      {success: false, result: null, ...error},
    )})`,
  );
};

export const sendResponse = (
  tabRef: MutableRefObject<WebView>,
  obj: RequestSuccess,
) => {
  obj.result.id = obj?.result?.tx_id;
  tabRef.current.injectJavaScript(
    `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
      {success: true, error: null, ...obj},
    )})`,
  );
};

export const validateRequest = (req: KeychainRequest) => {
  return (
    req &&
    req.type &&
    ((req.type === 'decode' &&
      isFilled(req.username) &&
      isFilled(req.message) &&
      req.message[0] === '#' &&
      isFilledKey(req.method)) ||
      (req.type === 'encode' &&
        isFilled(req.username) &&
        isFilled(req.receiver) &&
        isFilled(req.message) &&
        req.message[0] === '#' &&
        isFilledKey(req.method)) ||
      (req.type === 'signBuffer' &&
        isFilled(req.message) &&
        isFilledKey(req.method)) ||
      (req.type === 'vote' &&
        isFilled(req.username) &&
        isFilledWeight(req.weight) &&
        isFilled(req.permlink) &&
        isFilled(req.author)) ||
      (req.type === 'post' &&
        isFilled(req.username) &&
        isFilled(req.body) &&
        ((isFilled(req.title) &&
          isFilledOrEmpty(req.permlink) &&
          !isFilled(req.parent_username) &&
          isFilled(req.parent_perm) &&
          isFilled(req.json_metadata)) ||
          (!isFilled(req.title) &&
            isFilledOrEmpty(req.permlink) &&
            isFilled(req.parent_username) &&
            isFilled(req.parent_perm) &&
            isFilledOrEmpty(req.json_metadata))) &&
        isCustomOptions(req)) ||
      (req.type === 'custom' && isFilled(req.json) && isFilled(req.id)) ||
      (req.type === 'addAccountAuthority' &&
        isFilled(req.authorizedUsername) &&
        isFilled(req.role) &&
        isFilled(req.weight)) ||
      (req.type === 'removeAccountAuthority' &&
        isFilled(req.authorizedUsername) &&
        isFilled(req.role)) ||
      (req.type === 'addKeyAuthority' &&
        isFilled(req.authorizedKey) &&
        isFilled(req.role) &&
        isFilled(req.weight)) ||
      (req.type === 'removeKeyAuthority' &&
        isFilled(req.authorizedKey) &&
        isFilled(req.role)) ||
      (req.type === 'broadcast' &&
        isFilled(req.operations) &&
        isFilled(req.method)) ||
      (req.type === 'signTx' && isFilled(req.tx) && isFilled(req.method)) ||
      (req.type === 'signedCall' &&
        isFilled(req.method) &&
        isFilled(req.params) &&
        isFilled(req.typeWif)) ||
      (req.type === 'witnessVote' &&
        isFilled(req.witness) &&
        isBoolean(req.vote)) ||
      (req.type === 'proxy' && isFilledOrEmpty(req.proxy)) ||
      (req.type === 'delegation' &&
        isFilled(req.delegatee) &&
        isFilledAmtSP(req) &&
        isFilledDelegationMethod(req.unit)) ||
      (req.type === 'transfer' &&
        isFilledAmt(req.amount) &&
        isFilled(req.to) &&
        isFilledCurrency(req.currency) &&
        hasTransferInfo(req)) ||
      (req.type === 'sendToken' &&
        isFilledAmt(req.amount) &&
        isFilled(req.to) &&
        isFilled(req.currency)) ||
      (req.type === 'powerUp' &&
        isFilled(req.username) &&
        isFilledAmt(req.steem) &&
        isFilled(req.recipient)) ||
      (req.type === 'powerDown' &&
        isFilled(req.username) &&
        (isFilledAmt(req.steem_power) || req.steem_power === '0.000')) ||
      (req.type === 'createClaimedAccount' &&
        isFilled(req.username) &&
        isFilled(req.new_account) &&
        isFilled(req.owner) &&
        isFilled(req.active) &&
        isFilled(req.posting) &&
        isFilled(req.memo)) ||
      (req.type === 'createProposal' &&
        isFilled(req.username) &&
        isFilled(req.receiver) &&
        isFilledDate(req.start) &&
        isFilledDate(req.end) &&
        isFilled(req.subject) &&
        isFilled(req.permlink) &&
        isFilledAmtSBD(req.daily_pay)) ||
      (req.type === 'removeProposal' &&
        isFilled(req.username) &&
        isProposalIDs(req.proposal_ids)) ||
      (req.type === 'updateProposalVote' &&
        isFilled(req.username) &&
        isProposalIDs(req.proposal_ids) &&
        isBoolean(req.approve)) ||
      (req.type === 'sendToken' &&
        isFilledAmt(req.amount) &&
        isFilled(req.to) &&
        isFilled(req.currency)) ||
      (req.type === 'addAccount' && isFilledKeys(req.keys)) ||
      (req.type === 'convert' &&
        isFilled(req.username) &&
        isFilledAmt(req.amount) &&
        isBoolean(req.collaterized)) ||
      (req.type === 'recurrentTransfer' &&
        (isFilledAmt(req.amount) || parseFloat(req.amount) === 0) &&
        isFilledCurrency(req.currency) &&
        isFilled(req.to) &&
        Number.isInteger(req.executions) &&
        Number.isInteger(req.recurrence)))
  );
};

export const getRequiredWifType: (request: KeychainRequest) => KeyTypes = (
  request,
) => {
  switch (request.type) {
    case 'decode':
    case 'encode':
    case 'signBuffer':
    case 'broadcast':
    case 'addAccountAuthority':
    case 'removeAccountAuthority':
    case 'removeKeyAuthority':
    case 'addKeyAuthority':
    case 'signTx':
      return request.method.toLowerCase() as KeyTypes;
    case 'post':
    case 'vote':
      return KeyTypes.posting;
    case 'custom':
      return (!request.method
        ? 'posting'
        : request.method.toLowerCase()) as KeyTypes;
    case 'signedCall':
      return request.typeWif.toLowerCase() as KeyTypes;
    case 'transfer':
    case 'sendToken':
    case 'delegation':
    case 'witnessVote':
    case 'proxy':
    case 'powerUp':
    case 'powerDown':
    case 'createClaimedAccount':
    case 'createProposal':
    case 'removeProposal':
    case 'updateProposalVote':
    case 'convert':
    case 'recurrentTransfer':
      return KeyTypes.active;
  }
};

// Functions used to check the incoming data
const hasTransferInfo = (req: RequestTransfer) => {
  if (req.enforce) {
    return isFilled(req.username);
  } else if (isFilled(req.memo) && req.memo[0] === '#') {
    return isFilled(req.username);
  } else {
    return true;
  }
};

const isFilled = (obj: any) => {
  return !!obj && obj !== '';
};

const isBoolean = (obj: any) => {
  return typeof obj === typeof true;
};

const isFilledOrEmpty = (obj: string) => {
  return obj || obj === '';
};

const isProposalIDs = (obj: string) => {
  const parsed = JSON.parse(obj);
  return Array.isArray(parsed) && !parsed.some(isNaN);
};

const isFilledDelegationMethod = (obj: string) => {
  return obj === 'VESTS' || obj === 'HP';
};

const isFilledDate = (date: string) => {
  const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
  return regex.test(date);
};

const isFilledAmt = (obj: string) => {
  return (
    isFilled(obj) &&
    !isNaN(parseFloat(obj)) &&
    parseFloat(obj) > 0 &&
    countDecimals(obj) === 3
  );
};

const isFilledAmtSP = (obj: RequestDelegation) => {
  return (
    isFilled(obj.amount) &&
    !isNaN(parseFloat(obj.amount)) &&
    ((countDecimals(obj.amount) === 3 && obj.unit === 'HP') ||
      (countDecimals(obj.amount) === 6 && obj.unit === 'VESTS'))
  );
};

const isFilledAmtSBD = (amt: string) => {
  return (
    amt &&
    amt.split(' ').length === 2 &&
    !isNaN(parseFloat(amt.split(' ')[0])) &&
    countDecimals(amt.split(' ')[0]) === 3 &&
    amt.split(' ')[1] === 'HBD'
  );
};

const isFilledWeight = (obj: string | number) => {
  return (
    isFilled(obj) &&
    !isNaN(+obj) &&
    +obj >= -10000 &&
    +obj <= 10000 &&
    +obj === Math.floor(+obj)
  );
};

const isFilledCurrency = (obj: string) => {
  return isFilled(obj) && (obj === 'HIVE' || obj === 'HBD');
};

const isFilledKey = (obj: string) => {
  return (
    isFilled(obj) && (obj === 'Memo' || obj === 'Active' || obj === 'Posting')
  );
};

const isFilledKeys = (obj: RequestAddAccountKeys) => {
  if (typeof obj !== 'object') {
    return false;
  }
  const keys = Object.keys(obj);
  if (!keys.length) {
    return false;
  }
  if (
    keys.includes('posting') ||
    keys.includes('active') ||
    keys.includes('memo')
  ) {
    return true;
  }
};

const isCustomOptions = (obj: RequestPost) => {
  if (obj.comment_options === '') {
    return true;
  }
  let comment_options: CommentOptionsOperation[1] = JSON.parse(
    obj.comment_options,
  );
  if (
    comment_options.author !== obj.username ||
    comment_options.permlink !== obj.permlink
  ) {
    return false;
  }
  return (
    comment_options.hasOwnProperty('max_accepted_payout') &&
    (comment_options.hasOwnProperty('percent_steem_dollars') ||
      comment_options.hasOwnProperty('percent_hbd')) &&
    comment_options.hasOwnProperty('allow_votes') &&
    comment_options.hasOwnProperty('allow_curation_rewards') &&
    comment_options.hasOwnProperty('extensions')
  );
};

const countDecimals = (nb: string) => {
  return nb.toString().split('.')[1] === undefined
    ? 0
    : nb.toString().split('.')[1].length || 0;
};

export const beautifyErrorMessage = (err: HiveErrorMessage) => {
  if (!err) {
    return null;
  }
  let error = '';
  if (err.message.indexOf('xception:') !== -1) {
    error = err.message.split('xception:').pop().replace('.rethrow', '.');
  } else if (err.message.indexOf(':') !== -1) {
    error = err.message.split(':').pop();
  } else {
    error = err.message;
  }
  if (error.replace(' ', '') === '') {
    return translate('request.error.unknown');
  }
  return `${translate('request.error.ops')} : ${error}`;
};

export const sleep = (ms: number) => {
  //sleep
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
