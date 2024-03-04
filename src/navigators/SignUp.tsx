import {createStackNavigator} from '@react-navigation/stack';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet} from 'react-native';
import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import CreateAccount from 'screens/hive/CreateAccount';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {SignupStackParamList} from './Signup.types';

const Stack = createStackNavigator<SignupStackParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  //TODO bellow intro related, add animation.
  //  ref: You said you did all the other points, but im checking the first one and I dont see any animation between the elements of the introduction
  // On most apps it looks like something like this :
  // https://medium.com/backticks-tildes/create-a-custom-app-intro-slider-in-react-native-4308fae83ad1

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
          headerRightContainerStyle: styles.paddingRight,
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
    paddingRight: {paddingRight: HEADER_ICON_MARGIN},
  });
