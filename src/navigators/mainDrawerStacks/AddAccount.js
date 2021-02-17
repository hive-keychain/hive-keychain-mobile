import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet} from 'react-native';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';

import MoreInformation from 'components/infoButtons/MoreInfo';
import {headerTransparent} from 'utils/navigation';
const AccountStack = createStackNavigator();
import DrawerButton from 'components/ui/DrawerButton';

export default () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        options={({navigation}) => ({
          headerRight: () => {
            return (
              <View style={styles.buttonsContainer}>
                <MoreInformation type="moreInfo" />
                <DrawerButton navigation={navigation} />
              </View>
            );
          },
          headerTintColor: 'white',
          title: 'ADD AN ACCOUNT',
          headerTitleAlign: 'left',
          headerTransparent,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          headerTransparent,
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type="qr" />;
          },
        }}
        component={ScanQR}
      />
    </AccountStack.Navigator>
  );
};

const styles = StyleSheet.create({buttonsContainer: {flexDirection: 'row'}});
