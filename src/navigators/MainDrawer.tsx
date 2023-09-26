import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {MainDrawerStackParam} from './MainDrawer.types';
import AccountManagementStack from './mainDrawerStacks/AccountManagement';
import AddAccountStack from './mainDrawerStacks/AddAccount';
import CreateAccount from './mainDrawerStacks/CreateAccount';
import GovernanceStack from './mainDrawerStacks/GovernanceStack';

const Drawer = createDrawerNavigator<MainDrawerStackParam>();

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Drawer.Navigator
      drawerStyle={styles.drawer}
      hideStatusBar
      drawerPosition="left"
      drawerContentOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: getColors(theme).secondaryText,
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    drawer: {
      backgroundColor: getColors(theme).menuHamburguerBg,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      height: '95%',
      bottom: 10,
      top: undefined,
    },
  });
