import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import Information from '../assets/addAccount/icon_info.svg';
import CustomModal from './CustomModal';
import Separator from './Separator';

export default () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Information
        style={styles.info}
        onPress={() => {
          setVisible(true);
        }}
      />
      <CustomModal
        animation="slide"
        visible={visible}
        mode="overFullScreen"
        boxBackgroundColor="lightyellow"
        transparentContainer={true}
        bottomHalf={true}
        outsideClick={() => {
          setVisible(false);
        }}>
        <Text style={styles.h4}>KEYS (HIVE PASSWORDS)</Text>
        <Separator />
        <Text>
          Different actions require the use of different KEYS. These KEYS are
          generated when a new HIVE account is created.
        </Text>
        <Separator height={10} />
        <Text>
          <Text>
            You may use your Posting, Active, or Master Key to import your
            account.
          </Text>
          <Text style={styles.bold}>
            {' '}
            (Use your Master Key to unlock all app features).
          </Text>
        </Text>
        <Separator height={10} />
        <Text>
          If you use a Master Key, it will NOT be saved and will only be used to
          generate your other Keys. You may add/edit Accounts or Keys at any
          time.
        </Text>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  h4: {fontWeight: 'bold', fontSize: 18},
  bold: {fontWeight: 'bold'},
  modal: {height: 300, marginTop: 300},
  info: {marginRight: 20},
});
