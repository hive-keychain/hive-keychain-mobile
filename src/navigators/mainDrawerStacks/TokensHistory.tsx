import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
//TODO use import { translate } from 'utils/localize';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CustomFilterBox from 'components/form/CustomFilterBox';
import {TokensHistoryComponent} from 'components/operations/Tokens-history';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  RootStackParam,
  TokensHistoryNavigationProps,
} from 'navigators/Root.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: TokensHistoryNavigationProps) => {
  const {theme} = useContext(ThemeContext);
  const {currency} = route.params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TokensHistory"
        component={() => <TokensHistoryComponent {...route.params} />}
        options={() => ({
          headerStyle: {
            backgroundColor: getColors(theme).primaryBackground,
          },
          headerTitleStyle: {
            ...headlines_primary_headline_2,
            color: getColors(theme).primaryText,
          },
          headerTitleAlign: 'center',
          title: `${currency} ${translate('common.history').toUpperCase()}`,
          headerTintColor: 'red',
          headerRight: () => (
            <CustomFilterBox
              theme={theme}
              onClick={() => {}} //TODO must act
            />
          ),
          cardStyle: {
            backgroundColor: getColors(theme).primaryBackground,
          },
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={{marginLeft: 16}}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
