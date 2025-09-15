import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import TokenSettings from 'screens/hive/wallet/tokens/TokenSettings';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {iosHorizontalSwipeBack} from 'utils/navigation.utils';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());

  return (
    <Stack.Navigator id={undefined} screenOptions={iosHorizontalSwipeBack}>
      <Stack.Screen
        name="TokenSettingsScreen"
        component={TokenSettings}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'wallet.operations.token_settings.title'} />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
          cardStyle: styles.cardStyle,
        })}
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
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    headerLeftContainer: {
      paddingLeft: HEADER_ICON_MARGIN,
    },
  });
