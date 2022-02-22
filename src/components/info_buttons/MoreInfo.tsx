import Information from 'assets/addAccount/icon_info.svg';
import InfoQR from 'components/modals/InfoQR';
import InfoWalletQR from 'components/modals/InfoWalletQR';
import MoreInformation from 'components/modals/MoreInformation';
import React from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {Width} from 'utils/common.types';
import {navigate} from 'utils/navigation';

export enum Info {
  KEYS = 'KEYS',
  QR_ACCOUNT = 'QR_ACCOUNT',
  QR_WALLET = 'QR_WALLET',
}
export default ({type}: {type: string}) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  let content = <></>;
  switch (type) {
    case Info.KEYS:
      content = <MoreInformation />;
      break;
    case Info.QR_ACCOUNT:
      content = <InfoQR />;
      break;
    case Info.QR_WALLET:
      content = <InfoWalletQR />;
      break;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {modalContent: content});
      }}>
      <Information style={styles.info} fill="#d9e3ed" />
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    info: {marginRight: width * 0.05},
  });
