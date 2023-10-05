import RequestModalContent from 'components/browser/RequestModalContent';
import HASAuthRequest from 'components/hive_authentication_service/Auth';
import HASChallengeRequest from 'components/hive_authentication_service/Challenge';
import HASError from 'components/hive_authentication_service/Error';
import HASInfo from 'components/hive_authentication_service/Info';
import CustomModal from 'components/modals/CustomModal';
import {ModalNavigationProps} from 'navigators/Root.types';
import React from 'react';
import {HAS_BroadcastModalPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {ModalComponent} from 'utils/modal.enum';

export default ({navigation, route}: ModalNavigationProps) => {
  let onForceCloseModal = route.params ? route.params!.onForceCloseModal : null;
  const name = route.params?.name;
  const data = route.params?.data;
  const fixedHeight = route.params?.fixedHeight;
  const containerStyle = route.params?.modalContainerStyle;
  if (!onForceCloseModal && data?.onForceCloseModal) {
    onForceCloseModal = data.onForceCloseModal;
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
      containerStyle={containerStyle}>
      {route.params && !renderContent() && route.params!.modalContent}
      {renderContent()}
    </CustomModal>
  );
};
