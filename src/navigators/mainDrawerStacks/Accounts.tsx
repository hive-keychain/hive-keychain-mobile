import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import Accounts from 'screens/hive/accounts/Accounts';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Accounts"
        component={Accounts}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('common.account'),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() =>
                navigation.navigate('WALLET', {screen: 'WalletScreen'})
              }
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
