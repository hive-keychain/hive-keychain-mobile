import {CommentOptionsOperation} from '@hiveio/dhive';
import {KeychainConfig} from 'utils/config.utils';
import {
  KeychainRequest,
  KeychainRequestTypes,
  RequestAddAccountKeys,
  RequestDelegation,
  RequestPost,
  RequestTransfer,
} from '../interfaces/keychain.interface';

const isFilled = (obj: unknown) => !!obj && obj !== '';

const isBoolean = (obj: unknown) => typeof obj === typeof true;

const isFilledOrEmpty = (obj: string) => obj || obj === '';

const countDecimals = (nb: string) =>
  nb.toString().split('.')[1] === undefined
    ? 0
    : nb.toString().split('.')[1].length || 0;

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const isProposalIDs = (obj: string) => {
  const parsed = safeJsonParse<unknown[]>(obj);
  return Array.isArray(parsed) && !parsed.some(isNaN);
};

const isFilledDelegationMethod = (obj: string) =>
  obj === 'VESTS' || obj === 'HP';

const isFilledDate = (date: string) => {
  const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
  return regex.test(date);
};

const isFilledAmt = (obj: string, enforceDecimals = true) =>
  isFilled(obj) &&
  !isNaN(parseFloat(obj)) &&
  parseFloat(obj) > 0 &&
  (!enforceDecimals || countDecimals(obj) === 3);

const isFilledAmtSP = (obj: RequestDelegation) =>
  isFilled(obj.amount) &&
  !isNaN(parseFloat(obj.amount)) &&
  ((countDecimals(obj.amount) === 3 && obj.unit === 'HP') ||
    (countDecimals(obj.amount) === 6 && obj.unit === 'VESTS'));

const isFilledAmtSBD = (amt: string) =>
  !!amt &&
  amt.split(' ').length === 2 &&
  !isNaN(parseFloat(amt.split(' ')[0])) &&
  countDecimals(amt.split(' ')[0]) === 3 &&
  amt.split(' ')[1] === 'HBD';

const isFilledWeight = (obj: string | number) =>
  isFilled(obj) &&
  !isNaN(+obj) &&
  +obj >= -10000 &&
  +obj <= 10000 &&
  +obj === Math.floor(+obj);

const isFilledCurrency = (obj: string) =>
  isFilled(obj) && (obj === 'HIVE' || obj === 'HBD');

const isFilledSavingsOperation = (obj: string) =>
  obj === 'deposit' || obj === 'withdraw';

const isFilledKey = (obj: string) =>
  isFilled(obj) && (obj === 'Memo' || obj === 'Active' || obj === 'Posting');

const isFilledKeys = (obj: RequestAddAccountKeys) => {
  if (typeof obj !== 'object') {
    return false;
  }
  const keys = Object.keys(obj);
  if (!keys.length) {
    return false;
  }
  return (
    keys.includes('posting') ||
    keys.includes('active') ||
    keys.includes('memo')
  );
};

const hasTransferInfo = (req: RequestTransfer) => {
  if (req.enforce) {
    return isFilled(req.username);
  }
  if (isFilled(req.memo) && req.memo[0] === '#') {
    return isFilled(req.username);
  }
  return true;
};

const isCustomOptions = (obj: RequestPost) => {
  if (obj.comment_options === '') {
    return true;
  }
  const comment_options = safeJsonParse<CommentOptionsOperation[1]>(
    obj.comment_options,
  );
  if (!comment_options) {
    return false;
  }
  if (
    comment_options.author !== obj.username ||
    comment_options.permlink !== obj.permlink
  ) {
    return false;
  }
  return (
    Object.prototype.hasOwnProperty.call(
      comment_options,
      'max_accepted_payout',
    ) &&
    (Object.prototype.hasOwnProperty.call(
      comment_options,
      'percent_steem_dollars',
    ) ||
      Object.prototype.hasOwnProperty.call(comment_options, 'percent_hbd')) &&
    Object.prototype.hasOwnProperty.call(comment_options, 'allow_votes') &&
    Object.prototype.hasOwnProperty.call(
      comment_options,
      'allow_curation_rewards',
    ) &&
    Object.prototype.hasOwnProperty.call(comment_options, 'extensions')
  );
};

const requestValidators: Partial<
  Record<KeychainRequestTypes, (req: KeychainRequest) => boolean>
