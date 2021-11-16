import {DrawerNavigationProp} from '@react-navigation/drawer';
import QRLogo from 'assets/addAccount/icon_scan-qr.svg';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  navigation: DrawerNavigationProp<any>;
};

export default ({navigation}: Props) => {
  return (
    <TouchableOpacity
      style={styles.qr}
      onPress={() => {
        navigation.navigate('ScanQRFromWalletScreen', {wallet: true});
      }}>
      <QRLogo width={25} height={25} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  qr: {marginLeft: 12},
});
