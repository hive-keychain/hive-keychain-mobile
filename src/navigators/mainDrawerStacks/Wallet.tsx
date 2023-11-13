import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import KeychainLogoDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import {CustomFilterBox} from 'components/form/CustomFilterBox';
import Icon from 'components/hive/Icon';
import {WalletHistoryComponent} from 'components/hive/Wallet-history-component';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Wallet from 'screens/hive/wallet/Main';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';

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
      <Stack.Screen
        name="WalletHistoryScreen"
        component={({route}) => {
          return <WalletHistoryComponent {...route.params} />;
        }}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.wallet_history'),
          cardStyle: styles.cardStyle,
          headerRight: () => (
            <Icon
              name={'settings-4'}
              theme={theme}
              onClick={() =>
                navigation.navigate('ModalScreen', {
                  name: 'FilterScreen',
                  modalContent: (
                    <CustomFilterBox
                      theme={theme}
                      headerText={translate('wallet.filter.filter_title')}
                      usingFilter="wallet"
                    />
                  ),
                  fixedHeight: 0.7,
                  additionalWrapperFixedStyle: styles.wrapperFixed,
                  modalPosition: undefined,
                  modalContainerStyle: styles.modalContainer,
                  renderButtonElement: (
                    <View style={styles.overlayButtonElement}>
                      <Icon
                        name="settings-4"
                        theme={theme}
                        additionalContainerStyle={styles.iconButton}
                      />
                      <Icon theme={theme} name="polygon_down" />
                    </View>
                  ),
                })
              }
              additionalContainerStyle={[styles.iconButton]}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
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
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    cardStyle: {
      paddingHorizontal: 15,
      backgroundColor: getColors(theme).primaryBackground,
    },
    wrapperFixed: {
      top: 55,
      bottom: undefined,
      left: undefined,
      right: 10,
    },
    modalContainer: {
      width: '80%',
      alignSelf: 'flex-end',
      backgroundColor: 'none',
      borderWidth: 0,
    },
    overlayButtonElement: {
      position: 'absolute',
      top: 10,
      bottom: undefined,
      right: 0,
      left: undefined,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButton: {
      paddingHorizontal: 19,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: getColors(theme).secondaryCardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderRadius: 26,
    },
    marginRight: {
      marginRight: 16,
    },
  });
