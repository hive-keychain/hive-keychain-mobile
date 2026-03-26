import {Account, KeyTypes} from 'actions/interfaces';
import {MutableRefObject} from 'react';
import WebView from 'react-native-webview';
import {KeychainConfig} from 'utils/config.utils';
import {validateKeychainRequest} from 'utils/keychainRequestValidators.utils';
import {translate} from 'utils/localize';
import {
  HiveErrorMessage,
  KeychainRequest,
  KeychainRequestTypes,
  RequestError,
  RequestSuccess,
} from '../interfaces/keychain.interface';

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
    }
    if (!account.keys[wifType]) {
      return {
        valid: false,
        error: translate('request.error.no_required_auth', {
          account: username,
          required_auth: wifType,
        }),
      };
    }
  } else if (KeychainConfig.ANONYMOUS_REQUESTS.includes(type)) {
    if (!accounts.filter((e) => !!e.keys[wifType]).length) {
      return {
        valid: false,
        error: translate('request.error.no_required_auth_anonymous', {
          required_auth: wifType,
        }),
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

export const getRequestTitle = (request: KeychainRequest) => {
  if ('title' in request && request.title.toLowerCase() !== 'title')
    return request.title;
  return request.type
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
};

export const sendError = (
  tabRef: MutableRefObject<WebView>,
  error: RequestError,
) => {
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
  if (obj.result?.tx_id) {
    obj.result.id = obj?.result?.tx_id;
  }
  tabRef.current.injectJavaScript(
    `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
      {success: true, error: null, ...obj},
    )})`,
  );
};

export const validateRequest = (req: KeychainRequest) => {
  return validateKeychainRequest(req);
};

export const getRequiredWifType: (
  request: Partial<KeychainRequest>,
) => KeyTypes = (request) => {
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
      return (
        !request.method ? 'posting' : request.method.toLowerCase()
      ) as KeyTypes;
    case 'signedCall':
      return request.typeWif.toLowerCase() as KeyTypes;
    case 'transfer':
    case 'savings':
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
    case 'swap':
      return KeyTypes.active;
  }
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
