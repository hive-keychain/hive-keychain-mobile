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
import {
  body_primary_body_3,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

interface Props {
  theme: Theme;
}

const ForgotPIN = ({forgetAccounts, theme}: PropsFromRedux & Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width}, theme);

  return (
    <View style={styles.flexSpaceAround}>
      <View>
        <Text
          style={[
            styles.h4,
            styles.textCentered,
            {fontSize: getFontSizeSmallDevices(height, styles.h4.fontSize)},
          ]}>
          {translate('components.forgotPIN.title')}
        </Text>
        <Separator />
        <Text
          style={[
            styles.text,
            styles.textCentered,
            styles.marginText,
            {fontSize: getFontSizeSmallDevices(height, styles.text.fontSize)},
          ]}>
          {capitalizeSentence(translate('components.forgotPIN.text'))}
        </Text>
      </View>
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
        additionalTextStyle={{...button_link_primary_medium}}
      />
    </View>
  );
};
const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
      lineHeight: 12 * 2,
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
    flexSpaceAround: {
      flex: 1,
      justifyContent: 'space-around',
    },
  });

const connector = connect(null, {forgetAccounts});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ForgotPIN);
