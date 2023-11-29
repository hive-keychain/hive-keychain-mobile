import BuyCoinsComponent from 'components/operations/Buy-coins.component';
import Swap from 'components/operations/Swap';
import ScreenToggle from 'components/ui/ScreenToggle';
import React, {useContext} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {BuyCoinType} from 'src/enums/operations.enum';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';

interface SwapBuyToScreenToogleProps {
  menuLabels: string[];
  components: JSX.Element[];
}

const SwapBuy = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const swapBuyElements: SwapBuyToScreenToogleProps = {
    menuLabels: [
      translate('wallet.operations.swap.title'),
      translate('wallet.operations.buy_coins.title_hive'),
      translate('wallet.operations.buy_coins.title_hbd'),
    ],
    components: [
      <Swap />,
      <BuyCoinsComponent currency={BuyCoinType.BUY_HIVE} iconColor="black" />,
      <BuyCoinsComponent currency={BuyCoinType.BUY_HDB} iconColor="black" />,
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
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
    </View>
  );
};

export default SwapBuy;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
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
    },
  });
