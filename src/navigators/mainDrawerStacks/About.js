import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import About from 'screens/settings/About';
import DrawerButton from 'components/ui/DrawerButton';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AboutScreen"
        component={About}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          title: 'ABOUT',
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
