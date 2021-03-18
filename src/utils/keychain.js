import {KeychainConfig} from 'utils/config';

export const validateAuthority = (accounts, req) => {
  const {type, username} = req;
  const wifType = getRequiredWifType(req);
  if (username) {
    const account = accounts.find((e) => e.name === username);
    if (!account || !account.keys[wifType]) {
      return false;
    }
  } else if (KeychainConfig.NO_USERNAME_TYPES.includes(type)) {
    if (!accounts.filter((e) => !!e.keys[wifType]).length) {
      return false;
    }
  }
  return true;
};

export const sendError = (tabRef, error) => {
  console.log(tabRef, error);
  tabRef.current.injectJavaScript(
    `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
      {success: false, result: null, ...error},
    )})`,
  );
};

export const sendResponse = (tabRef, obj) => {
  tabRef.current.injectJavaScript(
    `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
      {success: true, error: null, ...obj},
    )})`,
  );
};

export const validateRequest = (req) => {
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
      (req.type === 'addAccount' && isFilledKeys(req.keys)))
  );
};

const getRequiredWifType = (request) => {
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
      return request.method.toLowerCase();
    case 'post':
    case 'vote':
      return 'posting';
    case 'custom':
      return !request.method ? 'posting' : request.method.toLowerCase();
    case 'signedCall':
      return request.typeWif.toLowerCase();
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
      return 'active';
  }
};

// Functions used to check the incoming data
const hasTransferInfo = (req) => {
  if (req.enforce) {
    return isFilled(req.username);
  } else if (isFilled(req.memo) && req.memo[0] === '#') {
    return isFilled(req.username);
  } else {
    return true;
  }
};

const isFilled = (obj) => {
  return !!obj && obj !== '';
};

const isBoolean = (obj) => {
  return typeof obj === typeof true;
};

const isFilledOrEmpty = (obj) => {
  return obj || obj === '';
};

const isProposalIDs = (obj) => {
  const parsed = JSON.parse(obj);
  return Array.isArray(parsed) && !parsed.some(isNaN);
};

const isFilledDelegationMethod = (obj) => {
  return obj === 'VESTS' || obj === 'HP';
};

const isFilledDate = (date) => {
  const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
  return regex.test(date);
};

const isFilledAmt = (obj) => {
  return isFilled(obj) && !isNaN(obj) && obj > 0 && countDecimals(obj) === 3;
};

const isFilledAmtSP = (obj) => {
  return (
    isFilled(obj.amount) &&
    !isNaN(obj.amount) &&
    ((countDecimals(obj.amount) === 3 && obj.unit === 'HP') ||
      (countDecimals(obj.amount) === 6 && obj.unit === 'VESTS'))
  );
};

const isFilledAmtSBD = (amt) => {
  return (
    amt &&
    amt.split(' ').length === 2 &&
    !isNaN(amt.split(' ')[0]) &&
    parseFloat(countDecimals(amt.split(' ')[0])) === 3 &&
    amt.split(' ')[1] === 'HBD'
  );
};

const isFilledWeight = (obj) => {
  return (
    isFilled(obj) &&
    !isNaN(obj) &&
    obj >= -10000 &&
    obj <= 10000 &&
    countDecimals(obj) === 0
  );
};

const isFilledCurrency = (obj) => {
  return isFilled(obj) && (obj === 'HIVE' || obj === 'HBD');
};

const isFilledKey = (obj) => {
  return (
    isFilled(obj) && (obj === 'Memo' || obj === 'Active' || obj === 'Posting')
  );
};

const isFilledKeys = (obj) => {
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

const isCustomOptions = (obj) => {
  if (obj.comment_options === '') {
    return true;
  }
  let comment_options = JSON.parse(obj.comment_options);
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

const countDecimals = (nb) => {
  return nb.toString().split('.')[1] === undefined
    ? 0
    : nb.toString().split('.')[1].length || 0;
};
