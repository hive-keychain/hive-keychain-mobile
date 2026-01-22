import Pincode from 'components/pin_code';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { useThemeContext } from 'src/context/theme.context';
import AuthUtils from 'utils/authentication.utils';
import { translate } from 'utils/localize';

type ChangePinProps = {
  navigation: any;
};

const ChangePin = ({navigation}: ChangePinProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles();

  const handleSubmit = async (newPin: string) => {
    try {
      await AuthUtils.persistPinSecret(newPin);
      Toast.show(translate('settings.settings.security.change_pin_success'), {
        duration: Toast.durations.LONG,
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show(
        translate('common.error', {msg: error?.message || 'Unknown error'}),
        {duration: Toast.durations.LONG},
      );
    }
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <Pincode
        mode="changePin"
        navigation={navigation}
        title={translate('settings.settings.security.change_pin_current')}
        newTitle={translate('settings.settings.security.change_pin_new')}
        confirm={translate('settings.settings.security.change_pin_confirm')}
        submit={handleSubmit}
        verifyCurrentPin={AuthUtils.verifyPin}
        theme={theme}>
        <View style={styles.headerContent}>
          <KeychainLogo width={width * 0.25} using_new_ui={true} theme={theme} />
        </View>
      </Pincode>
    </Background>
  );
};

const getStyles = () =>
  StyleSheet.create({
    headerContent: {
      alignItems: 'center',
    },
  });

export default ChangePin;
