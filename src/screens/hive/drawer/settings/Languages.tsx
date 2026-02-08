import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadAccount} from 'actions/hive';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {getLocalesList, setLocale} from 'utils/localize';

const Languages = ({loadAccount, activeAccount}: PropsFromRedux) => {
  const [isDefaultDeviceLanguage, setIsDefaultDeviceLanguage] = useState(true);
  const [language, setLanguage] = useState<DropdownModalItem>(
    getLocalesList()[0],
  );
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  const DEFAULT_VALUE = 'DEFAULT';
  useEffect(() => {
    AsyncStorage.getItem(KeychainStorageKeyEnum.LANGUAGE).then((value) => {
      if (!value || value === DEFAULT_VALUE) setIsDefaultDeviceLanguage(true);
      else {
        setIsDefaultDeviceLanguage(false);
        setLanguage(getLocalesList().find((locale) => locale.value === value));
      }
    });
  }, []);

  const updateLanguage = async (value: string) => {
    await AsyncStorage.setItem(KeychainStorageKeyEnum.LANGUAGE, value);
    setLocale();
    loadAccount(activeAccount?.name);
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <View style={styles.container}>
        <Caption text={'settings.settings.language.description'} />
        <Separator />
        <CheckBoxPanel
          checked={isDefaultDeviceLanguage}
          onPress={async () => {
            updateLanguage(
              isDefaultDeviceLanguage ? language.value : DEFAULT_VALUE,
            );
            setIsDefaultDeviceLanguage(!isDefaultDeviceLanguage);
          }}
          title="settings.settings.language.checkbox_default_language"
        />
        <Separator />
        {!isDefaultDeviceLanguage && (
          <DropdownModal
            dropdownTitle="settings.settings.language.dropdown_title"
            list={getLocalesList()}
            selected={language}
            iconAsText
            showSelectedIcon
            onSelected={(option) => {
              setLanguage(option);
              updateLanguage(option.value);
            }}
          />
        )}
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

const connector = connect(
  (state: RootState) => ({activeAccount: state.activeAccount}),
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Languages);
