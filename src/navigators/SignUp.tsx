import {createStackNavigator} from '@react-navigation/stack';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet} from 'react-native';
import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import CreateAccount from 'screens/hive/CreateAccount';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme} from 'src/context/theme.context';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {SignupStackParamList} from './Signup.types';

const Stack = createStackNavigator<SignupStackParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IntroductionScreen"
        options={noHeader}
        component={Introduction}
      />
      <Stack.Screen name="SignupScreen" options={noHeader} component={Signup} />
      <Stack.Screen
        name="CreateAccountScreen"
        options={noHeader}
        component={CreateAccount}
      />
      <Stack.Screen
        name="AddAccountByKeyScreen"
        options={{
          headerShown: false,
        }}
        component={AddAccountByKey}
      />
      <Stack.Screen
        name="ScanQRScreen"
        options={{
          headerBackTitle: translate('navigation.add_account'),
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
        }}
        component={ScanQR}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    marginLeft: {marginLeft: 16},
    marginRight: {marginRight: 16},
  });
