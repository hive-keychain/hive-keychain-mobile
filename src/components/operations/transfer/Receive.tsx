import {NavigationProp} from '@react-navigation/native';
import {showModal} from 'actions/message';
import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import * as hiveUri from 'hive-uri';
import {
  ReceiveTransferProps,
  ReceiveTransferRoute,
} from 'navigators/Root.types';
import React, {useEffect} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import QRCode from 'react-qr-code';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {TokenUtils} from 'utils/tokens.utils';
import TransactionUtils from 'utils/transactions.utils';

const Receive = ({
  route,
  showModal,
  navigation,
}: {
  route: ReceiveTransferRoute;
  navigation: NavigationProp<any>;
} & PropsFromRedux) => {
  const theme = useThemeContext().theme;
  const params = route.params;
  const {width} = useWindowDimensions();
  const styles = getStyles(theme);
  useEffect(() => {
    const date = new Date();
    const interval = setInterval(async () => {
      const currency = (params[1].amount as string).split(' ')[1];
      let res;
      if (currency === 'HIVE' || currency === 'HBD') {
        res = await TransactionUtils.searchForTransaction(
          params as ReceiveTransferProps,
          date,
        );
      } else {
        res = await TokenUtils.searchForTransaction(
          params as ReceiveTransferProps,
          date,
        );
      }
      if (res) {
        clearInterval(interval);
        showModal('toast.receive_success', MessageModalType.SUCCESS);
        navigation.getParent()?.goBack();
      }
    }, 3000);
  }, []);
  return (
    <Background theme={theme} skipTop>
      <View
        style={{justifyContent: 'space-around', alignItems: 'center', flex: 1}}>
        <View style={{width: '80%'}}>
          <View style={[styles.justifyCenter, styles.confirmItem]}>
            <View style={[styles.flexRowBetween, styles.width95]}>
              <Text style={[getFormFontStyle(width, theme).title]}>
                {translate('request.item.to')}
              </Text>
              <UsernameWithAvatar username={params[1].to} />
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
          value={hiveUri.encodeOp(params)}
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

const connector = connect(
  (state: RootState) => {
    return {};
  },
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Receive);
