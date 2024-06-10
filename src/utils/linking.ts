import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addAccount, addTabFromLinking} from 'actions/index';
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
import {goBack} from './navigation';

export default async () => {
  Linking.addEventListener('url', ({url}) => {
    if (url) {
      console.log({url}); //TODO remove line
      handleUrl(url);
    }
  });

  const initialUrl = await Linking.getInitialURL();
  console.log({initialUrl}); //TODO remove line
  if (initialUrl) {
    handleUrl(initialUrl);
  }
};

export const handleUrl = (url: string, qr: boolean = false) => {
  console.log({url});
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
  } else if (url.startsWith('keychain://create_account=')) {
    console.log('Create Account!'); //TODO remove line
    const buf = url.replace('keychain://create_account=', '');
    const data = JSON.parse(Buffer.from(buf, 'base64').toString());
    console.log({data});
    //TODO bellow
    //Load confirmation window with the operation, similar to
    //  -> src/screens/hive/createAccounts/CreateAccountConfirmation.tsx line 267
    //  -> wait for result, if success present modal message.
    //  - in the "other side" as soon as the account exists, we will try to add it
    //    using the keys that user has.
  } else if (isURL(url)) {
    if (qr) {
      goBack();
    }
    //@ts-ignore
    store.dispatch(addTabFromLinking(url));
  } else if (url.startsWith('keychain://add_account='))
    [handleAddAccountQR(url)];
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
