import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Unlock from 'screens/Unlock';
import {iosHorizontalSwipeBack} from 'utils/navigation.utils';
import {UnlockStackParamList} from './Unlock.types';

const Stack = createStackNavigator<UnlockStackParamList>();

export default () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={iosHorizontalSwipeBack}>
      <Stack.Screen
        name="UnlockScreen"
        component={Unlock}
        options={{
          title: '',
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
