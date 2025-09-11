import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from 'components/drawer/Content';
import AboutStack from 'navigators/mainDrawerStacks/About';
import BrowserStack from 'navigators/mainDrawerStacks/Browser';
import SettingsStack from 'navigators/mainDrawerStacks/Settings';
import WalletStack from 'navigators/mainDrawerStacks/Wallet';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation.utils';
import {MainDrawerStackParam} from './MainDrawer.types';
import Accounts from './mainDrawerStacks/Accounts';
import GovernanceStack from './mainDrawerStacks/GovernanceStack';
import Help from './mainDrawerStacks/Help';
import Operation from './mainDrawerStacks/Operation';
import SwapBuyStack from './mainDrawerStacks/SwapBuyStack';
import TokenDelegationsStack from './mainDrawerStacks/TokenDelegationsStack';
import TokenSettingsStack from './mainDrawerStacks/TokenSettingsStack';
import Tokens from './mainDrawerStacks/Tokens';
import TokensHistory from './mainDrawerStacks/TokensHistory';

const Drawer = createDrawerNavigator<MainDrawerStackParam>();

export default () => {
  const theme = useThemeContext()?.theme || Theme.LIGHT;
  const styles = getStyles(theme);
  const previousRouteRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);

  const withReset = (Component: React.ComponentType<any>, resetKey: number) => {
    return function Wrapped(props: any) {
      return <Component key={resetKey} {...props} />;
    };
  };

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
      screenListeners={{
        state: (e) => {
          const currentRoute = e.data.state?.routes[e.data.state.index]?.name;
          if (!previousRouteRef.current) {
            previousRouteRef.current = currentRoute;
          }
          if (currentRoute !== previousRouteRef.current) {
            if (currentRoute === 'WALLET') {
              setResetKey((prev) => prev + 1);
            }
            previousRouteRef.current = currentRoute;
          }
        },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="WALLET" component={WalletStack} options={noHeader} />
      <Drawer.Screen
        name="Browser"
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
        component={withReset(GovernanceStack, resetKey)}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={withReset(SettingsStack, resetKey)}
        options={{
          title: translate('navigation.settings'),
          popToTopOnBlur: true,
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
      <Drawer.Screen
        name="Accounts"
        component={withReset(Accounts, resetKey)}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="Tokens"
        component={Tokens}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="TokensHistory"
        component={TokensHistory}
        options={{
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="Operation"
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
        component={withReset(Operation, resetKey)}
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
        component={withReset(SwapBuyStack, resetKey)}
        options={{
          popToTopOnBlur: true,
          ...noHeader,
        }}
      />
      <Drawer.Screen
        name="TokenDelegations"
        component={TokenDelegationsStack}
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
