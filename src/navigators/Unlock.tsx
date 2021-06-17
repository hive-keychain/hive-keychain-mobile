import {createStackNavigator} from '@react-navigation/stack';
import InfoPIN from 'components/infoButtons/ForgotPin';
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
          headerRight: () => <InfoPIN />,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
