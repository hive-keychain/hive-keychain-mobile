import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import {CustomFilterBox} from 'components/form/CustomFilterBox';
import {WalletHistoryComponent} from 'components/history/WalletHistoryComponent';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Wallet from 'screens/hive/wallet/Main';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles({width, height}, theme, useSafeAreaInsets());

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          headerStyle: styles.noStyle,
          headerTransparent: true,
          animationEnabled: false,
          title: '',
        })}
      />
      <Stack.Screen
        name="ScanQRFromWalletScreen"
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'components.infoWalletQR.title'} />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          animationEnabled: false,
          headerRight: () => {
            return <MoreInformation type={Info.QR_WALLET} />;
          },
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => {
                (navigation as DrawerNavigationHelpers).navigate(
                  'WalletScreen',
                );
              }}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        component={WalletQRScanner}
      />
      <Stack.Screen
        name="WalletHistoryScreen"
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          animationEnabled: false,
          headerTitle: () => (
            <NavigatorTitle title={'navigation.wallet_history'} />
          ),
          cardStyle: styles.cardStyle,
          headerRight: () => (
            <Icon
              name={Icons.SETTINGS_4}
              theme={theme}
              onPress={() =>
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
                  additionalWrapperFixedStyle: [styles.wrapperFixed],
                  modalPosition: undefined,
                  modalContainerStyle: styles.modalContainer,
                  renderButtonElement: (
                    <View style={styles.overlayButtonElement}>
                      <Icon
                        name={Icons.SETTINGS_4}
                        theme={theme}
                        additionalContainerStyle={styles.iconButton}
                      />
                      <Icon theme={theme} name={Icons.CARRET_UP} />
                    </View>
                  ),
                })
              }
              additionalContainerStyle={[styles.iconButton, styles.marginRight]}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.navigate('WalletScreen')}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
        })}
        component={WalletHistoryComponent}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  {width, height}: Dimensions,
  theme: Theme,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    noStyle: {
      height: 0,
      borderWidth: 0,
      elevation: 0,
    },
    headerStyle: {
      height: STACK_HEADER_HEIGHT + insets.top,
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    wrapperFixed: {
      top: 55,
      bottom: undefined,
      left: undefined,
      right: 10,
      justifyContent: 'flex-end',
      width: 'auto',
    },
    modalContainer: {
      width: 'auto',
      backgroundColor: 'none',
      borderWidth: 0,
    },
    overlayButtonElement: {
      position: 'absolute',
      top: 10 + insets.top,
      bottom: undefined,
      right: 0,
      left: undefined,
      marginRight: HEADER_ICON_MARGIN,
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
      marginRight: HEADER_ICON_MARGIN,
    },
    marginLeft: {
      marginLeft: HEADER_ICON_MARGIN,
    },
    headerRightContainer: {
      marginRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
