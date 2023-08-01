import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React from 'react';
import {StyleSheet} from 'react-native';
import {translate} from 'utils/localize';
import {MainDrawerStackParam} from './MainDrawer.types';
import AccountManagementStack from './mainDrawerStacks/AccountManagement';
import AddAccountStack from './mainDrawerStacks/AddAccount';
import CreateAccount from './mainDrawerStacks/CreateAccount';
import GovernanceStack from './mainDrawerStacks/GovernanceStack';

const Drawer = createDrawerNavigator<MainDrawerStackParam>();

export default () => {
  return (
    <Drawer.Navigator
      drawerStyle={styles.drawer}
      hideStatusBar
      drawerPosition="right"
      drawerContentOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
        activeBackgroundColor: '#A3112A',
        itemStyle: {marginHorizontal: 0, borderRadius: 0, paddingLeft: 10},
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="WALLET" component={WalletStack} />
      <Drawer.Screen
        name="BrowserScreen"
        options={{
          title: translate('navigation.browser'),
        }}
        component={BrowserStack}
      />
      <Drawer.Screen
        name="Governance"
        options={{
          title: translate('navigation.governance'),
          unmountOnBlur: true,
        }}
        component={GovernanceStack}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={SettingsStack}
        options={{
          title: translate('navigation.settings'),
        }}
      />
      <Drawer.Screen
        name="ABOUT"
        options={{
          title: translate('navigation.about'),
        }}
        component={AboutStack}
      />
      <Drawer.Screen
        name="AccountManagementScreen"
        component={AccountManagementStack}
      />
      <Drawer.Screen name="AddAccountStack" component={AddAccountStack} />
      <Drawer.Screen name="CreateAccountScreen" component={CreateAccount} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#000000',
  },
});
