import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import DrawerButton from 'components/ui/DrawerButton';
import AccountManagement from 'screens/hive/settings/AccountManagement';

import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountManagementScreen"
        component={AccountManagement}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          title: translate('navigation.manage'),
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
