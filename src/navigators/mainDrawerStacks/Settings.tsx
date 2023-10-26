import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import SettingsMenu from 'screens/hive/settings/SettingsMenu';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  //TODO research to rewrite or modify the back phone button function, so you can have the general stack or any other stack working as you want:
  //- i.e: when in the stack "GeneralStack" if the user press back phone button, it must take to wallet.
  // this will be done also for Operation
  // NOTE: if the above doesnt work, then add the stack you need within it's category:
  //  - i.e: each settings screen will be a stack, inside this one bellow. & remove generalStack.
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsMenu}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.settings'),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          cardStyle: styles.card,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() =>
                (navigation as DrawerNavigationHelpers).openDrawer()
              }
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
      elevation: 0,
      borderWidth: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    card: {
      paddingHorizontal: 16,
      backgroundColor: getColors(theme).primaryBackground,
    },
  });
