import RequestModalContent from 'components/browser/RequestModalContent';
import SwapInfo from 'components/hive/SwapInfo';
import HASAuthRequest from 'components/hive_authentication_service/Auth';
import HASChallengeRequest from 'components/hive_authentication_service/Challenge';
import HASError from 'components/hive_authentication_service/Error';
import HASInfo from 'components/hive_authentication_service/Info';
import CustomModal from 'components/modals/CustomModal';
import {ModalNavigationProps} from 'navigators/Root.types';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HAS_BroadcastModalPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {ModalComponent} from 'utils/modal.enum';

export default ({navigation, route}: ModalNavigationProps) => {
  const {theme} = useThemeContext();
  let onForceCloseModal = route.params ? route.params!.onForceCloseModal : null;
  const name = route.params?.name;
  const data = route.params?.data;
  const fixedHeight = route.params?.fixedHeight;
  let containerStyle = route.params?.modalContainerStyle;
  const wrapperFixedStyle = route.params?.additionalWrapperFixedStyle;
  const modalPosition = route.params?.modalPosition;
  const buttonElement = route.params?.renderButtonElement;

  if (!onForceCloseModal && data?.onForceCloseModal) {
    onForceCloseModal = data.onForceCloseModal;
  }

  if (
    (name &&
      (name.toLowerCase().includes('operation') ||
        name.includes(ModalComponent.HAS_INFO) ||
        name.includes(ModalComponent.SWAP_INFO))) ||
    name.includes(ModalComponent.BROADCAST)
  ) {
    containerStyle = {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      padding: 10,
    } as StyleProp<ViewStyle>;
  }

  const renderContent = () => {
    switch (name) {
      case ModalComponent.HAS_AUTH:
        return <HASAuthRequest data={data as any} navigation={navigation} />;
      case ModalComponent.BROADCAST:
        return <RequestModalContent {...(data as HAS_BroadcastModalPayload)} />;
      case ModalComponent.HAS_CHALLENGE:
        return (
          <HASChallengeRequest data={data as any} navigation={navigation} />
        );
      case ModalComponent.HAS_ERROR:
        return <HASError text={data.text} navigation={navigation} />;
      case ModalComponent.HAS_INFO:
        return <HASInfo />;
      case ModalComponent.SWAP_INFO:
        return <SwapInfo />;
      default:
        return null;
    }
  };

  return (
    <CustomModal
      outsideClick={
        onForceCloseModal ||
        (() => {
          navigation.goBack();
        })
      }
      fixedHeight={fixedHeight}
      bottomHalf={true}
      containerStyle={containerStyle}
      additionalWrapperFixedStyle={wrapperFixedStyle}
      modalPosition={modalPosition}
      buttonElement={buttonElement}>
      {route.params && !renderContent() && route.params!.modalContent}
      {renderContent()}
    </CustomModal>
  );
};
