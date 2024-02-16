import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import AccountManagement from 'screens/hive/settings/AccountManagement';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(
    theme,
    useWindowDimensions().height,
    useSafeAreaInsets(),
  );
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

const getStyles = (theme: Theme, height: number, insets: EdgeInsets) =>
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
        height,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    cardStyle: {
      paddingHorizontal: CARD_PADDING_HORIZONTAL,
      backgroundColor: getColors(theme).primaryBackground,
    },
    marginRight: {marginRight: HEADER_ICON_MARGIN},
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
  });
