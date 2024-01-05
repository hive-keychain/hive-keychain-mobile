import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import AccountManagement from 'screens/hive/settings/AccountManagement';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
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
        name="AccountManagementScreen"
        component={AccountManagement}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.manage'),
          headerRight: () => (
            <MoreInformation
              additionalButtonStyle={styles.marginRight}
              type={Info.COPY_KEYS}
              theme={theme}
            />
          ),
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              onClick={() => (navigation as DrawerNavigationHelpers).goBack()}
              additionalContainerStyle={styles.marginLeft}
              color={getColors(theme).iconBW}
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
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    cardStyle: {
      paddingHorizontal: 16,
      backgroundColor: getColors(theme).primaryBackground,
    },
    marginRight: {marginRight: 16},
    marginLeft: {marginLeft: 16},
  });
