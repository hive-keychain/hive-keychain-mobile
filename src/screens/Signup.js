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

// const getDimensionedStyles = ({width, height}) =>
//   StyleSheet.create({
//     blackCircle: {
//       width: width * 0.25,
//       height: width * 0.25,
//       backgroundColor: 'black',
//       borderRadius: width * 0.125,
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     image: {width: width * 0.125, height: ((width * 0.125) / 49) * 41},
//   });

export default connect(null, {signUpConnect: signUp})(Signup);
