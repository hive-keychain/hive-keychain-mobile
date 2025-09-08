import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React from 'react';
import {StyleSheet} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import CreateAccountConfirmation from 'screens/hive/createAccounts/CreateAccountConfirmation';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {MainDrawerStackParam} from './MainDrawer.types';
import AccountManagementStack from './mainDrawerStacks/AccountManagement';
import Accounts from './mainDrawerStacks/Accounts';
import AddAccount from './mainDrawerStacks/AddAccount';
import CreateAccount from './mainDrawerStacks/CreateAccount';
import ExportAccountsQR from './mainDrawerStacks/ExportAccountsQR';
import GovernanceStack from './mainDrawerStacks/GovernanceStack';
import GovernanceToggleWitnessStack from './mainDrawerStacks/GovernanceToggleWitnessStack';
import HPDelegationsStack from './mainDrawerStacks/HPDelegationsStack';
import Help from './mainDrawerStacks/Help';
import Operation from './mainDrawerStacks/Operation';
import PendingConversionsStack from './mainDrawerStacks/PendingConversionsStack';
import PendingSavingsStack from './mainDrawerStacks/PendingSavingsStack';
import RcDelegationsStack from './mainDrawerStacks/RcDelegationsStack';
import SwapBuyStack from './mainDrawerStacks/SwapBuyStack';
import SwapConfirmStack from './mainDrawerStacks/SwapConfirmStack';
import SwapHistory from './mainDrawerStacks/SwapHistory';
import TokenDelegationsStack from './mainDrawerStacks/TokenDelegationsStack';
import TokenSettingsStack from './mainDrawerStacks/TokenSettingsStack';
import Tokens from './mainDrawerStacks/Tokens';
import TokensHistory from './mainDrawerStacks/TokensHistory';

const Drawer = createDrawerNavigator<MainDrawerStackParam>();

export default () => {
  const theme = useThemeContext()?.theme || Theme.LIGHT;
  const styles = getStyles(theme);

  return (
    <Drawer.Navigator
      id={undefined}
      screenOptions={{
        swipeEnabled: false,
        drawerItemStyle: styles.item,
        drawerPosition: 'left',
        drawerStyle: styles.drawer,
        drawerType: 'front',
        drawerInactiveTintColor: getColors(theme).secondaryText,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="WALLET" component={WalletStack} options={noHeader} />
      <Drawer.Screen
        name="BrowserScreen"
        options={{
          title: translate('navigation.browser'),
          ...noHeader,
        }}
        component={BrowserStack}
      />

      <Drawer.Screen
        name="Governance"
        options={{
          title: translate('navigation.governance'),
          popToTopOnBlur: true,
          ...noHeader,
        }}
        component={GovernanceStack}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={SettingsStack}
        options={{
          title: translate('navigation.settings'),
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="ABOUT"
        options={{
          title: translate('navigation.about'),
          ...noHeader,
        }}
        component={AboutStack}
      />
      <Drawer.Screen
        name="Help"
        options={{
          title: translate('navigation.help'),
          ...noHeader,
        }}
        component={Help}
      />
      <Drawer.Screen name="Accounts" component={Accounts} />
      <Drawer.Screen
        name="AccountManagementScreen"
        component={AccountManagementStack}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="ExportAccountsQRScreen"
        component={ExportAccountsQR}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen name="AddAccountStack" component={AddAccount} />
      <Drawer.Screen
        name="CreateAccountScreen"
        component={CreateAccount}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
      />
      <Drawer.Screen name="Tokens" component={Tokens} />
      <Drawer.Screen name="TokensHistory" component={TokensHistory} />
      <Drawer.Screen
        name="Operation"
        component={Operation}
        options={{
          popToTopOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="TokenSettings"
        component={TokenSettingsStack}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
          }}
      />
      <Drawer.Screen
        name="SwapBuyStack"
        component={SwapBuyStack}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
      />
      <Drawer.Screen name="SwapHistory" component={SwapHistory} />
      {/* Newly added logical screens reachable via navigate() */}
      <Drawer.Screen
        name="TokenDelegations"
        component={TokenDelegationsStack}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen name="HPDelegations" component={HPDelegationsStack} options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen name="PendingSavings" component={PendingSavingsStack} options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="PendingConversions"
        component={PendingConversionsStack}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen name="RcDelegations" component={RcDelegationsStack} options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen name="SwapConfirm" component={SwapConfirmStack} options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="CreateAccountConfirmationScreen"
        component={CreateAccountConfirmation}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="ToggleWitness"
        component={GovernanceToggleWitnessStack}
        options={{
          ...noHeader,
        }}
      />
    </Drawer.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    drawer: {
      backgroundColor: getColors(theme).menuHamburguerBg,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      width: '70%',
      top: initialWindowMetrics.insets.top + 10,
      bottom: initialWindowMetrics.insets.bottom + 20,
    },
    item: {marginHorizontal: 0, borderRadius: 0, paddingLeft: 10},
    contentContainer: {
      flexGrow: 1,
    },
  });
