import QRCode from 'components/qr_code';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import {handleUrl} from 'utils/linking';

const WalletQRScanner = () => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      console.log(data);
      handleUrl(data, true);
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

export default WalletQRScanner;
