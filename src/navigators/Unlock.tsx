import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Unlock from 'screens/Unlock';
import {UnlockStackParamList} from './Unlock.types';

const Stack = createStackNavigator<UnlockStackParamList>();

export default () => {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="UnlockScreen"
        component={Unlock}
        options={{
          title: '',
          headerTintColor: 'white',
          headerTransparent: true,
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
};
