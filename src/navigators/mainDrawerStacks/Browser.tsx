import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import Browser from 'screens/Browser';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {BrowserParamList} from './Browser.types';
const Stack = createStackNavigator<BrowserParamList>();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BrowserScreen"
        component={Browser}
        options={{
          headerShown: false,
          cardStyle: styles.cardStyle,
        }}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
  });
