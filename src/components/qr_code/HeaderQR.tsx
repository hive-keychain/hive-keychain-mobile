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
      activeOpacity={1}
      style={styles.qr}
      onPress={() => {
        navigation.navigate('ScanQRFromWalletScreen', {wallet: true});
      }}>
      <QRLogo width={23} height={23} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  qr: {
    marginLeft: 20,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
