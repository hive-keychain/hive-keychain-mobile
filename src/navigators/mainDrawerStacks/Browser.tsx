import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Browser from 'screens/Browser';
import DrawerButton from 'components/ui/DrawerButton';
import BrowserHeader from 'components/browser/Header.js';
const Stack = createStackNavigator();

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
