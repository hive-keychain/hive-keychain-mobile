import Operation from 'components/operations/Operation';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {translate} from 'utils/localize';
import {ConnectionStatus, Indicator} from './StatusIndicator';
const LOGO_LIGHT = require('assets/has/full-logo-light.png');

const HASInfo = () => {
  return (
    <Operation
      logo={<Image source={LOGO_LIGHT} style={{width: 270, height: 40}} />}
      title="">
      <View style={styles.view}>
        <Text style={styles.header}>{translate('wallet.has.info.h1')}</Text>
        <Text style={styles.text}>{translate('wallet.has.info.t1')}</Text>
        <Text style={styles.header}>{translate('wallet.has.info.h2')}</Text>
        <Text style={styles.text}>{translate('wallet.has.info.t2')}</Text>
        <Text style={styles.header}>{translate('wallet.has.info.h3')}</Text>
        <IndicatorDescription
          status={ConnectionStatus.VOID}
          rootString={'wallet.has.info.indicator.grey'}
        />
        <IndicatorDescription
          status={ConnectionStatus.CONNECTED}
          rootString={'wallet.has.info.indicator.green'}
          longPress
        />
        <IndicatorDescription
          status={ConnectionStatus.DISCONNECTED}
          rootString={'wallet.has.info.indicator.red'}
          press
          longPress
        />
      </View>
    </Operation>
  );
};

const IndicatorDescription = ({
  status,
  rootString,
  press,
  longPress,
}: {
  status: ConnectionStatus;
  rootString: string;
  press?: boolean;
  longPress?: boolean;
}) => {
  return (
    <View>
      <View style={styles.indicatorHeader}>
        <View style={styles.indicatorWrapper}>
          <Indicator status={status} />
        </View>
        <Text>
          <Text style={styles.indicatorHeaderText}>
            {translate(`${rootString}.title`)}
          </Text>
        </Text>
      </View>
      {press ? (
        <Text style={styles.detail}>
          <Text style={styles.indicatorPress}>
            {translate(`wallet.has.info.indicator.press`)} :{' '}
          </Text>
          <Text style={styles.text}>{translate(`${rootString}.press`)}</Text>
        </Text>
      ) : null}
      {longPress ? (
        <Text style={styles.detail}>
          <Text style={styles.indicatorPress}>
            {translate(`wallet.has.info.indicator.longPress`)} :{' '}
          </Text>
          <Text style={styles.text}>
            {translate(`${rootString}.longPress`)}
          </Text>
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginVertical: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  text: {},
  indicatorHeader: {flexDirection: 'row', marginTop: 5},
  indicatorHeaderText: {fontWeight: 'bold'},
  indicatorPress: {fontStyle: 'italic'},
  detail: {marginLeft: 40},
  indicatorWrapper: {
    width: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HASInfo;
