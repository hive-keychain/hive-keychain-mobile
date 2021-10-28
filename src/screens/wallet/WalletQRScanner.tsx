import QRCode from 'components/qr_code';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';

const WalletQRScanner = () => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

export default WalletQRScanner;