> = {
  [KeychainRequestTypes.decode]: (req) =>
    isFilled(req.username) &&
    isFilled(req.message) &&
    req.message[0] === '#' &&
    isFilledKey(req.method),
  [KeychainRequestTypes.encode]: (req) =>
    isFilled(req.username) &&
    isFilled(req.receiver) &&
    isFilled(req.message) &&
    req.message[0] === '#' &&
    isFilledKey(req.method),
  [KeychainRequestTypes.signBuffer]: (req) =>
    isFilled(req.message) && isFilledKey(req.method),
  [KeychainRequestTypes.vote]: (req) =>
    (isFilled(req.username) ||
      KeychainConfig.ANONYMOUS_REQUESTS.includes(req.type)) &&
    isFilledWeight(req.weight) &&
    isFilled(req.permlink) &&
    isFilled(req.author),
  [KeychainRequestTypes.post]: (req) =>
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
    isCustomOptions(req),
  [KeychainRequestTypes.custom]: (req) =>
    isFilled(req.json) && isFilled(req.id),
  [KeychainRequestTypes.addAccountAuthority]: (req) =>
    isFilled(req.authorizedUsername) &&
    isFilled(req.role) &&
    isFilled(req.weight),
  [KeychainRequestTypes.removeAccountAuthority]: (req) =>
    isFilled(req.authorizedUsername) && isFilled(req.role),
  [KeychainRequestTypes.addKeyAuthority]: (req) =>
    isFilled(req.authorizedKey) &&
    isFilled(req.role) &&
    isFilled(req.weight),
  [KeychainRequestTypes.removeKeyAuthority]: (req) =>
    isFilled(req.authorizedKey) && isFilled(req.role),
  [KeychainRequestTypes.broadcast]: (req) =>
    isFilled(req.operations) && isFilled(req.method),
  [KeychainRequestTypes.signTx]: (req) =>
    isFilled(req.tx) && isFilled(req.method),
  [KeychainRequestTypes.signedCall]: (req) =>
    isFilled(req.method) && isFilled(req.params) && isFilled(req.typeWif),
  [KeychainRequestTypes.witnessVote]: (req) =>
    isFilled(req.witness) && isBoolean(req.vote),
  [KeychainRequestTypes.proxy]: (req) => isFilledOrEmpty(req.proxy),
  [KeychainRequestTypes.delegation]: (req) =>
    isFilled(req.delegatee) &&
    isFilledAmtSP(req) &&
    isFilledDelegationMethod(req.unit),
  [KeychainRequestTypes.transfer]: (req) =>
    isFilledAmt(req.amount) &&
    isFilled(req.to) &&
    isFilledCurrency(req.currency) &&
    hasTransferInfo(req),
  [KeychainRequestTypes.savings]: (req) =>
    isFilledAmt(req.amount) &&
    isFilled(req.to) &&
    isFilledCurrency(req.currency) &&
    isFilledSavingsOperation(req.operation),
  [KeychainRequestTypes.sendToken]: (req) =>
    isFilledAmt(req.amount, false) &&
    isFilled(req.to) &&
    isFilled(req.currency),
  [KeychainRequestTypes.powerUp]: (req) =>
    (isFilled(req.username) ||
      KeychainConfig.ANONYMOUS_REQUESTS.includes(req.type)) &&
    isFilledAmt(req.steem) &&
    isFilled(req.recipient),
  [KeychainRequestTypes.powerDown]: (req) =>
    isFilled(req.username) &&
    (isFilledAmt(req.steem_power) || req.steem_power === '0.000'),
  [KeychainRequestTypes.createClaimedAccount]: (req) =>
    isFilled(req.username) &&
    isFilled(req.new_account) &&
    isFilled(req.owner) &&
    isFilled(req.active) &&
    isFilled(req.posting) &&
    isFilled(req.memo),
  [KeychainRequestTypes.createProposal]: (req) =>
    isFilled(req.username) &&
    isFilled(req.receiver) &&
    isFilledDate(req.start) &&
    isFilledDate(req.end) &&
    isFilled(req.subject) &&
    isFilled(req.permlink) &&
    isFilledAmtSBD(req.daily_pay),
  [KeychainRequestTypes.removeProposal]: (req) =>
    isFilled(req.username) && isProposalIDs(req.proposal_ids),
  [KeychainRequestTypes.updateProposalVote]: (req) =>
    (isFilled(req.username) ||
      KeychainConfig.ANONYMOUS_REQUESTS.includes(req.type)) &&
    isProposalIDs(req.proposal_ids) &&
    isBoolean(req.approve),
  [KeychainRequestTypes.addAccount]: (req) => isFilledKeys(req.keys),
  [KeychainRequestTypes.convert]: (req) =>
    (isFilled(req.username) ||
      KeychainConfig.ANONYMOUS_REQUESTS.includes(req.type)) &&
    isFilledAmt(req.amount) &&
    isBoolean(req.collaterized),
  [KeychainRequestTypes.recurrentTransfer]: (req) =>
    (isFilledAmt(req.amount) || parseFloat(req.amount) === 0) &&
    isFilledCurrency(req.currency) &&
    isFilled(req.to) &&
    Number.isInteger(req.executions) &&
    Number.isInteger(req.recurrence),
  [KeychainRequestTypes.swap]: (req) =>
    isFilledAmt(req.amount.toString(), false) &&
    isFilled(req.startToken) &&
    isFilled(req.endToken),
};

export const validateKeychainRequest = (req: KeychainRequest) => {
  if (!req?.type) {
    return false;
  }
  return requestValidators[req.type]?.(req) ?? false;
};
