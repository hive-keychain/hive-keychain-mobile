import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import DrawerButton from 'components/ui/DrawerButton';
import Settings from 'screens/hive/settings/Settings';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={Settings}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          title: translate('navigation.settings'),
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
