import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addAccount, addTabFromLinking} from 'actions/index';
import * as hiveUri from 'hive-uri';
import {AddAccountFromWalletParamList} from 'navigators/mainDrawerStacks/AddAccount.types';
import {Linking} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {RootState, store} from 'store';
import isURL from 'validator/lib/isURL';
import AccountUtils from './account.utils';
import {HASConfig} from './config.utils';
import {processQRCodeOp} from './hiveUri.utils';
import {
  extractHiveUriOpType,
  parseAddAccountPayload,
  parseBase64Json,
  parseCreateAccountLinkPayload,
} from './linkingParsers.utils';
import {KeyUtils} from './key.utils';
import {validateFromObject} from './keyValidation.utils';
import {translate} from './localize';
import {goBack, goBackAndNavigate} from './navigation.utils';

export default () => {
  const subscription = Linking.addEventListener('url', ({url}) => {
    if (url) {
      handleUrl(url);
    }
  });

  // Handle initial URL asynchronously
  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl) {
      handleUrl(initialUrl);
    }
  });

  return subscription;
};

export const handleUrl = async (url: string, qr: boolean = false) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const data = parseBase64Json(url.replace(HASConfig.auth_req, ''));
      if (!data) {
        return;
      }
      if (qr) {
        goBack();
      }
      store.dispatch(treatHASRequest(data));
    }
  } else if (url.startsWith('hive://')) {
    if (qr) {
      goBack();
    }
    if (url.startsWith('hive://sign/')) {
      const res = hiveUri.decode(url);
      const opType = extractHiveUriOpType(url);
      if (opType) {
        processQRCodeOp(opType, res);
      }
    }
  } else if (url.startsWith('keychain://create_account=')) {
    const createAccountData = parseCreateAccountLinkPayload(url);
    if (createAccountData) {
      goBackAndNavigate('Accounts', {
        screen: 'CreateAccountFromWalletScreenPageOne',
        params: {
          wallet: true,
          newPeerToPeerData: createAccountData,
        } as AddAccountFromWalletParamList['CreateAccountFromWalletScreenPageOne'],
      });
    }
  } else if (isURL(url)) {
    if (qr) {
      goBack();
    }
    //@ts-ignore
    store.dispatch(addTabFromLinking(url));
  } else if (url.startsWith('keychain://add_account=')) {
    try {
      await handleAddAccountQR(url);
    } catch (error) {
      console.log('Error processing add account link', {error});
    }
  } else {
    // Unrecognized URL scheme for Keychain, ignore
  }
};

export const handleAddAccountQR = async (
  data: string,
  wallet = true,
  mainStack = false,
) => {
  const obj = parseAddAccountPayload(data);
  if (!obj) {
    return;
  }
  let keys = {};
  if (
    (obj.keys.activePubkey &&
      KeyUtils.isAuthorizedAccount(obj.keys.activePubkey)) ||
    (obj.keys.postingPubkey &&
      KeyUtils.isAuthorizedAccount(obj.keys.postingPubkey))
  ) {
    const localAccounts = ((await store.getState()) as RootState).accounts;

    for (let i = 0; i < localAccounts.length; i++) {
      const element = localAccounts[i];
      keys = await AccountUtils.addAuthorizedAccount(
        obj.name,
        element.name,
        localAccounts,
        SimpleToast,
      );
    }
    if (!KeyUtils.hasKeys(keys)) {
      SimpleToast.show(
        translate('toast.no_accounts_no_auth', {username: obj.name}),
        {
          duration: SimpleToast.durations.LONG,
        },
      );
      return;
    }
  } else {
    keys = await validateFromObject(obj);
  }
  if (KeyUtils.hasKeys(keys)) {
    store.dispatch<any>(
      addAccount(obj.name, keys, wallet, true, false, mainStack),
    );
  } else {
    return;
  }
};

export const clearLinkingListeners = (subscription?: {remove: () => void}) => {
  if (subscription) {
    subscription.remove();
  }
};
