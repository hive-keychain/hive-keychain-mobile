import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import AddAccountByAuth from 'screens/hive/addAccounts/AddAccountByAuth';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';

import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {AddAccountFromWalletParamList} from './AddAccount.types';

const AccountStack = createStackNavigator<AddAccountFromWalletParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        options={({navigation}) => ({
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => <MoreInformation type={Info.KEYS} />,
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
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
        })}
        component={ScanQR}
      />
      <AccountStack.Screen
        name="AddAccountFromWalletScreenByAuth"
        options={({navigation}) => ({
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          title: translate('navigation.add_account_by_auth'),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByAuth}
      />
    </AccountStack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
    marginRight: {marginRight: HEADER_ICON_MARGIN},
    headerRightContainer: {
      marginRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
