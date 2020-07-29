import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Information from '../assets/addAccount/icon_info.svg';
import Separator from './Separator';
import IconSlider from './IconSlider';

export default () => {
  return (
    <IconSlider icon={<Information style={styles.info} />}>
      <Text style={styles.h4}>Import via QR Code</Text>
      <Separator />
      <Text>
        You can import an account instantly by scanning its corresponding QR
        Code.
      </Text>
      <Separator height={10} />
      <Text>
        <Text>To import from Hive Keychain browser extension, navigate to</Text>
        <Text style={styles.bold}> Settings</Text> then click on{' '}
        <Text style={styles.bold}> Manage Accounts</Text> and{' '}
        <Text style={styles.bold}> Show QR Code</Text>.
      </Text>
    </IconSlider>
  );
};

const styles = StyleSheet.create({
  h4: {fontWeight: 'bold', fontSize: 18},
  bold: {fontWeight: 'bold'},
  modal: {height: 300, marginTop: 300},
  info: {marginRight: 20},
});
