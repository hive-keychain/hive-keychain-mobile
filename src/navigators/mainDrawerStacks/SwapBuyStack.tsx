import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import SwapBuy from 'components/hive/SwapBuy';
import SwapHistory from 'components/hive/SwapHistory';
import SwapConfirm from 'components/operations/SwapConfirm';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';
import {SwapTokenUtils} from 'utils/swapToken.utils';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(
    theme,
    useSafeAreaInsets(),
    useWindowDimensions().width,
  );

  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="SwapBuy"
        component={SwapBuy}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          animation: 'none',
          cardStyle: styles.cardStyle,
          headerTitle: () => <NavigatorTitle title={'navigation.swap_buy'} />,
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
      <Stack.Screen
        name="SwapConfirm"
        options={({route, navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          animation: 'none',
          cardStyle: styles.cardStyle,
          headerTransparent: true,
          headerTitle: () => (
            <NavigatorTitle title={'common.confirm_token_swap'} />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={async () => {
                try {
                  const {estimateId} = route.params as any;
                  await SwapTokenUtils.cancelSwap(estimateId);
                } catch (e: any) {
                  SimpleToast.show(e?.message);
                }
                navigation.goBack();
              }}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
        })}
        children={({route}: any) => (
          <SwapConfirm
            estimateId={route.params.estimateId}
            slippage={route.params.slippage}
            amount={route.params.amount}
            startToken={route.params.startToken}
            endToken={route.params.endToken}
            processSwap={route.params.processSwap}
            estimate={route.params.estimateValue}
          />
        )}
      />
      <Stack.Screen
        name="SwapHistory"
        component={SwapHistory}
        options={({navigation}) => ({
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
          animation: 'none',
          cardStyle: styles.cardStyle,
          headerTitle: () => (
            <NavigatorTitle title={'navigation.swap_history'} />
          ),
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

const getStyles = (
  theme: Theme,
  insets: EdgeInsets,
  width: Dimensions['height'],
) =>
  StyleSheet.create({
    headerStyle: {
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    marginRight: {
      marginRight: HEADER_ICON_MARGIN,
    },
    marginLeft: {
      marginLeft: HEADER_ICON_MARGIN,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
      paddingTop: 10,
    },
  });
