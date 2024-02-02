import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import AddAccountByAuth from 'screens/hive/addAccounts/AddAccountByAuth';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {AddAccountFromWalletParamList} from './AddAccount.types';

const AccountStack = createStackNavigator<AddAccountFromWalletParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions().height);
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        options={({navigation}) => ({
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={styles.marginLeft}
              onClick={() => navigation.goBack()}
              color={getColors(theme).iconBW}
            />
          ),
          headerRight: () => (
            <MoreInformation
              additionalButtonStyle={[styles.marginRight]}
              theme={theme}
              type={Info.KEYS}
            />
          ),
          title: translate('navigation.add_account'),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onClick={() => navigation.goBack()}
              color={getColors(theme).iconBW}
            />
          ),
          headerRight: () => {
            return (
              <MoreInformation
                additionalButtonStyle={[styles.marginRight]}
                type={Info.QR_ACCOUNT}
                theme={theme}
              />
            );
          },
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
        component={ScanQR}
      />
      <AccountStack.Screen
        name="AddAccountFromWalletScreenByAuth"
        options={({navigation}) => ({
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onClick={() => {
                navigation.goBack();
              }}
              color={getColors(theme).iconBW}
            />
          ),
          headerRight: () => (
            <Icon
              name={Icons.CLOSE_CIRCLE}
              theme={theme}
              onClick={() => navigation.navigate('WALLET')}
              additionalContainerStyle={[styles.marginRight]}
              color={getColors(theme).iconBW}
            />
          ),
          title: translate('navigation.add_account_by_auth'),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByAuth}
      />
    </AccountStack.Navigator>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      height: STACK_HEADER_HEIGHT,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
    marginRight: {marginRight: HEADER_ICON_MARGIN},
  });
