import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {translate} from 'utils/localize';

const SwapInfo = () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>
        {translate('wallet.operations.swap.slippage')}
      </Text>
      <Text style={[styles.textBase, styles.opaque]}>
        {translate('wallet.operations.swap.swaps_slippage_definition')}
      </Text>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    container: {
      paddingTop: 20,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 15,
    },
    title: {
      fontSize: 15,
    },
    opaque: {
      opacity: 0.7,
    },
  });

export default SwapInfo;
