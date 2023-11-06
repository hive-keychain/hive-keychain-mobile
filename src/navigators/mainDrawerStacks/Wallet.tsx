import {createStackNavigator} from '@react-navigation/stack';
import KeychainLogoDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React, {useContext} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Wallet from 'screens/hive/wallet/Main';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {Width} from 'utils/common.types';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useContext(ThemeContext);
  const {width} = useWindowDimensions();
  const styles = getStyles({width}, theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          title: '',
          header: () => {
            return (
              <View style={[styles.headerStyle]}>
                <View style={styles.firstRowContainer}>
                  {theme === Theme.LIGHT ? (
                    <KeychainLogoLight {...styles.logo} />
                  ) : (
                    <KeychainLogoDark {...styles.logo} />
                  )}
                </View>
                {/* <View style={[styles.flexRow, styles.spacebetween]}>
                  <DrawerButton navigation={navigation} theme={theme} />
                  <View style={styles.flexRow}>
                    <Claim />
                    <StatusIndicator />
                    <CustomPickerItem
                      theme={theme}
                      additionalContainerStyle={styles.userPicker}
                    />
                  </View>
                </View> */}
              </View>
            );
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

const getStyles = ({width}: Width, theme: Theme) =>
  //TODO cleanup bellow
  StyleSheet.create({
    headerStyle: {
      height: 'auto',
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    left: {marginHorizontal: 0.05 * width},
    containerRight: {flexDirection: 'row', width: '60%', marginTop: 13},
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spacebetween: {justifyContent: 'space-between'},
    qr: {marginLeft: 12},
    containerLeft: {
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      marginTop: 13,
    },
    logo: {
      width: 100,
    },
    firstRowContainer: {
      marginLeft: 10,
    },
    userPicker: {
      width: '60%',
    },
  });
