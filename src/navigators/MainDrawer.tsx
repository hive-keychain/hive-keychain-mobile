import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React, {useState} from 'react';
import {NativeEventEmitter, NativeModules, StyleSheet} from 'react-native';
import {translate} from 'utils/localize';
import {WidgetUtils} from 'utils/widget.utils';
import {MainDrawerStackParam} from './MainDrawer.types';
import AccountManagementStack from './mainDrawerStacks/AccountManagement';
import AddAccountStack from './mainDrawerStacks/AddAccount';
import CreateAccount from './mainDrawerStacks/CreateAccount';
import GovernanceStack from './mainDrawerStacks/GovernanceStack';

const Drawer = createDrawerNavigator<MainDrawerStackParam>();

export default () => {
  //TODO later on move to useWidgetNativeEvent but -> return eventReceived.
  const navigation = useNavigation();
  const [eventReceived, setEventReceived] = useState(null);

  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('command_event', (event) => {
      // console.log('within hook ', {event, props: Object.values(event).length});
      if (event && Object.values(event).length >= 1) {
        setEventReceived(event);
      }
    });
    console.log('within hook ', {eventReceived});
    if (eventReceived) {
      if (eventReceived.currency) {
        const {currency: command} = eventReceived;
        console.log({command}); //TODO remove line
        if (command === 'update_values') {
          WidgetUtils.sendWidgetData();
        }
      } else if (eventReceived.navigateTo) {
        const {navigateTo: route} = eventReceived;
        console.log({route}); //TODO remove line
        navigation.navigate(route);
      }
    }
    return () => {
      eventListener.remove();
    };
  }, [eventReceived]);
  // Until here to move

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
