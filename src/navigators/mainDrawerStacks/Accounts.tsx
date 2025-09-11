import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Accounts from 'screens/hive/accounts/Accounts';
import ExportQRAccounts from 'screens/hive/accounts/ExportQRAccounts';
import AddAccountByAuth from 'screens/hive/addAccounts/AddAccountByAuth';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import CreateAccountConfirmation from 'screens/hive/createAccounts/CreateAccountConfirmation';
import CreateAccountStepOne from 'screens/hive/createAccounts/CreateAccountForm';
import AccountManagement from 'screens/hive/settings/AccountManagement';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());

  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="AccountsList"
        component={Accounts}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'common.account'} />,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          animation: 'none',
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          cardStyle: styles.card,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AddAccountFromWalletScreen"
        component={AddAccountByKey}
        options={({navigation}) => ({
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          animation: 'none',
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => <MoreInformation type={Info.KEYS} />,
          headerTitle: () => (
            <NavigatorTitle title={'navigation.add_account'} />
          ),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
        })}
        initialParams={{wallet: true}}
      />
      <Stack.Screen
        name="ScanQRScreen"
        component={ScanQR}
        options={({navigation}) => ({
          headerTitle: () => (
            <NavigatorTitle title={'navigation.add_account'} />
          ),
          animation: 'none',
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
        })}
        initialParams={{wallet: true}}
      />
      <Stack.Screen
        name="AddAccountFromWalletScreenByAuth"
        component={AddAccountByAuth}
        options={({navigation}) => ({
          animation: 'none',
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('WALLET');
              }}
            />
          ),
          headerTitle: () => (
            <NavigatorTitle title={'navigation.add_account_by_auth'} />
          ),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
        })}
        initialParams={{wallet: true}}
      />
      <Stack.Screen
        name="CreateAccountFromWalletScreenPageOne"
        component={CreateAccountStepOne as any}
        options={({navigation}) => ({
          animation: 'none',
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'navigation.create_account'} />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('WALLET');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        initialParams={{wallet: true}}
      />
      <Stack.Screen
        name="AccountManagementScreen"
        component={AccountManagement}
        options={({navigation}) => ({
          animation: 'none',
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'navigation.manage'} />,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => <MoreInformation type={Info.COPY_KEYS} />,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ExportAccountsQRScreen"
        component={ExportQRAccounts}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          animation: 'none',
          headerTitle: () => (
            <NavigatorTitle title={'navigation.export_accounts_qr'} />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CreateAccountConfirmationScreen"
        component={CreateAccountConfirmation}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          animation: 'none',
          headerTitle: () => (
            <NavigatorTitle title={'navigation.export_accounts_qr'} />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    headerRightContainer: {
      paddingRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      paddingLeft: HEADER_ICON_MARGIN,
    },
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      elevation: 0,
      borderWidth: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    card: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    padding: {
      paddingHorizontal: CARD_PADDING_HORIZONTAL,
    },
  });
