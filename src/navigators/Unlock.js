import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Unlock from 'screens/Unlock';
import InfoPIN from 'components/infoButtons/ForgotPin';
import {headerTransparent} from 'utils/navigation';

const Stack = createStackNavigator();

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
          headerTransparent,
        }}
      />
    </Stack.Navigator>
  );
};
