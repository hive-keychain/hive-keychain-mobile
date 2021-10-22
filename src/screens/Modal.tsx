import HASConnectionRequest from 'components/HAS/Connect';
import CustomModal from 'components/modals/CustomModal';
import {ModalNavigationProps} from 'navigators/Root.types';
import React from 'react';
import {HAS_RequestPayload} from 'utils/HAS';
import {ModalComponent} from 'utils/modal.enum';
export default ({navigation, route}: ModalNavigationProps) => {
  const onForceCloseModal = route.params
    ? route.params!.onForceCloseModal
    : null;

  let name = route.params?.name;
  let data = route.params?.data?.data;
  const renderContent = () => {
    switch (name) {
      case ModalComponent.HAS_INIT:
        return <HASConnectionRequest data={data as HAS_RequestPayload} />;
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
      bottomHalf={true}>
      {route.params && route.params!.modalContent}
      {renderContent()}
    </CustomModal>
  );
};
