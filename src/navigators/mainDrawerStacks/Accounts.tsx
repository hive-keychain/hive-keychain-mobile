import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Accounts from 'screens/hive/accounts/Accounts';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions().height);

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
            <Icon
              name={Icons.CLOSE_CIRCLE}
              theme={theme}
              onClick={() =>
                navigation.navigate('WALLET', {screen: 'WalletScreen'})
              }
              color={getColors(theme).iconBW}
              additionalContainerStyle={styles.padding}
            />
          ),
          cardStyle: styles.card,
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              onClick={() =>
                (navigation as DrawerNavigationHelpers).openDrawer()
              }
              color={getColors(theme).iconBW}
              additionalContainerStyle={styles.padding}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      elevation: 0,
      borderWidth: 0,
      height: STACK_HEADER_HEIGHT,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    card: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    padding: {
      paddingHorizontal: CARD_PADDING_HORIZONTAL,
    },
  });
