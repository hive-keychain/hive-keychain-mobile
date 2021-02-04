import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';

import MoreInformation from 'components/infoButtons/MoreInfo';
import {headerTransparent} from 'utils/navigation';
const AccountStack = createStackNavigator();

export default () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        options={{
          title: 'ADD ACCOUNT',
          headerRight: () => {
            return <MoreInformation type="moreInfo" />;
          },
          headerTintColor: 'white',
          headerTransparent,
        }}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          headerTransparent,
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type="qr" />;
          },
        }}
        component={ScanQR}
      />
    </AccountStack.Navigator>
  );
};
