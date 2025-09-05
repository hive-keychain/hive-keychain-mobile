import QRCode from 'components/qr_code';
import {AddAccFromWalletNavigationProps} from 'navigators/mainDrawerStacks/AddAccount.types';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import SimpleToast from 'react-native-root-toast';
import {handleAddAccountQR} from 'utils/linking';
import {translate} from 'utils/localize';

const ScanQR = ({route}: AddAccFromWalletNavigationProps) => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      if (!data.startsWith('keychain://add_account=')) {
        SimpleToast.show(translate('addAccountByQR.wrongQR'), {
          duration: SimpleToast.durations.LONG,
        });
        return;
      } else {
        const wallet = route.params ? route.params.wallet : false;

        handleAddAccountQR(data, wallet);
      }
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

export default ScanQR;
