import React from 'react';
import CustomModal from 'components/CustomModal';

export default ({navigation, route}) => {
  console.log('show modal screen');
  return (
    <CustomModal
      visible={true}
      mode="overFullScreen"
      transparentContainer={true}
      outsideClick={() => {
        navigation.goBack();
      }}
      bottomHalf={true}>
      {route.params && route.params.modalContent}
    </CustomModal>
  );
};
