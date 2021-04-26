import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';

import {unlock, forgetAccounts} from 'actions';
import Background from 'components/ui/Background';
import Pincode from 'components/pinCode';
import KeychainLogo from 'components/ui/KeychainLogo';
import {translate} from 'utils/localize';

const Unlock = ({unlock, forgetAccounts, navigation}) => {
  const {width} = useWindowDimensions();
  return (
    <Background>
      <Pincode
        navigation={navigation}
        title={translate('unlock.enterPIN')}
        submit={unlock}>
        <KeychainLogo width={width / 4} />
      </Pincode>
    </Background>
  );
};

export default connect(null, {
  unlock,
  forgetAccounts,
})(Unlock);
