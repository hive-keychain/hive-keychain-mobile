import {addAccount} from 'actions/index';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect, ConnectedProps} from 'react-redux';
import {validateFromObject} from 'utils/keyValidation';

const ScanQR = ({addAccount, route}: PropsFromRedux) => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      const obj = JSON.parse(data.replace('keychain://add_account=', ''));
      const keys = await validateFromObject(obj);
      const wallet = route.params ? route.params.wallet : false;
      addAccount(obj.name, keys, wallet, true);
    } catch (e) {
      console.log(e, data);
    }
  };
  return (
    <QRCodeScanner
      onRead={onSuccess}
      showMarker
      topViewStyle={styles.zeroView}
      bottomViewStyle={styles.zeroView}
      cameraStyle={styles.cameraContainer}
    />
  );
};

const styles = StyleSheet.create({
  zeroView: {flex: 0, height: 0},
  cameraContainer: {height: Dimensions.get('window').height},
});
const connector = connect(null, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ScanQR);
