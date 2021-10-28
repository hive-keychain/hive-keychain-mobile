import {addAccount} from 'actions/index';
import {AddAccFromWalletNavigationProps} from 'navigators/mainDrawerStacks/AddAccount.types';
import React from 'react';
import {Dimensions, StyleSheet, useWindowDimensions, View} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect, ConnectedProps} from 'react-redux';
import {Width} from 'utils/common.types';
import {validateFromObject} from 'utils/keyValidation';

const ScanQR = ({
  addAccount,
  route,
}: PropsFromRedux & AddAccFromWalletNavigationProps) => {
  const styles = getStyles(useWindowDimensions());
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
      customMarker={<Marker />}
    />
  );
};

const Marker = () => {
  const styles = getStyles(useWindowDimensions());
  return (
    <View style={styles.marker}>
      <View style={[styles.markerSide, styles.topLeft]}></View>
      <View style={[styles.markerSide, styles.topRight]}></View>
      <View style={[styles.markerSide, styles.bottomLeft]}></View>
      <View style={[styles.markerSide, styles.bottomRight]}></View>
    </View>
  );
};

const getStyles = ({width}: Width) =>
  StyleSheet.create({
    zeroView: {flex: 0, height: 0},
    cameraContainer: {height: Dimensions.get('window').height},
    marker: {
      width: 0.8 * width,
      height: 0.8 * width,
    },
    markerSide: {
      borderColor: 'black',
      borderWidth: 6,
      width: 0.2 * width,
      height: 0.2 * width,
      position: 'absolute',
    },
    topLeft: {
      top: 0,
      left: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
    },
    topRight: {
      top: 0,
      right: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderTopWidth: 0,
      borderLeftWidth: 0,
    },
  });

const connector = connect(null, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ScanQR);
