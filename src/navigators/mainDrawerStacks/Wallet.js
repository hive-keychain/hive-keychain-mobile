import React from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerButton from 'components/ui/DrawerButton';

import Wallet from 'screens/wallet/Main';
import Hive from 'assets/wallet/hive.svg';

const Stack = createStackNavigator();

export default () => {
  const {height, width} = useWindowDimensions();

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
          title: 'WALLET',
          headerTintColor: 'white',
          headerRight: () => <DrawerButton navigation={navigation} />,

          headerLeft: () => {
            return <Hive style={styles(width, height).left} />;
          },
        })}
      />
    </Stack.Navigator>
  );
};

const styles = (width, height) =>
  StyleSheet.create({
    left: {marginHorizontal: 0.05 * width},
  });
