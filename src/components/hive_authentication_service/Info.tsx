import HasTitleLight from 'assets/new_UI/has_title_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  body_primary_body_2,
  title_primary_body_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import StatusIndicator, {ConnectionStatus, Indicator} from './StatusIndicator';
const TitleDarkPNG = require('assets/new_UI/has_title_dark.png');

const HASInfo = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const fullHasLogo = () => {
    return (
      <View style={styles.flexRowCentered}>
        <StatusIndicator
          theme={theme}
          additionalContainerStyle={styles.hasContainer}
        />
        {theme === Theme.LIGHT ? (
          <HasTitleLight />
        ) : (
          <Image source={TitleDarkPNG} />
        )}
      </View>
    );
  };

  return (
    <Operation logo={fullHasLogo()} title="" theme={theme}>
      <View style={styles.view}>
        <Text style={[styles.title, styles.header]}>
          {translate('wallet.has.info.h1')}
        </Text>
        <Text style={styles.textBase}>{translate('wallet.has.info.t1')}</Text>
        <Text style={[styles.title, styles.header]}>
          {translate('wallet.has.info.h2')}
        </Text>
        <Text style={styles.textBase}>{translate('wallet.has.info.t2')}</Text>
        <Text style={[styles.title, styles.header]}>
          {translate('wallet.has.info.h3')}
        </Text>
        <IndicatorDescription
          status={ConnectionStatus.VOID}
          rootString={'wallet.has.info.indicator.grey'}
          theme={theme}
        />
        <IndicatorDescription
          status={ConnectionStatus.CONNECTED}
          rootString={'wallet.has.info.indicator.green'}
          theme={theme}
          longPress
        />
        <IndicatorDescription
          status={ConnectionStatus.DISCONNECTED}
          rootString={'wallet.has.info.indicator.red'}
          theme={theme}
          press
          longPress
        />
        <Separator height={15} />
        <EllipticButton
          title={translate('common.clear_all')}
          //TODO finish bellow
          onPress={() => {}}
          style={getButtonStyle(theme).warningStyleButton}
          additionalTextStyle={{...body_primary_body_2}}
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
  theme,
}: {
  status: ConnectionStatus;
  rootString: string;
  theme: Theme;
  press?: boolean;
  longPress?: boolean;
}) => {
  const styles = getStyles(theme);
  return (
    <View>
      <View style={styles.indicatorHeader}>
        <View style={styles.indicatorWrapper}>
          <Indicator status={status} theme={theme} />
        </View>
        <Text>
          <Text style={styles.textBase}>
            {translate(`${rootString}.title`)}
          </Text>
        </Text>
      </View>
      {press ? (
        <Text style={styles.detail}>
          <Text style={[styles.textBase, styles.indicatorPress]}>
            {translate(`wallet.has.info.indicator.press`)} :{' '}
          </Text>
          <Text style={styles.textBase}>
            {translate(`${rootString}.press`)}
          </Text>
        </Text>
      ) : null}
      {longPress ? (
        <Text style={styles.detail}>
          <Text style={[styles.textBase, styles.indicatorPress]}>
            {translate(`wallet.has.info.indicator.longPress`)} :{' '}
          </Text>
          <Text style={styles.textBase}>
            {translate(`${rootString}.longPress`)}
          </Text>
        </Text>
      ) : null}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    view: {
      flex: 1,
      marginVertical: 20,
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    header: {
      fontSize: 15,
      marginTop: 10,
    },
    text: {},
    indicatorHeader: {flexDirection: 'row', marginTop: 5, alignItems: 'center'},
    indicatorHeaderText: {fontWeight: 'bold'},
    indicatorPress: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    detail: {marginLeft: 40},
    indicatorWrapper: {
      width: 32,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: getColors(theme).icon,
      ...title_primary_body_2,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    flexRowCentered: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hasContainer: {
      backgroundColor: '#FFF',
    },
  });

export default HASInfo;
