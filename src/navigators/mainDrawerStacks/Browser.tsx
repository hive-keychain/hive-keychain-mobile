import {createStackNavigator} from '@react-navigation/stack';
import BrowserHeader from 'components/browser/Header';
import DrawerButton from 'components/ui/DrawerButton';
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
        options={({navigation, route}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          header: () => <BrowserHeader navigation={navigation} route={route} />,
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
