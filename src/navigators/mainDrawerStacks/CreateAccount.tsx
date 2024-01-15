import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import CreateAccountStepOne from 'screens/hive/createAccounts/create-account-step-one/CreateAccountStepOne';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {CreateAccountFromWalletParamList} from './CreateAccount.types';

const CreateAccountStack = createStackNavigator<
  CreateAccountFromWalletParamList
>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions().height);

  return (
    <CreateAccountStack.Navigator>
      <CreateAccountStack.Screen
        name="CreateAccountFromWalletScreenPageOne"
        component={CreateAccountStepOne}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.create_account'),
          headerRight: () => (
            <Icon
              name={Icons.CLOSE_CIRCLE}
              theme={theme}
              onClick={() => navigation.navigate('WALLET')}
              additionalContainerStyle={[styles.marginRight]}
              color={getColors(theme).iconBW}
            />
          ),
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              additionalContainerStyle={[styles.marginLeft]}
              onClick={() => (navigation as DrawerNavigationHelpers).goBack()}
              color={getColors(theme).iconBW}
            />
          ),
        })}
      />
    </CreateAccountStack.Navigator>
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
    marginRight: {marginRight: HEADER_ICON_MARGIN},
    marginLeft: {marginLeft: HEADER_ICON_MARGIN},
  });
