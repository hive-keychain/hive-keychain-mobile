import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/images/common-ui/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/images/common-ui/arrow_left_light.svg';
import {CustomFilterBox} from 'components/form/CustomFilterBox';
import {TokensHistoryComponent} from 'components/history/hive-engine/TokensHistory';
import Icon from 'components/hive/Icon';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import {
  RootStackParam,
  TokensHistoryNavigationProps,
} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {SMALLEST_SCREEN_WIDTH_SUPPORTED} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {buildIOSHorizontalStackOptions} from 'utils/navigation.utils';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: TokensHistoryNavigationProps) => {
  const {theme} = useThemeContext();
  const {currency} = route.params;
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, useSafeAreaInsets(), width);

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={buildIOSHorizontalStackOptions(
        getColors(theme).primaryBackground,
      )}>
      <Stack.Screen
        name="TokensHistory"
        children={() => <TokensHistoryComponent {...route.params} />}
        options={() => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle
              skipTranslation
              title={`${currency} ${translate('common.history')}`}
            />
          ),
          headerRight: () => (
            <Icon
              name={Icons.FILTERS}
              theme={theme}
              onPress={() =>
                navigation.navigate('ModalScreen', {
                  name: 'FilterScreen',
                  modalContent: (
                    <CustomFilterBox
                      theme={theme}
                      headerText={translate('wallet.filter.filter_title')}
                      usingFilter="tokens"
                    />
                  ),
                  fixedHeight:
                    width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.8 : 0.7,
                  additionalWrapperFixedStyle: [styles.wrapperFixed],
                  modalPosition: undefined,
                  modalContainerStyle: styles.modalContainer,
                  renderButtonElement: (
                    <View style={styles.overlayButtonElement}>
                      <Icon
                        name={Icons.FILTERS}
                        theme={theme}
                        additionalContainerStyle={styles.iconButton}
                      />
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
      top: 55 + insets.top,
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
      borderRadius: 53,
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
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      elevation: 0,
      borderWidth: 0,
      height: STACK_HEADER_HEIGHT + insets.top,
      shadowColor: 'transparent',
    },
  });
