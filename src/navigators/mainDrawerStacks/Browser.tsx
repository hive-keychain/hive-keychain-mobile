import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Browser from 'screens/Browser';
import {BrowserParamList} from './Browser.types';
const Stack = createStackNavigator<BrowserParamList>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BrowserScreen"
        component={Browser}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
