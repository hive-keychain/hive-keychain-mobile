import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {navigate} from 'utils/navigation.utils';

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
        onPress={() => navigate('AddAccountFromWalletScreen')}
        iconImage={<Icon name={Icons.ADD_ACCOUNT} color={PRIMARY_RED_COLOR} />}
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.create_account'}
        theme={theme}
        onPress={() => navigate('CreateAccountFromWalletScreenPageOne')}
        iconImage={
          <Icon name={Icons.CREATE_ACCOUNT} color={PRIMARY_RED_COLOR} />
        }
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.manage'}
        theme={theme}
        onPress={() => navigate('AccountManagementScreen')}
        iconImage={<Icon name={Icons.ACCOUNT_KEY} color={PRIMARY_RED_COLOR} />}
      />
      <MenuItem
        labelTranslationKey={'navigation.export_accounts_qr'}
        theme={theme}
        onPress={() => navigate('ExportAccountsQRScreen')}
        iconImage={<Icon name={Icons.SCANNER} color={PRIMARY_RED_COLOR} />}
      />
    </View>
  );
};

export default Accounts;
