import {forgetAccounts, unlock} from 'actions/index';
import InfoPIN from 'components/info_buttons/ForgotPin';
import Pincode from 'components/pin_code';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import {UnlockNavigationProp} from 'navigators/Unlock.types';
import React, {useContext} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {ThemeContext} from 'src/context/theme.context';
import {translate} from 'utils/localize';

type UnlockScreenProps = PropsFromRedux & UnlockNavigationProp;
const Unlock = ({unlock, navigation}: UnlockScreenProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  return (
    <Background using_new_ui={true}>
      <>
        <Pincode
          navigation={navigation}
          title={translate('unlock.enterPIN')}
          submit={unlock}
          theme={theme}>
          <KeychainLogo width={width / 4} using_new_ui={true} />
        </Pincode>
        <View style={styles.container}>
          <InfoPIN />
        </View>
      </>
    </Background>
  );
};

const connector = connect(null, {
  unlock,
  forgetAccounts,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginLeft: '10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 4,
  },
});

export default connector(Unlock);
