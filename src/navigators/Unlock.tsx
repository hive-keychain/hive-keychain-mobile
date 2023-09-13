import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Unlock from 'screens/Unlock';
import {UnlockStackParamList} from './Unlock.types';

const Stack = createStackNavigator<UnlockStackParamList>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UnlockScreen"
        component={Unlock}
        options={{
          title: '',
          //TODO bellow remove after refactoring if there is no footerRight option.
          // headerRight: () => <InfoPIN />,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
