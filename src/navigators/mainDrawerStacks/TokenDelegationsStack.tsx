import {createStackNavigator} from '@react-navigation/stack';
import {TokenBalance} from 'actions/interfaces';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CurrencyIcon from 'components/hive/CurrencyIcon';
import IncomingOutGoingTokenDelegations, {
  TokenDelegationType,
} from 'components/operations/IncomingOutGoingTokenDelegations';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import React from 'react';
import {StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {RootState} from 'store';
import {iosHorizontalSwipeBack} from 'utils/navigation.utils';

type Params = {
  delegationType: TokenDelegationType;
  total: string;
  token: TokenBalance;
};

const Stack = createStackNavigator();

const Screen = ({route, navigation, tokens, colors}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {delegationType, total, token} = route.params as Params;
  const tokenInfo = tokens.find(
    (t: Token) => t.symbol === token.symbol,
  ) as Token;
  const tokenLogo = (
    <CurrencyIcon
      symbol={token.symbol}
      addBackground
      currencyName={token.symbol}
      colors={colors}
      tokenInfo={tokenInfo}
    />
  );
  return (
    <Stack.Navigator id={undefined} screenOptions={iosHorizontalSwipeBack}>
      <Stack.Screen
        name="TokenDelegations"
        options={{
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle
              title={'wallet.operations.token_delegation.title'}
            />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        }}
        children={() => (
          <IncomingOutGoingTokenDelegations
            delegationType={delegationType}
            total={total}
            token={token}
            tokenLogo={tokenLogo}
            tokenInfo={tokenInfo}
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
      paddingLeft: HEADER_ICON_MARGIN,
    },
  });

const connector = connect((state: RootState) => ({
  tokens: state.tokens,
  colors: state.colors,
}));
type PropsFromRedux = ConnectedProps<typeof connector> & any;

export default connector(Screen);
