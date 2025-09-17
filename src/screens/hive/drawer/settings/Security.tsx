import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import SecureStoreUtils from 'utils/storage/secureStore.utils';

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
            await AsyncStorage.setItem(
              KeychainStorageKeyEnum.IS_BIOMETRICS_LOGIN_ENABLED,
              (!isActive).toString(),
            );
            if (!isActive) {
              await SecureStoreUtils.saveOnSecureStore(
                KeychainStorageKeyEnum.SECURE_MK,
                mk,
              );
            } else {
              await SecureStoreUtils.deleteFromSecureStore(
                KeychainStorageKeyEnum.SECURE_MK,
              );
            }
            setActive(!isActive);
          }}
          title="settings.settings.security.biometrics"
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
