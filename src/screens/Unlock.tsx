import {forgetAccounts, unlock} from 'actions/index';
import Pincode from 'components/pinCode';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import {UnlockNavProp} from 'navigators/Unlock';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {translate} from 'utils/localize';

type UnlockScreenProps = PropsFromRedux & {navigation: UnlockNavProp};
const Unlock = ({unlock, navigation}: UnlockScreenProps) => {
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

const connector = connect(null, {
  unlock,
  forgetAccounts,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Unlock);
