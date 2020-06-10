import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from './screens/Signup';
import AddAccount from './screens/addAccounts/AddAccount';
import {setNavigator} from './navigationRef';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={(navigator) => setNavigator(navigator)}>
      <Stack.Navigator>
        <Stack.Screen name="SignupScreen" component={Signup} />
        <Stack.Screen name="AddAccountScreen" component={AddAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
