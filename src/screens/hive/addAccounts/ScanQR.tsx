import {addAccount} from 'actions/index';
import QRCode from 'components/qr_code';
import {AddAccFromWalletNavigationProps} from 'navigators/mainDrawerStacks/AddAccount.types';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {KeyUtils} from 'utils/key.utils';
import {validateFromObject} from 'utils/keyValidation';
import {translate} from 'utils/localize';

const ScanQR = ({
  addAccount,
  localAccounts,
  route,
}: PropsFromRedux & AddAccFromWalletNavigationProps) => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      if (!data.startsWith('keychain://add_account=')) {
        SimpleToast.show(translate('addAccountByQR.wrongQR'), SimpleToast.LONG);
        return;
      }
      const obj = JSON.parse(data.replace('keychain://add_account=', ''));
      let keys = {};
      if (
        (obj.keys.activePubkey &&
          KeyUtils.isAuthorizedAccount(obj.keys.activePubkey)) ||
        (obj.keys.postingPubkey &&
          KeyUtils.isAuthorizedAccount(obj.keys.postingPubkey))
      ) {
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
      const wallet = route.params ? route.params.wallet : false;
      if (wallet && KeyUtils.hasKeys(keys)) {
        addAccount(obj.name, keys, wallet, true);
      } else {
        return;
      }
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ScanQR);
