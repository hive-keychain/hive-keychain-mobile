import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import PendingSavingsWithdrawalPageComponent from 'components/hive/PendingSavingsWithdrawalPage.component';
import {SavingsOperations} from 'components/operations/Savings';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';

type Params = {
  currency: string;
  operation: SavingsOperations;
  currentWithdrawingList: SavingsWithdrawal[];
  onUpdate: (list: SavingsWithdrawal[]) => void;
};

const Stack = createStackNavigator();

export default ({route, navigation}: any) => {
  const {theme} = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {
    currency,
    operation,
    currentWithdrawingList,
    onUpdate,
  } = route.params as Params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PendingSavings"
        options={{
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'wallet.operations.savings.pending'} />
          ),
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
          <PendingSavingsWithdrawalPageComponent
            currency={currency}
            operation={operation}
            currentWithdrawingList={currentWithdrawingList}
            onUpdate={onUpdate}
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
