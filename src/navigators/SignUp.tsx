import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import ChooseAccountOption from 'screens/ChooseAccount';
import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import CreateAccount from 'screens/hive/createAccounts/CreateAccount';
import CreateAccountPeerToPeer from 'screens/hive/createAccountsPeerToPeer/CreateAccountPeerToPeer';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {SignupStackParamList} from './Signup.types';
import TemplateStack from './mainDrawerStacks/TemplateStack';

const Stack = createStackNavigator<SignupStackParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets());
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IntroductionScreen"
        options={noHeader}
        component={Introduction}
      />
      <Stack.Screen
        name="SignupScreen"
        options={{...noHeader, animationEnabled: false}}
        component={Signup}
      />
      <Stack.Screen
        name="ChooseAccountOptionsScreen"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerBackTitle: translate('navigation.choose_first_account'),
          headerTitle: () => (
            <NavigatorTitle title="navigation.choose_first_account" />
          ),
          animationEnabled: false,
          headerLeft: null,
        })}
        component={ChooseAccountOption}
      />
      <Stack.Screen
        name="CreateAccountScreen"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerBackTitle: translate('navigation.create_an_account'),
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title="navigation.create_an_account" />
          ),
          animationEnabled: false,
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
        component={CreateAccount}
      />
      <Stack.Screen
        name="TemplateStackScreen"
        options={{...noHeader, animationEnabled: false}}
        component={TemplateStack}
      />
      <Stack.Screen
        name="CreateAccountPeerToPeerScreen"
        options={({navigation}) => ({
          headerBackTitle: translate('navigation.create_account_peer_to_peer'),
          headerTitle: () => (
            <NavigatorTitle title="navigation.create_account_peer_to_peer" />
          ),
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerRightContainerStyle: styles.paddingRight,
          animationEnabled: false,
          headerRight: () => {
            return (
              <MoreInformation type={Info.ACCOUNT_CREATION_PEER_TO_PEER} />
            );
          },
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
        component={CreateAccountPeerToPeer}
      />
      <Stack.Screen
        name="AddAccountByKeyScreen"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          animationEnabled: false,
          headerBackTitle: translate('navigation.choose_an_existing_account'),
          headerTitle: () => (
            <NavigatorTitle title="navigation.choose_an_existing_account" />
          ),
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
        component={AddAccountByKey}
      />
      <Stack.Screen
        name="ScanQRScreen"
        options={({navigation}) => ({
          headerBackTitle: translate('navigation.add_account'),
          headerTitle: () => <NavigatorTitle title="navigation.add_account" />,
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerRightContainerStyle: styles.paddingRight,
          animationEnabled: false,
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
        component={WalletQRScanner}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    paddingRight: {paddingRight: HEADER_ICON_MARGIN},
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
  });
