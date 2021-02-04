import React from 'react';
import {StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import About from 'screens/settings/About';
import DrawerContent from 'components/drawer/Content';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import AccountManagementStack from 'navigators/mainDrawerStacks/AccountManagement';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import AddAccountStack from 'navigators/mainDrawerStacks/AddAccount';
const Drawer = createDrawerNavigator();

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
        name="AccountManagementScreen"
        component={AccountManagementStack}
        options={{
          title: 'MANAGE KEYS',
        }}
      />
      <Drawer.Screen
        name="AddAccountStack"
        options={{title: 'ADD ACCOUNT'}}
        component={AddAccountStack}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={SettingsStack}
        options={{
          title: 'SETTINGS',
        }}
      />
      <Drawer.Screen name="ABOUT" component={About} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#000000',
  },
});
