import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import DrawerButton from 'components/ui/DrawerButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import AddAccountByAuth from 'screens/hive/addAccounts/AddAccountByAuth';
import AddAccountByKey from 'screens/hive/addAccounts/AddAccountByKey';
import ScanQR from 'screens/hive/addAccounts/ScanQR';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import {AddAccountFromWalletParamList} from './AddAccount.types';

const AccountStack = createStackNavigator<AddAccountFromWalletParamList>();

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        //@ts-ignore : both headerRight and headerTransparent are needed here
        options={({navigation}) => ({
          headerLeft: () => (
            <Icon
              name="arrow_left"
              theme={theme}
              additionalContainerStyle={styles.marginLeft}
              onClick={() => navigation.goBack()}
            />
          ),
          headerRight: () => (
            <MoreInformation
              additionalButtonStyle={styles.marginRight}
              theme={theme}
              type={Info.KEYS}
            />
          ),

          title: translate('navigation.add_account'),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          title: '',
          headerLeft: () => (
            <Icon
              name="arrow_left"
              theme={theme}
              additionalContainerStyle={styles.marginLeft}
              onClick={() => goBack()}
            />
          ),
          headerRight: () => {
            return (
              <MoreInformation
                additionalButtonStyle={styles.marginRight}
                type={Info.QR_ACCOUNT}
                theme={theme}
              />
            );
          },
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
        component={ScanQR}
      />
      <AccountStack.Screen
        name="AddAccountFromWalletScreenByAuth"
        //@ts-ignore : both headerRight and headerTransparent are needed here
        options={({navigation}) => ({
          headerLeft: () => (
            <Icon
              name="arrow_left"
              theme={theme}
              additionalContainerStyle={styles.marginLeft}
              onClick={() => navigation.goBack()}
            />
          ),
          headerRight: () => <DrawerButton navigation={navigation} />,
          title: translate('navigation.add_account_by_auth'),
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByAuth}
      />
    </AccountStack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    marginLeft: {marginLeft: 16},
    marginRight: {marginRight: 16},
  });
