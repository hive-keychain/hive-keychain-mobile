import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import AccountManagementStack from 'navigators/mainDrawerStacks/AccountManagement';
import AddAccountStack from 'navigators/mainDrawerStacks/AddAccount';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React from 'react';
import {StyleSheet} from 'react-native';
import {translate} from 'utils/localize';
import {MainDrawerStackParam} from './MainDrawer.types';
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
        name="AccountManagementScreen"
        component={AccountManagementStack}
        options={{
          title: translate('navigation.manage'),
        }}
      />
      <Drawer.Screen
        name="AddAccountStack"
        options={{title: translate('navigation.add_account')}}
        component={AddAccountStack}
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
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#000000',
  },
});
