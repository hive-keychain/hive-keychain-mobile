import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import About from 'screens/hive/settings/About';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AboutScreen"
        component={About}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitle: () => <NavigatorTitle title="navigation.about" />,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
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
    headerRightContainer: {
      marginRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
