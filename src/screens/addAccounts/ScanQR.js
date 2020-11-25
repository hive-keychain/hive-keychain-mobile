import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';
import {RNCamera} from 'react-native-camera';

import {validateFromObject} from 'utils/keyValidation';
import {addAccount} from 'actions';

const ScanQR = ({addAccountConnect, route}) => {
  const onSuccess = async ({data}) => {
    try {
      const obj = JSON.parse(data.replace('keychain://add_account=', ''));
      const keys = await validateFromObject(obj);
      const wallet = route.params ? route.params.wallet : false;
      addAccountConnect(obj.name, keys, wallet);
    } catch (e) {
      console.log(e, data);
    }
  };
  return (
    <QRCodeScanner
      onRead={onSuccess}
      showMarker
      flashMode={RNCamera.Constants.FlashMode.off}
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

export default connect(null, {addAccountConnect: addAccount})(ScanQR);
