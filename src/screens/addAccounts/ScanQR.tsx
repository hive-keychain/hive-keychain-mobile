import {addAccount} from 'actions/index';
import QRCode from 'components/qr_code';
import {AddAccFromWalletNavigationProps} from 'navigators/mainDrawerStacks/AddAccount.types';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {validateFromObject} from 'utils/keyValidation';
import {translate} from 'utils/localize';

const ScanQR = ({
  addAccount,
  route,
}: PropsFromRedux & AddAccFromWalletNavigationProps) => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      if (!data.startsWith('keychain://add_account=')) {
        SimpleToast.show(translate('addAccountByQR.wrongQR'), SimpleToast.LONG);
        return;
      }
      const obj = JSON.parse(data.replace('keychain://add_account=', ''));
      const keys = await validateFromObject(obj);
      const wallet = route.params ? route.params.wallet : false;
      addAccount(obj.name, keys, wallet, true);
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

const connector = connect(null, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ScanQR);
