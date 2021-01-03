import React from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {navigate} from 'utils/navigation';
import MoreInformation from 'components/modals/MoreInformation';
import InfoQR from 'components/modals/InfoQR';
import Information from 'assets/addAccount/icon_info.svg';

export default ({type}) => {
  const {height, width} = useWindowDimensions();
  const styles = getDimensionedStyles({height, width});
  let content = null;
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

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    info: {marginRight: width * 0.05},
  });
