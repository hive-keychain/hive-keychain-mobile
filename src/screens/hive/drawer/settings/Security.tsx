import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Toast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import SecureStoreUtils from 'utils/storage/secureStore.utils';
import StorageUtils, {BiometricsLoginStatus} from 'utils/storage/storage.utils';

const Security = ({mk}: PropsFromRedux) => {
  const [isActive, setActive] = useState(false);
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    AsyncStorage.getItem(
      KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
    ).then((value) => {
      setActive(value === 'true');
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
      <View style={styles.container}>
        <Caption text={'settings.settings.security.disclaimer'} />
        <Separator />
        <CheckBoxPanel
          checked={isActive}
          onPress={async () => {
            try {
              if (!isActive) {
                const isBiometricsAvailable =
                  await StorageUtils.requireBiometricsLoginIOS(
                    'settings.settings.security.biometrics',
                    true,
                  );
                if (isBiometricsAvailable !== BiometricsLoginStatus.ENABLED)
                  throw new Error(isBiometricsAvailable);
                await SecureStoreUtils.saveOnSecureStore(
                  KeychainStorageKeyEnum.SECURE_MK,
                  mk,
                  'settings.settings.security.biometrics',
                );
              } else {
                await SecureStoreUtils.deleteFromSecureStore(
                  KeychainStorageKeyEnum.SECURE_MK,
                );
              }
              await AsyncStorage.setItem(
                KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
                (!isActive).toString(),
              );
              setActive(!isActive);
            } catch (error: any) {
              if (error.message === BiometricsLoginStatus.REFUSED) {
                Toast.show(
                  translate('settings.settings.security.biometrics_refused'),
                  {duration: Toast.durations.LONG},
                );
              } else {
                Toast.show(
                  translate('settings.settings.security.error_no_biometrics'),
                );
              }
            }
          }}
          title="settings.settings.security.checkbox"
        />
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, padding: CARD_PADDING_HORIZONTAL},
    title: {
      ...title_primary_title_1,
      color: getColors(theme).primaryText,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  });

const mapStateToProps = (state: RootState) => ({
  mk: state.auth.mk,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Security);
