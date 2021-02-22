import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import CreateAccount from 'screens/CreateAccount';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';

import MoreInformation from 'components/infoButtons/MoreInfo';

import {headerTransparent, noHeader} from 'utils/navigation';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IntroductionScreen"
        options={noHeader}
        component={Introduction}
      />
      <Stack.Screen name="SignupScreen" options={noHeader} component={Signup} />
      <Stack.Screen
        name="CreateAccountScreen"
        options={noHeader}
        component={CreateAccount}
      />
      <Stack.Screen
        name="AddAccountByKeyScreen"
        options={{
          title: translate('navigation.add_account'),
          headerRight: () => <MoreInformation type="moreInfo" />,
          headerTintColor: 'white',
          headerTransparent,
        }}
        component={AddAccountByKey}
      />
      <Stack.Screen
        name="ScanQRScreen"
        options={{
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type="qr" />;
          },
        }}
        component={ScanQR}
      />
    </Stack.Navigator>
  );
};
