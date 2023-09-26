import {createStackNavigator} from '@react-navigation/stack';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import CreateAccountStepOne from 'screens/hive/createAccounts/create-account-step-one/CreateAccountStepOne';
import CreateAccountStepTwo from 'screens/hive/createAccounts/create-account-step-two/CreateAccountStepTwo';
import {translate} from 'utils/localize';
import {CreateAccountFromWalletParamList} from './CreateAccount.types';

const CreateAccountStack = createStackNavigator<
  CreateAccountFromWalletParamList
>();

export default () => {
  return (
    <CreateAccountStack.Navigator>
      <CreateAccountStack.Screen
        name="CreateAccountFromWalletScreenPageOne"
        component={CreateAccountStepOne}
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
      <CreateAccountStack.Screen
        name="CreateAccountFromWalletScreenPageTwo"
        component={CreateAccountStepTwo}
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
    </CreateAccountStack.Navigator>
  );
};
