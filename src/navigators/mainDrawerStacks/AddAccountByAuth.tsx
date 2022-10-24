import {createStackNavigator} from '@react-navigation/stack';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddAccountByAuth from 'screens/addAccounts/AddAccountByAuth';
import {translate} from 'utils/localize';
import {headerTransparent} from 'utils/navigation';
import {AddAccountFromWalletParamList} from './AddAccount.types';

const AccountByAuthStack = createStackNavigator<
  AddAccountFromWalletParamList
>();

export default () => {
  return (
    <AccountByAuthStack.Navigator>
      <AccountByAuthStack.Screen
        name="AddAccountFromWalletScreen"
        //@ts-ignore : both headerRight and headerTransparent are needed here
        options={({navigation}) => ({
          headerRight: () => {
            return (
              <View style={styles.buttonsContainer}>
                <MoreInformation type={Info.KEYS} />
                <DrawerButton navigation={navigation} />
              </View>
            );
          },
          headerTintColor: 'white',
          title: translate('navigation.add_account_by_auth'),
          headerTitleAlign: 'left',
          headerTransparent,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByAuth} //TODO create AddAccountByAuth component.
      />
    </AccountByAuthStack.Navigator>
  );
};

const styles = StyleSheet.create({buttonsContainer: {flexDirection: 'row'}});
