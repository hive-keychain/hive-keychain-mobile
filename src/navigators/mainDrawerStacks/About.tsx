import {createStackNavigator} from '@react-navigation/stack';
import BackNavigationButton from 'components/ui/BackNavigationButton';
import CloseButton from 'components/ui/CloseButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import About from 'screens/hive/drawer/settings/About';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {buildIOSHorizontalStackOptions} from 'utils/navigation.utils';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={buildIOSHorizontalStackOptions(
        getColors(theme).primaryBackground,
      )}>
      <Stack.Screen
        name="AboutScreen"
        component={About}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'navigation.about'} />,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          cardStyle: styles.card,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('Wallet')}
            />
          ),
          headerLeft: () => (
            <BackNavigationButton
              theme={theme}
              onPress={() => navigation.goBack()}
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
    headerRightContainer: {
      paddingRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      paddingLeft: HEADER_ICON_MARGIN,
    },
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      elevation: 0,
      borderWidth: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    card: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    padding: {
      paddingHorizontal: CARD_PADDING_HORIZONTAL,
    },
  });
