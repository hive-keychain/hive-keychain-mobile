import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import {CustomFilterBox} from 'components/form/CustomFilterBox';
import Icon from 'components/hive/Icon';
import {WalletHistoryComponent} from 'components/hive/Wallet-history-component';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import CustomIconButton from 'components/ui/CustomIconButton';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Wallet from 'screens/hive/wallet/Main';
import WalletQRScanner from 'screens/hive/wallet/WalletQRScanner';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CARD_SMALLEST_PADDING} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {
  SMALLEST_SCREEN_HEIGHT_SUPPORTED,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles({width}, theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          title: '',
          headerTransparent: true,
        })}
      />
      <Stack.Screen
        name="ScanQRFromWalletScreen"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('components.infoWalletQR.title'),
          headerRight: () => {
            return (
              <MoreInformation
                theme={theme}
                type={Info.QR_WALLET}
                additionalButtonStyle={styles.marginRight}
              />
            );
          },
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => {
                const nav = navigation as DrawerNavigationHelpers;
                // if (nav.canGoBack()) {
                //   nav.goBack();
                // } else {
                navigation.navigate('WalletScreen');
                // }
              }}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
        })}
        component={WalletQRScanner}
      />
      <Stack.Screen
        name="WalletHistoryScreen"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.wallet_history'),
          cardStyle: styles.cardStyle,
          headerRight: () => (
            <Icon
              name={Icons.SETTINGS_4}
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
                  fixedHeight:
                    height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? 0.85 : 0.7,
                  additionalWrapperFixedStyle: styles.wrapperFixed,
                  modalPosition: undefined,
                  modalContainerStyle: styles.modalContainer,
                  renderButtonElement: (
                    <View style={styles.overlayButtonElement}>
                      <Icon
                        name={Icons.SETTINGS_4}
                        theme={theme}
                        additionalContainerStyle={styles.iconButton}
                      />
                      <Icon theme={theme} name={Icons.POLYGON_DOWN} />
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
              onPress={() => navigation.navigate('WalletScreen')}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        component={WalletHistoryComponent}
      />
    </Stack.Navigator>
  );
};

const getStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    headerStyle: {
      height: 'auto',
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
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
      paddingHorizontal: CARD_SMALLEST_PADDING,
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
  });
