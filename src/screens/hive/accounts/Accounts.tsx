import AddAccountIcon from 'assets/new_UI/add_account.svg';
import CreateAccountIcon from 'assets/new_UI/create_account.svg';
import ManageKeysIcon from 'assets/new_UI/key.svg';
import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {navigate} from 'utils/navigation';

const Accounts = () => {
  const {theme} = useThemeContext();
  return (
    <View style={getMenuCardStyle(theme)}>
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
      />
    </View>
  );
};

export default Accounts;
