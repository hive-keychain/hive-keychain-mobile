import AddAccountIcon from 'assets/new_UI/add_account.svg';
import CreateAccountIcon from 'assets/new_UI/create_account.svg';
import ManageKeysIcon from 'assets/new_UI/key.svg';
import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import React, {useContext} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {navigate} from 'utils/navigation';

const Accounts = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <MenuItem
        labelTranslationKey={'navigation.add_account'}
        theme={theme}
        onPress={() => navigate('AddAccountStack')}
        iconImage={<AddAccountIcon />}
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.create_account'}
        theme={theme}
        onPress={() => navigate('CreateAccountScreen')}
        iconImage={<CreateAccountIcon />}
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.manage'}
        theme={theme}
        onPress={() => navigate('AccountManagementScreen')}
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
