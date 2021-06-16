import {signUp} from 'actions/index';
import Pincode from 'components/pinCode';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {SignupNavProp} from 'types/stacks';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & SignupNavProp;

const Signup = ({signUp, navigation}: Props) => {
  const {width} = useWindowDimensions();

  const onSubmitSignup = (pwd: string) => {
    signUp(pwd);
  };
  return (
    <Background>
      <Pincode
        signup
        navigation={navigation}
        title={translate('signup.choose')}
        confirm={translate('signup.confirm')}
        submit={onSubmitSignup}>
        <KeychainLogo width={width * 0.25} />
      </Pincode>
    </Background>
  );
};

const connector = connect(null, {
  signUp,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Signup);
