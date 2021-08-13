import {createStackNavigator} from '@react-navigation/stack';
import MoreInformation from 'components/infoButtons/MoreInfo';
import React from 'react';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';
import CreateAccount from 'screens/CreateAccount';
import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {SignupStackParamList} from './Signup.types';

const Stack = createStackNavigator<SignupStackParamList>();

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
          headerBackTitle: ' ',
          title: translate('navigation.add_account'),
          headerRight: () => <MoreInformation type="moreInfo" />,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
        component={AddAccountByKey}
      />
      <Stack.Screen
        name="ScanQRScreen"
        options={{
          headerBackTitle: translate('navigation.add_account'),
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
