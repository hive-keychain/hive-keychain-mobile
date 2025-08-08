import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import SwapConfirm from 'components/operations/SwapConfirm';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {SwapTokenUtils} from 'utils/swap-token.utils';

type Params = {
  estimateId: string;
  slippage: number;
  amount: string;
  startToken: Token;
  endToken: Token;
  processSwap: (estimateId: string) => Promise<void>;
};

const Stack = createStackNavigator();

export default ({route, navigation}: any) => {
  const {theme} = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {
    estimateId,
    slippage,
    amount,
    startToken,
    endToken,
    processSwap,
  } = route.params as Params;
  const [loading, setLoading] = useState(false);

  const onHandleBackButton = async () => {
    try {
      await SwapTokenUtils.cancelSwap(estimateId);
    } catch (e) {
      SimpleToast.show((e as any).message);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwapConfirm"
        options={{
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'common.confirm_token_swap'} />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={async () => {
                await onHandleBackButton();
                (navigation as DrawerNavigationHelpers).goBack();
              }}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        }}
        children={() => (
          <SwapConfirm
            estimateId={estimateId}
            slippage={slippage}
            amount={amount}
            startToken={startToken}
            endToken={endToken}
            processSwap={processSwap}
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
    flexRowbetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomLine: {
      borderColor: getColors(theme).lineSeparatorStroke,
      marginBottom: 20,
    },
    textBase: {
      color: getColors(theme).secondaryText,
    },
  });
