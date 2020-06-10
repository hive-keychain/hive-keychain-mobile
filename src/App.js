import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from './screens/Signup';
import AddAccount from './screens/addAccounts/AddAccount';
import AddAccountByKey from './screens/addAccounts/AddAccountByKey';
import {setNavigator} from './navigationRef';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={(navigator) => setNavigator(navigator)}>
      <Stack.Navigator>
        <Stack.Screen name="SignupScreen" component={Signup} />
        <Stack.Screen name="AddAccountScreen" component={AddAccount} />
        <Stack.Screen
          name="AddAccountByKeyScreen"
          component={AddAccountByKey}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
