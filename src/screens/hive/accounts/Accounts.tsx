import AddAccountIcon from 'assets/new_UI/add_account.svg';
import CreateAccountIcon from 'assets/new_UI/create_account.svg';
import ManageKeysIcon from 'assets/new_UI/key.svg';
import DrawerContentItem from 'components/drawer/drawer-content-item/DrawerContentItem';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

const Accounts = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <DrawerContentItem
        labelTranslationKey={'navigation.add_account'}
        theme={theme}
        onPress={() => {}} //TODO add navigation
        iconImage={<AddAccountIcon />}
        drawBottomLine={true}
      />
      <DrawerContentItem
        labelTranslationKey={'navigation.create_account'}
        theme={theme}
        onPress={() => {}} //TODO add navigation
        iconImage={<CreateAccountIcon />}
        drawBottomLine={true}
      />
      <DrawerContentItem
        labelTranslationKey={'navigation.manage'}
        theme={theme}
        onPress={() => {}} //TODO add navigation
        iconImage={<ManageKeysIcon />}
        drawBottomLine={true}
      />
    </View>
  );
};

export default Accounts;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 11,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      backgroundColor: getColors(theme).cardBgLighter,
      paddingVertical: 25,
      paddingHorizontal: 14,
    },
    text: {
      color: getColors(theme).secondaryText,
    },
  });
