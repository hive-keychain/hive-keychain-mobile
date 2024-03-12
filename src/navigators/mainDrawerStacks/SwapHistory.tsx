import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import SwapHistory from 'components/hive/SwapHistory';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(
    theme,
    useSafeAreaInsets(),
    useWindowDimensions().width,
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwapHistory"
        component={SwapHistory}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          cardStyle: styles.cardStyle,
          title: translate('navigation.swap_history'),
          headerTransparent: true,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
              additionalContainerStyle={styles.marginRight}
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
    headerStyle: {
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
      color: getColors(theme).primaryText,
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    marginRight: {
      marginRight: HEADER_ICON_MARGIN,
    },
    marginLeft: {
      marginLeft: HEADER_ICON_MARGIN,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
      paddingTop: 10,
    },
  });
