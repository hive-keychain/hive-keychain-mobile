import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import CreateAccount from 'screens/hive/CreateAccount';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {noHeader} from 'utils/navigation';
import {SignupStackParamList} from './Signup.types';

const Stack = createStackNavigator<SignupStackParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IntroductionScreen"
        options={noHeader}
        component={Introduction}
      />
      <Stack.Screen
        name="SignupScreen"
        options={{...noHeader, animationEnabled: false}}
        component={Signup}
      />
      <Stack.Screen
        name="CreateAccountScreen"
        options={noHeader}
        component={CreateAccount}
      />
      <Stack.Screen
        name="AddAccountByKeyScreen"
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
        component={AddAccountByKey}
      />
      <Stack.Screen
        name="ScanQRScreen"
        options={({navigation}) => ({
          headerBackTitle: translate('navigation.add_account'),
          headerTitle: () => <NavigatorTitle title="navigation.add_account" />,
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerRightContainerStyle: styles.paddingRight,
          animationEnabled: false,
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
        component={ScanQR}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    paddingRight: {paddingRight: HEADER_ICON_MARGIN},
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
  });
