import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {validateFromObject} from '../../utils/validateNewAccount';
import {addAccount} from '../../actions';
import {connect} from 'react-redux';

const ScanQR = ({addAccountConnect}) => {
  const onSuccess = async ({data}) => {
    const obj = JSON.parse(data.replace('keychain://add_account=', ''));
    const keys = await validateFromObject(obj);
    addAccountConnect(obj.name, keys);
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
