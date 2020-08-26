import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';
import {signUp} from 'actions';
import Background from 'components/Background';
import Pincode from 'components/PinCode';
import KeychainLogo from 'assets/keychain.svg';
import {translate} from 'utils/localize';

const Signup = ({signUpConnect, navigation}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

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
        <View style={styles.blackCircle}>
          <KeychainLogo {...styles.image} />
        </View>
      </Pincode>
    </Background>
  );
};

const getDimensionedStyles = (width, height) =>
  StyleSheet.create({
    blackCircle: {
      width: width * 0.25,
      height: width * 0.25,
      backgroundColor: 'black',
      borderRadius: width * 0.125,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {width: width * 0.125, height: ((width * 0.125) / 49) * 41},
  });

export default connect(null, {signUpConnect: signUp})(Signup);
