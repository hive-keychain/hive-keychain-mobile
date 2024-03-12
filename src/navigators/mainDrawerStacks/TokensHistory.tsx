import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import {CustomFilterBox} from 'components/form/CustomFilterBox';
import {TokensHistoryComponent} from 'components/history/hive-engine/TokensHistory';
import Icon from 'components/hive/Icon';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  RootStackParam,
  TokensHistoryNavigationProps,
} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: TokensHistoryNavigationProps) => {
  const {theme} = useThemeContext();
  const {currency} = route.params;
  const styles = getStyles(
    theme,
    useSafeAreaInsets(),
    useWindowDimensions().width,
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TokensHistory"
        component={() => <TokensHistoryComponent {...route.params} />}
        options={() => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          animationEnabled: false,
          headerTitleAlign: 'center',
          title: `${currency} ${translate('common.history')}`,
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
                      usingFilter="tokens"
                    />
                  ),
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
              additionalContainerStyle={[styles.iconButton, styles.marginRight]}
            />
          ),
          cardStyle: {
            backgroundColor: getColors(theme).primaryBackground,
          },
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  insets: EdgeInsets,
  width: Dimensions['width'],
) =>
  StyleSheet.create({
    wrapperFixed: {
      top: 55,
      bottom: undefined,
      left: undefined,
      right: 10,
    },
    modalContainer: {
      width: '95%',
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
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      elevation: 0,
      borderWidth: 0,
      height: STACK_HEADER_HEIGHT + insets.top,
      shadowColor: 'transparent',
    },
  });
