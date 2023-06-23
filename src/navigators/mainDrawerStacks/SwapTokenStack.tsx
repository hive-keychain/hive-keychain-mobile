import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SwapTokens from 'screens/swapTokens/SwapTokens';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwapTokensScreen"
        component={SwapTokens}
        // options={}
      />
    </Stack.Navigator>
  );
};
