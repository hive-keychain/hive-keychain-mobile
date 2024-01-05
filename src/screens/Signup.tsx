import {signUp} from 'actions/index';
import Pincode from 'components/pin_code';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import {SignupNavProp} from 'navigators/Signup.types';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & SignupNavProp;

const Signup = ({signUp, navigation}: Props) => {
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const onSubmitSignup = (pwd: string) => {
    signUp(pwd);
  };
  return (
    <Background theme={theme}>
      <Pincode
        signup
        navigation={navigation}
        title={translate('signup.choose')}
        confirm={translate('signup.confirm')}
        submit={onSubmitSignup}
        theme={theme}>
        <KeychainLogo width={width * 0.25} using_new_ui={true} theme={theme} />
      </Pincode>
    </Background>
  );
};

const connector = connect(null, {
  signUp,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Signup);
