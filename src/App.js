import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import Unlock from 'screens/Unlock';
import CreateAccount from 'screens/CreateAccount';
import Transfer from 'screens/wallet/Transfer';
import Wallet from 'screens/wallet/Main';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';
import MoreInformation from 'components/MoreInformation';
import InfoQR from 'components/InfoQR';
import ForgotPIN from 'components/ForgotPIN';
import {setNavigator} from './navigationRef';

const Stack = createStackNavigator();

const App = ({hasAccounts, auth}) => {
  const headerTransparent = {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  };

  const renderNavigator = () => {
    if (!hasAccounts) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="IntroductionScreen"
            options={{headerShown: false}}
            component={Introduction}
          />
          <Stack.Screen
            name="SignupScreen"
            options={{headerShown: false}}
            component={Signup}
          />
          <Stack.Screen
            name="CreateAccountScreen"
            options={{headerShown: false}}
            component={CreateAccount}
          />
          <Stack.Screen
            name="AddAccountByKeyScreen"
            options={{
              title: 'ADD ACCOUNT',
              headerRight: () => {
                return <MoreInformation />;
              },
              headerTintColor: 'white',
              headerTransparent,
            }}
            component={AddAccountByKey}
          />
          <Stack.Screen
            name="ScanQRScreen"
            options={{
              headerTransparent,
              headerTintColor: 'white',
              title: '',
              headerRight: () => {
                return <InfoQR />;
              },
            }}
            component={ScanQR}
          />
        </Stack.Navigator>
      );
    } else if (!auth.mk) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="UnlockScreen"
            component={Unlock}
            options={{
              title: '',
              headerRight: () => {
                return <ForgotPIN />;
              },
              headerTintColor: 'white',
              headerTransparent,
            }}
          />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator>
          <Stack.Screen name="WalletScreen" component={Wallet} />
          <Stack.Screen
            name="TransferScreen"
            component={Transfer}
            options={{
              headerTintColor: 'white',
              headerTransparent,
              title: 'TRANSFER FUNDS',
            }}
          />
        </Stack.Navigator>
      );
    }
  };

  return (
    <NavigationContainer ref={(navigator) => setNavigator(navigator)}>
      {renderNavigator()}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {hasAccounts: state.hasAccounts.has, auth: state.auth};
};

export default connect(mapStateToProps)(App);
