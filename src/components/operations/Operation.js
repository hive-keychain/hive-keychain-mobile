import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import RoundButton from './RoundButton';
import CustomModal from '../CustomModal';
import Close from 'assets/wallet/icon_close.svg';

export default ({
  icon,
  children,
  logoButton,
  logo,
  buttonBackgroundColor,
  title,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <RoundButton
        size={36}
        content={logoButton}
        backgroundColor={buttonBackgroundColor}
        onPress={() => {
          setVisible(true);
        }}
      />
      <CustomModal
        animation="slide"
        visible={visible}
        mode="overFullScreen"
        boxBackgroundColor="black"
        transparentContainer={false}
        bottomHalf={true}
        outsideClick={() => null}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logo}
            <Text style={styles.title}>{title.toUpperCase()}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}>
            <Close style={styles.close} />
          </TouchableOpacity>
        </View>
        {children}
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  close: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginLeft: 20,
    justifyContent: 'center',
  },
});
