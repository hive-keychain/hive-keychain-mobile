import HasTitleLight from 'assets/images/has/has_title_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  body_primary_body_2,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {clearHAS} from 'utils/hiveAuthenticationService';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation.utils';
import StatusIndicator, {ConnectionStatus, Indicator} from './StatusIndicator';

const HASInfo = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);
  const fullHasLogo = () => {
    return (
      <View style={styles.flexRowCentered}>
        <StatusIndicator
          theme={theme}
          additionalContainerStyle={styles.hasContainer}
        />
        {<HasTitleLight />}
      </View>
    );
  };

  return (
    <Operation logo={fullHasLogo()} title="">
      <View style={styles.view}>
        <View style={{flexGrow: 1}}>
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
            press
          />
          <IndicatorDescription
            status={ConnectionStatus.CONNECTED}
            rootString={'wallet.has.info.indicator.green'}
            theme={theme}
            press
          />
          <IndicatorDescription
            status={ConnectionStatus.DISCONNECTED}
            rootString={'wallet.has.info.indicator.red'}
            theme={theme}
            press
            longPress
          />
        </View>
        <Separator height={30} />
        <EllipticButton
          title={translate('common.clear_all')}
          onPress={() => {
            clearHAS();
            goBack();
          }}
          additionalTextStyle={styles.buttonText}
          isWarningButton
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
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);
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

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    view: {
      flex: 1,
      marginTop: 10,
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    header: {
      marginTop: 10,
      fontSize: getFontSizeSmallDevices(width, 15),
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
      marginRight: 8,
    },
    title: {
      color: getColors(theme).icon,
      ...title_primary_body_2,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_primary_body_2}.fontSize,
      ),
    },
    flexRowCentered: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hasContainer: {
      backgroundColor: '#FFF',
    },
    buttonText: {
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_2}.fontSize,
      ),
    },
  });

export default HASInfo;
