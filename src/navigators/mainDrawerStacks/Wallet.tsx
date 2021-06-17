import {createStackNavigator} from '@react-navigation/stack';
import Hive from 'assets/wallet/hive.svg';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Wallet from 'screens/wallet/Main';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {width} = useWindowDimensions();

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
          headerRight: () => <DrawerButton navigation={navigation} />,

          headerLeft: () => {
            return <Hive style={styles({width}).left} />;
          },
        })}
      />
    </Stack.Navigator>
  );
};

const styles = ({width}: Width) =>
  StyleSheet.create({
    left: {marginHorizontal: 0.05 * width},
  });
