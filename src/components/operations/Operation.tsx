import Close from 'assets/wallet/icon_close.svg';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {goBack} from 'utils/navigation';

type Props = {
  children: JSX.Element;
  logo?: JSX.Element;
  title: string;
  onClose?: () => void;
};
export default ({children, logo, title, onClose}: Props) => {
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
          <Close style={styles.close} width={15} height={15} />
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
