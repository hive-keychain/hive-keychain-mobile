import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import SwapHistory from 'components/hive/SwapHistory';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwapHistory"
        component={SwapHistory}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          cardStyle: styles.cardStyle,
          title: translate('navigation.swap_history'),
          headerTransparent: true,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
              additionalContainerStyle={styles.marginRight}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    headerStyle: {
      height: 'auto',
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    marginRight: {
      marginRight: 16,
    },
    marginLeft: {
      marginLeft: 16,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
  });
