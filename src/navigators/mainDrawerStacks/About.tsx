import {createStackNavigator} from '@react-navigation/stack';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import About from 'screens/hive/settings/About';
import {translate} from 'utils/localize';

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
          title: translate('navigation.about'),
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
          headerTransparent: true,
        })}
      />
    </Stack.Navigator>
  );
};
