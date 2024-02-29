import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import {
  RootStackParam,
  TemplateStackNavigationProps,
} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
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
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: titleScreen,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: !hideCloseButton
            ? () => (
                <Icon
                  name={Icons.CLOSE_CIRCLE}
                  theme={theme}
                  onClick={() => navigation.navigate('WALLET')}
                  color={getColors(theme).iconBW}
                />
              )
            : null,
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              onClick={() => {
                if (extraActionOnBack) extraActionOnBack();
                (navigation as DrawerNavigationHelpers).goBack();
              }}
              color={getColors(theme).iconBW}
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
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    headerRightContainer: {
      marginRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
