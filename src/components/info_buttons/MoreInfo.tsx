import Icon from 'components/hive/Icon';
import InfoQR from 'components/modals/InfoQR';
import InfoWalletQR from 'components/modals/InfoWalletQR';
import MoreInformation from 'components/modals/MoreInformation';
import {ModalScreenProps} from 'navigators/Root.types';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getModalBaseStyle} from 'src/styles/modal';
import {Width} from 'utils/common.types';
import {navigate} from 'utils/navigation';

export enum Info {
  KEYS = 'KEYS',
  QR_ACCOUNT = 'QR_ACCOUNT',
  QR_WALLET = 'QR_WALLET',
}
export default ({
  type,
  additionalButtonStyle,
  theme,
}: {
  type: string;
  additionalButtonStyle?: StyleProp<ViewStyle>;
  //TODO make fixed after refactoring
  theme?: Theme;
}) => {
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
    <Icon
      name="info"
      theme={theme}
      additionalContainerStyle={additionalButtonStyle}
      //TODO bellow adjust styles on each content
      //TODO check if the container changes or stay as one style
      onClick={() =>
        navigate('ModalScreen', {
          modalContent: content,
          modalContainerStyle: [
            getModalBaseStyle(theme).roundedTop,
            styles.moreInfoModal,
          ],
        } as ModalScreenProps)
      }
    />
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    moreInfoModal: {
      paddingHorizontal: 25,
      paddingTop: 25,
      paddingBottom: 45,
    },
  });
