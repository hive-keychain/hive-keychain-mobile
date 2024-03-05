import Icon from 'components/hive/Icon';
import CopyKeys from 'components/modals/CopyKeys';
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
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {Width} from 'utils/common.types';
import {navigate} from 'utils/navigation';

export enum Info {
  KEYS = 'KEYS',
  QR_ACCOUNT = 'QR_ACCOUNT',
  QR_WALLET = 'QR_WALLET',
  COPY_KEYS = 'COPY_KEYS',
}
export default ({
  type,
  additionalButtonStyle,
}: {
  type: string;
  additionalButtonStyle?: StyleProp<ViewStyle>;
}) => {
  const {theme} = useThemeContext();
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
      content = <InfoWalletQR theme={theme} />;
      break;
    case Info.COPY_KEYS:
      content = <CopyKeys />;
      break;
  }
  return (
    <Icon
      name={Icons.INFO}
      theme={theme}
      additionalContainerStyle={additionalButtonStyle}
      onClick={() =>
        navigate('ModalScreen', {
          name: Info.COPY_KEYS,
          modalContent: content,
          modalContainerStyle: [
            getModalBaseStyle(theme).roundedTop,
            styles.moreInfoModal,
          ],
          fixedHeight: 0.35,
        } as ModalScreenProps)
      }
      color={getColors(theme).iconBW}
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
