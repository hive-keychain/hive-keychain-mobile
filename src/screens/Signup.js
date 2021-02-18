import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';
import {signUp} from 'actions';
import Background from 'components/ui/Background';
import Pincode from 'components/pinCode';
import KeychainLogo from 'components/ui/KeychainLogo';
import {translate} from 'utils/localize';

const Signup = ({signUpConnect, navigation}) => {
  const {width} = useWindowDimensions();

  const onSubmitSignup = (pwd) => {
    signUpConnect(pwd);
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

export default connect(null, {signUpConnect: signUp})(Signup);
