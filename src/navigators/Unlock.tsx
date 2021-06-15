import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import InfoPIN from 'components/infoButtons/ForgotPin';
import React from 'react';
import Unlock from 'screens/Unlock';

type StackParamList = {
  UnlockScreen: undefined;
};

export type UnlockNavProp = StackNavigationProp<StackParamList, 'UnlockScreen'>;

const Stack = createStackNavigator<StackParamList>();

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
