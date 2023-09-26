import {createStackNavigator} from '@react-navigation/stack';
import Hive from 'assets/wallet/hive.svg';
import StatusIndicator from 'components/hive_authentication_service/StatusIndicator';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import Claim from 'components/operations/ClaimRewards';
import HeaderQR from 'components/qr_code/HeaderQR';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Wallet from 'screens/hive/wallet/Main';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Width} from 'utils/common.types';

const Stack = createStackNavigator();

export default () => {
  const {width} = useWindowDimensions();
  const styles = getStyles({width});
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: '#A3112A',
          },
          // headerTitleAlign: 'left',
          title: '',
          // title: translate('navigation.wallet'),
          // headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.containerRight}>
              <Claim />
              <StatusIndicator />
              <HeaderQR navigation={navigation} />
              <DrawerButton navigation={navigation} />
            </View>
          ),

          headerLeft: () => {
            return <Hive style={styles.left} />;
          },
        })}
      />
      <Stack.Screen
        name="ScanQRFromWalletScreen"
        options={{
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type={Info.QR_WALLET} />;
          },
        }}
        component={WalletQRScanner}
      />
    </Stack.Navigator>
  );
};

const getStyles = ({width}: Width) =>
  StyleSheet.create({
    left: {marginHorizontal: 0.05 * width},
    containerRight: {flexDirection: 'row'},
    qr: {marginLeft: 12},
  });
