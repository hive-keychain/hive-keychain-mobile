import {createStackNavigator} from '@react-navigation/stack';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import Governance from 'screens/hive/governance/Governance';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GovernanceScreen"
        component={Governance}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          title: translate('navigation.governance'),
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
