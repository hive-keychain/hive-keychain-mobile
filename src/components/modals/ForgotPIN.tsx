import {forgetAccounts} from 'actions/index';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {
  getColors,
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {getSpacing} from 'src/styles/spacing';
import {Width} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

interface Props {
  theme: Theme;
}

const ForgotPIN = ({forgetAccounts, theme}: PropsFromRedux & Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width}, theme);
  const capitalizedTextArray = translate('components.forgotPIN.text')
    .split(' ')
    .map((word) => {
      if (word.trim().length) {
        return capitalize(word);
      } else return word;
    });

  return (
    <View>
      <Separator height={height * 0.03} />
      <Text style={[styles.h4, styles.textCentered]}>
        {translate('components.forgotPIN.title')}
      </Text>
      <Separator />
      <Text style={[styles.text, styles.textCentered, styles.marginText]}>
        {capitalizedTextArray.join(' ')}
      </Text>
      <Separator height={height / 15} />
      <EllipticButton
        title={translate('components.forgotPIN.button')}
        onPress={() => {
          goBack();
          forgetAccounts();
        }}
        //TODO important need testing in IOS
        style={[
          styles.warningProceedButton,
          generateBoxShadowStyle(
            0,
            13,
            RED_SHADOW_COLOR,
            1,
            25,
            30,
            RED_SHADOW_COLOR,
          ),
        ]}
      />
    </View>
  );
};
const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    //TODO cleanup unused styles
    header: {color: 'white', marginRight: width * 0.05, fontWeight: 'bold'},
    h4: {
      fontWeight: '600',
      fontSize: 18,
      color: getColors(theme).secondaryText,
    },
    text: {
      color: getColors(theme).secondaryText,
      fontSize: 16,
      fontWeight: '400',
    },
    textCentered: {
      textAlign: 'center',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    marginText: {
      marginHorizontal: getSpacing(width).mainMarginHorizontal,
    },
  });

const connector = connect(null, {forgetAccounts});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ForgotPIN);
