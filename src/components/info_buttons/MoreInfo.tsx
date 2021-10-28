import Information from 'assets/addAccount/icon_info.svg';
import InfoQR from 'components/modals/InfoQR';
import MoreInformation from 'components/modals/MoreInformation';
import React from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {Width} from 'utils/common.types';
import {navigate} from 'utils/navigation';

export default ({type}: {type: string}) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  let content = <></>;
  switch (type) {
    case 'moreInfo':
      content = <MoreInformation />;
      break;
    case 'qr':
      content = <InfoQR />;
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
