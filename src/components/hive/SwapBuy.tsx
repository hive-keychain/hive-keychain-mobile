import BuyCoinsComponent from 'components/operations/Buy-coins.component';
import Swap from 'components/operations/Swap';
import SafeArea from 'components/ui/SafeArea';
import ScreenToggle from 'components/ui/ScreenToggle';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StatusBar, StyleSheet, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {BuyCoinType} from 'src/enums/operations.enum';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {MIN_SEPARATION_ELEMENTS} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

interface SwapBuyToScreenToogleProps {
  menuLabels: string[];
  components: JSX.Element[];
}

const SwapBuy = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const swapBuyElements: SwapBuyToScreenToogleProps = {
    menuLabels: [
      translate('wallet.operations.swap.title'),
      translate('wallet.operations.buy_coins.title_hive'),
      translate('wallet.operations.buy_coins.title_hbd'),
    ],
    components: [
      <Swap theme={theme} />,
      <BuyCoinsComponent currency={BuyCoinType.BUY_HIVE} iconColor="black" />,
      <BuyCoinsComponent currency={BuyCoinType.BUY_HDB} iconColor="black" />,
    ],
  };

  return (
    <SafeArea style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <Separator />
      <ScreenToggle
        theme={theme}
        style={styles.toggle}
        additionalHeaderStyle={[
          getCardStyle(theme).roundedCardItem,
          styles.toogleHeader,
        ]}
        menu={swapBuyElements.menuLabels}
        toUpperCase={false}
        components={swapBuyElements.components}
      />
    </SafeArea>
  );
};

export default SwapBuy;

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
      paddingTop: 20,
    },
    text: {
      color: getColors(theme).secondaryText,
    },
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    toogleHeader: {
      width: '95%',
      alignSelf: 'center',
      alignItems: 'center',
      zIndex: 10,
      marginBottom: MIN_SEPARATION_ELEMENTS,
    },
  });
