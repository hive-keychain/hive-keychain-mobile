import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  RootStackParam,
  TemplateStackNavigationProps,
} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';

import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import NavigatorTitle from 'components/ui/NavigatorTitle';

const Stack = createStackNavigator<RootStackParam>();

/**
 * Note: Used to render any component we need, as a stack screen, using some themed styles.
 * @param titleScreen Title of the screen stack
 * @param component Child component(s) to render, passing its props.
 */
export default ({navigation, route}: TemplateStackNavigationProps) => {
  const {
    titleScreen,
    component,
    hideCloseButton,
    extraActionOnBack,
  } = route.params;
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TemplateStack"
        component={() => component}
        options={({navigation}) => ({
          headerStyle: [styles.header],
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={titleScreen} skipTranslation />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: !hideCloseButton
            ? () => (
                <CloseButton
                  theme={theme}
                  onPress={() => navigation.navigate('WALLET')}
                />
              )
            : null,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => {
                if (extraActionOnBack) extraActionOnBack();
                (navigation as DrawerNavigationHelpers).goBack();
              }}
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
