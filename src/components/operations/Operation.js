import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Close from 'assets/wallet/icon_close.svg';
import {goBack} from 'utils/navigation';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';

export default ({icon, children, logo, title, onClose}) => {
  return (
    <>
      <FocusAwareStatusBar backgroundColor="#b4112A" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {logo}
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (onClose) {
              onClose();
            } else {
              goBack();
            }
          }}>
          <Close style={styles.close} />
        </TouchableOpacity>
      </View>
      {children}
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
