import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
//TODO use import { translate } from 'utils/localize';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useContext(ThemeContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TokensHistory"
        component={() => (
          <View>
            <Text>//TODO this page as component???</Text>
          </View>
        )}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: getColors(theme).primaryBackground,
            shadowColor: '#ff000000',
          },
          headerTitleStyle: {
            ...headlines_primary_headline_2,
            color: getColors(theme).primaryText,
          },
          headerTitleAlign: 'center',
          //TODO add symbol name as props in navigation
          title: 'TOKEN name HISTORY',
          headerTintColor: 'red',
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          cardStyle: {
            paddingHorizontal: 16,
            backgroundColor: getColors(theme).primaryBackground,
          },
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
