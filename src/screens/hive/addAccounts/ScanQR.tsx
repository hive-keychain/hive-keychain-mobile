import {RouteProp, useRoute} from '@react-navigation/native';
import QRCode from 'components/qr_code';
import {BarcodeScanningResult} from 'expo-camera';
import React from 'react';
import SimpleToast from 'react-native-root-toast';
import {handleAddAccountQR} from 'utils/linking.utils';
import {translate} from 'utils/localize';

type AnyScanQRRoute = RouteProp<
  Record<string, {wallet?: boolean} | undefined>,
  string
>;

const ScanQR = () => {
  const route = useRoute<AnyScanQRRoute>();
  const onSuccess = async ({data}: BarcodeScanningResult) => {
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
