import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet} from 'react-native';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';

import DrawerButton from 'components/ui/DrawerButton';
import MoreInformation from 'components/infoButtons/MoreInfo';

import {headerTransparent} from 'utils/navigation';
import {translate} from 'utils/localize';

const AccountStack = createStackNavigator();

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
          title: translate('navigation.add_account'),
          headerTitleAlign: 'left',
          headerTransparent,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          headerStyle: {backgroundColor: 'black'},
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
