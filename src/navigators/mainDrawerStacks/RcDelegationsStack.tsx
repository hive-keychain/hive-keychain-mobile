import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import IncomingOutGoingRCDelegations from 'components/operations/IncomingOutGoingRCDelegations';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';

type Params = {
  type: 'incoming' | 'outgoing';
  total: {gigaRcValue: string; hpValue: string};
  available: {gigaRcValue: string; hpValue: string};
};

const Stack = createStackNavigator();

export default ({route, navigation}: any) => {
  const {theme} = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {type, total, available} = route.params as Params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RcDelegations"
        options={{
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={type} skipTranslation />,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        }}
        children={() => (
          <IncomingOutGoingRCDelegations
            type={type}
            total={total}
            available={available}
          />
        )}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
