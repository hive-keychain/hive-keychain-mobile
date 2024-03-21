import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_small,
  title_primary_body_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

const SwapInfo = () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>
        {translate('wallet.operations.swap.slippage')}
      </Text>
      <Separator />
      <Text style={[styles.textBase, styles.textWithLineHeight, styles.opaque]}>
        {translate('wallet.operations.swap.swaps_slippage_definition')}
      </Text>
      <Separator />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
      fontSize: 14,
      width: '100%',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 25,
    },
    title: {
      ...title_primary_body_2,
      fontSize: 20,
      width: '100%',
    },
    opaque: {
      opacity: 0.7,
    },
    textWithLineHeight: {lineHeight: 19.11},
  });

export default SwapInfo;
