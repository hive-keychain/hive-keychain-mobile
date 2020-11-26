import React from 'react';
import {useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';

import {unlock, forgetAccounts} from 'actions';
import Background from 'components/ui/Background';
import Pincode from 'components/pinCode';
import KeychainLogo from 'components/ui/KeychainLogo';
import {translate} from 'utils/localize';

const Unlock = ({unlockConnect, forgetAccountsConnect, navigation}) => {
  const {width} = useWindowDimensions();
  return (
    <Background>
      <Pincode
        navigation={navigation}
        title={translate('unlock.enterPIN')}
        submit={unlockConnect}>
        <KeychainLogo width={width / 4} />
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

export default connect(null, {
  unlockConnect: unlock,
  forgetAccountsConnect: forgetAccounts,
})(Unlock);
