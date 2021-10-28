import {createStackNavigator} from '@react-navigation/stack';
import QRLogo from 'assets/addAccount/icon_scan-qr.svg';
import Hive from 'assets/wallet/hive.svg';
import Claim from 'components/operations/ClaimRewards';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Wallet from 'screens/wallet/Main';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';

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
          headerTitleAlign: 'center',
          title: translate('navigation.wallet'),
          headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.containerRight}>
              <Claim />
              <TouchableOpacity
                style={styles.qr}
                onPress={() => {
                  navigation.navigate('ScanQRScreen', {wallet: true});
                }}>
                <QRLogo width={25} height={25} />
              </TouchableOpacity>
              <DrawerButton navigation={navigation} />
            </View>
          ),

          headerLeft: () => {
            return <Hive style={styles.left} />;
          },
        })}
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
