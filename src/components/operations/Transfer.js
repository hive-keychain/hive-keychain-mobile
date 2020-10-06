import React from 'react';
import {Text} from 'react-native';
import SendArrow from 'assets/wallet/icon_send.svg';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import Operation from './Operation';
import {translate} from 'utils/localize';

export default ({}) => {
  return (
    <Operation
      buttonBackgroundColor="#77B9D1"
      logoButton={<SendArrow />}
      logo={<SendArrowBlue />}
      title={translate('wallet.operations.transfer.title')}>
      <Text>test</Text>
    </Operation>
  );
};
