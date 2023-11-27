import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  RootStackParam,
  TemplateStackNavigationProps,
} from 'navigators/Root.types';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';

const Stack = createStackNavigator<RootStackParam>();

/**
 * Note: Used to render any component we need, as a stack screen, using some themed styles.
 * @param titleScreen Title of the screen stack
 * @param component Child component(s) to render, passing its props.
 */
export default ({navigation, route}: TemplateStackNavigationProps) => {
  const {titleScreen, component} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TemplateStack"
        component={() => component}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: titleScreen,
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    headerRightContainer: {
      marginRight: 16,
    },
    headerLeftContainer: {
      marginLeft: 16,
    },
  });
