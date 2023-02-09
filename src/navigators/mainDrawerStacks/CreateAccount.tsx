import {createStackNavigator} from '@react-navigation/stack';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {translate} from 'utils/localize';
import CreateAccount from '../../screens/createAccounts/CreateAccounts';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccount}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitleAlign: 'left',
          title: translate('navigation.create_account'),
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};
