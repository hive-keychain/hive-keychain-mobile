import React from 'react';
import CustomModal from 'components/modals/CustomModal';

export default ({navigation, route}) => {
  return (
    <CustomModal
      outsideClick={() => {
        navigation.goBack();
      }}
      bottomHalf={true}>
      {route.params && route.params.modalContent}
    </CustomModal>
  );
};
