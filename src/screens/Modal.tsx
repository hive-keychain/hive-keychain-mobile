import CustomModal from 'components/modals/CustomModal';
import {ModalNavigationProps} from 'navigators/Root.types';
import React from 'react';

export default ({navigation, route}: ModalNavigationProps) => {
  const onForceCloseModal = route.params
    ? route.params.onForceCloseModal
    : null;
  return (
    <CustomModal
      outsideClick={
        onForceCloseModal ||
        (() => {
          navigation.goBack();
        })
      }
      bottomHalf={true}>
      {route.params && route.params.modalContent}
    </CustomModal>
  );
};
