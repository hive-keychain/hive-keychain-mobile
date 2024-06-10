import QRCode from 'components/qr_code';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import {handleUrl} from 'utils/linking';

const WalletQRScanner = () => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      console.log('WalletQRScanner', {data}); //TODO remove line
      handleUrl(data, true);
    } catch (e) {
      console.log(e, data);
    }
  };
  return (
    <>
      <FocusAwareStatusBar />
      <QRCode onSuccess={onSuccess} />
    </>
  );
};

export default WalletQRScanner;
