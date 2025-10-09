import AsyncStorage from '@react-native-async-storage/async-storage';
import {unlock} from 'actions/index';
import InfoPIN from 'components/info_buttons/ForgotPin';
import Pincode from 'components/pin_code';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import {UnlockNavigationProp} from 'navigators/Unlock.types';
import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import SecureStoreUtils from 'utils/storage/secureStore.utils';
import StorageUtils, {BiometricsLoginStatus} from 'utils/storage/storage.utils';

type UnlockScreenProps = PropsFromRedux & UnlockNavigationProp;
const Unlock = ({
  unlock,
  navigation,
  ignoreNextBiometrics,
}: UnlockScreenProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();

  useEffect(() => {
    AsyncStorage.multiGet([
      KeychainStorageKeyEnum.ACCOUNT_STORAGE_VERSION,
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
    ]).then(async ([accountStorageVersion, isBiometricsLoginEnabled]) => {
      if (
        accountStorageVersion[1] === '2' &&
        isBiometricsLoginEnabled[1] === 'true' &&
        !ignoreNextBiometrics
      ) {
        const isBiometricsLoginEnabled =
          await StorageUtils.requireBiometricsLoginIOS('encryption.retrieve');
        if (isBiometricsLoginEnabled !== BiometricsLoginStatus.ENABLED) {
          console.log('isBiometricsLoginEnabled', isBiometricsLoginEnabled);
          AsyncStorage.setItem(
            KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
            'false',
          );
          return;
        }
        const pin = await SecureStoreUtils.getFromSecureStore(
          KeychainStorageKeyEnum.SECURE_MK,
        );
        unlock(pin);
      }
    });
  }, []);

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <>
        <Pincode
          navigation={navigation}
          title={translate('unlock.enterPIN')}
          submit={unlock}
          theme={theme}
          infoPin={<InfoPIN />}
          infoPinContainerStyle={styles.infoPinContainer}>
          <KeychainLogo width={width / 4} using_new_ui={true} theme={theme} />
        </Pincode>
      </>
    </Background>
  );
};

const connector = connect(
  (state: RootState) => ({
    ignoreNextBiometrics: state.auth.ignoreNextBiometrics,
  }),
  {
    unlock,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  infoPinContainer: {width: '100%', alignSelf: 'flex-end', marginTop: 10},
});

export default connector(Unlock);
