import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
} from 'src/styles/typography';
import {Height} from 'utils/common.types';
import {translate} from 'utils/localize';

export default ({theme}: {theme: Theme}) => {
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <SafeArea skipTop>
      <Text style={[styles.textBase, styles.bold, styles.h4]}>
        {translate('components.infoWalletQR.title')}
      </Text>
      <Separator />
      <Text style={styles.textBase}>
        {translate('components.infoWalletQR.text1')}
      </Text>
      <Separator height={10} />
      <Text style={styles.textBase}>
        {translate('components.infoWalletQR.text2')}
      </Text>
      <Separator height={10} />
      <Text style={styles.textBase}>
        {translate('components.infoWalletQR.text3')}{' '}
        <Text style={styles.bold}>
          {translate('components.infoWalletQR.text4')}
        </Text>
      </Text>
    </SafeArea>
  );
};

const getDimensionedStyles = ({height}: Height, theme: Theme) =>
  StyleSheet.create({
    h4: {fontSize: 18},
    bold: {fontFamily: FontPoppinsName.BOLD},
    modal: {height: height * 0.45, marginTop: height * 0.45},
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
  });
