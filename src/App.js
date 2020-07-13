import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Introduction from './screens/Introduction';
import Signup from './screens/Signup';
import Unlock from './screens/Unlock';
import CreateAccount from './screens/CreateAccount';
import Main from './screens/Main';
import AddAccount from './screens/addAccounts/AddAccount';
import AddAccountByKey from './screens/addAccounts/AddAccountByKey';
import {setNavigator} from './navigationRef';
import {connect} from 'react-redux';

const Stack = createStackNavigator();

const App = ({hasAccounts, auth}) => {
  console.log('app');
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
          <Stack.Screen name="AddAccountScreen" component={AddAccount} />
          <Stack.Screen
            name="AddAccountByKeyScreen"
            component={AddAccountByKey}
          />
        </Stack.Navigator>
      );
    } else if (!auth.mk) {
      return (
        <Stack.Navigator>
          <Stack.Screen name="UnlockScreen" component={Unlock} />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator>
          <Stack.Screen name="MainScreen" component={Main} />
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
