import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addAccount, addTabFromLinking} from 'actions/index';
import {Account} from 'actions/interfaces';
import {translate} from 'i18n-js';
import {Linking} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {RootState, store} from 'store';
import isURL from 'validator/lib/isURL';
import AccountUtils from './account.utils';
import {HASConfig} from './config';
import {processQRCodeOp} from './hive-uri';
import {KeyUtils} from './key.utils';
import {validateFromObject} from './keyValidation';
import {goBack, resetStackAndNavigate} from './navigation';

let flagCurrentlyProcessing = false;
let qr_data_accounts: {
  data: string;
  index: number;
  total: number;
}[] = [];

export default async () => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      handleUrl(url);
    }
  });

  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleUrl(initialUrl);
  }
};

export const handleUrl = async (url: string, qr: boolean = false) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const buf = Buffer.from(url.replace(HASConfig.auth_req, ''), 'base64');
      const data = JSON.parse(buf.toString());
      if (qr) {
        goBack();
      }
      store.dispatch(treatHASRequest(data));
    }
  } else if (url.startsWith('hive://')) {
    if (qr) {
      goBack();
    }
    if (url.startsWith('hive://sign/op/')) {
      const op = url.replace('hive://sign/op/', '');
      const stringOp = Buffer.from(op, 'base64').toString();
      const opJson = JSON.parse(stringOp);
      console.log(opJson);
      processQRCodeOp(opJson);
    }
  } else if (isURL(url)) {
    if (qr) {
      goBack();
    }
    //@ts-ignore
    store.dispatch(addTabFromLinking(url));
  } else if (url.startsWith('keychain://add_accounts=')) {
    if (flagCurrentlyProcessing) {
      return;
    }
    const accountData = url.replace('keychain://add_accounts=', '');
    const accountDataStr = Buffer.from(accountData, 'base64').toString();
    try {
      const dataAccounts = JSON.parse(accountDataStr);
      if (
        dataAccounts &&
        !qr_data_accounts.find((q) => q.index === dataAccounts.index)
      ) {
        qr_data_accounts.push(dataAccounts);
        if (dataAccounts.total === qr_data_accounts.length) {
          flagCurrentlyProcessing = true;
          await handleAddAccountsQR(qr_data_accounts);
        }
      }
    } catch (error) {
      console.log('Error getting QR data accounts', {error});
    }
  } else [handleAddAccountQR(url)];
};

const handleAddAccountsQR = async (
  dataAccounts: {
    data: string;
    index: number;
    total: number;
  }[],
  wallet = true,
) => {
  for (const dataAcc of dataAccounts) {
    const objects: string[] = JSON.parse(dataAcc.data);
    const objectsAccounts: Account[] = objects.map((o) => JSON.parse(o));
    for (const objAcc of objectsAccounts) {
      let keys = {};
      if (
        (objAcc.keys.activePubkey &&
          KeyUtils.isAuthorizedAccount(objAcc.keys.activePubkey)) ||
        (objAcc.keys.postingPubkey &&
          KeyUtils.isAuthorizedAccount(objAcc.keys.postingPubkey))
      ) {
        const localAccounts = ((await store.getState()) as RootState).accounts;

        for (let i = 0; i < localAccounts.length; i++) {
          const element = localAccounts[i];
          keys = await AccountUtils.addAuthorizedAccount(
            objAcc.name,
            element.name,
            localAccounts,
            SimpleToast,
          );
        }
        if (!KeyUtils.hasKeys(keys)) {
          SimpleToast.show(
            translate('toast.no_accounts_no_auth', {username: objAcc.name}),
            SimpleToast.LONG,
          );
          break;
        }
      } else {
        keys = await validateFromObject(objAcc);
      }
      if (wallet && KeyUtils.hasKeys(keys)) {
        store.dispatch<any>(addAccount(objAcc.name, keys, false, false, true));
      } else {
        break;
      }
    }
  }
  qr_data_accounts = [];
  flagCurrentlyProcessing = false;
  return resetStackAndNavigate('WALLET');
};

export const handleAddAccountQR = async (data: string, wallet = true) => {
  const obj = JSON.parse(data.replace('keychain://add_account=', ''));
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
        SimpleToast.LONG,
      );
      return;
    }
  } else {
    keys = await validateFromObject(obj);
  }
  if (wallet && KeyUtils.hasKeys(keys)) {
    store.dispatch<any>(addAccount(obj.name, keys, wallet, true));
  } else {
    return;
  }
};

export const clearLinkingListeners = () => {
  Linking.removeAllListeners('url');
};
