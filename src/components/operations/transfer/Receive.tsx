import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import {encodeOp} from 'hive-uri';
import {ReceiveTransferRoute} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import QRCode from 'react-qr-code';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';
import {translate} from 'utils/localize';

const Receive = ({route}: {route: ReceiveTransferRoute}) => {
  const theme = useThemeContext().theme;
  const params = route.params;
  const {width} = useWindowDimensions();
  const styles = getStyles(theme);
  return (
    <Background theme={theme}>
      <View
        style={{justifyContent: 'space-around', alignItems: 'center', flex: 1}}>
        <View style={{width: '80%'}}>
          <View style={[styles.justifyCenter, styles.confirmItem]}>
            <View style={[styles.flexRowBetween, styles.width95]}>
              <Text style={[getFormFontStyle(width, theme).title]}>
                {translate('request.item.to')}
              </Text>
              <Text
                style={[
                  getFormFontStyle(width, theme).title,
                  styles.textContent,
                ]}>
                {`@${params[1].to}`}
              </Text>
            </View>
            <Separator
              drawLine
              height={0.5}
              additionalLineStyle={styles.bottomLine}
            />
          </View>
          <View style={[styles.justifyCenter, styles.confirmItem]}>
            <View style={[styles.flexRowBetween, styles.width95]}>
              <Text style={[getFormFontStyle(width, theme).title]}>
                {translate('request.item.amount')}
              </Text>
              <Text
                style={[
                  getFormFontStyle(width, theme).title,
                  styles.textContent,
                ]}>
                {`${params[1].amount}`}
              </Text>
            </View>
            <Separator
              drawLine
              height={0.5}
              additionalLineStyle={styles.bottomLine}
            />
          </View>
          <View style={[styles.justifyCenter, styles.confirmItem]}>
            <View style={[styles.flexRowBetween, styles.width95]}>
              <Text style={[getFormFontStyle(width, theme).title]}>
                {translate('request.item.memo')}
              </Text>
              <Text
                style={[
                  getFormFontStyle(width, theme).title,
                  styles.textContent,
                ]}>
                {params[1].memo.length
                  ? params[1].memo
                  : translate('common.none')}
              </Text>
            </View>
          </View>
        </View>
        <QRCode
          size={width * 0.8}
          fgColor={getColors(theme).primaryText}
          bgColor={'transparent'}
          value={encodeOp(params)}
        />
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    confirmItem: {
      marginVertical: 8,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textContent: {
      color: getColors(theme).senaryText,
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    width95: {
      width: '95%',
    },
    justifyCenter: {justifyContent: 'center', alignItems: 'center'},
  });

export default Receive;
