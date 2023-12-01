import {showFloatingBar} from 'actions/floatingBar';
import {loadTokensMarket} from 'actions/index';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import DropdownSelector from 'components/form/DropdownSelector';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {SwapConfig} from 'src/interfaces/swap-token.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {button_link_primary_small} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {getAllTokens} from 'utils/tokens.utils';
import OperationThemed from './OperationThemed';

export interface OptionItem {
  label: string;
  value: any;
  canDelete?: boolean;
  subLabel?: string;
  img?: string;
  imgBackup?: string;
}

interface Props {
  theme: Theme;
}

const Swap = ({
  showFloatingBar,
  theme,
  loadTokensMarket,
  tokenMarket,
  activeAccount,
}: PropsFromRedux & Props) => {
  const [loading, setLoading] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [swapConfig, setSwapConfig] = useState({} as SwapConfig);
  const [startToken, setStartToken] = useState<OptionItem>();
  const [startTokenListOptions, setStartTokenListOptions] = useState<
    OptionItem[]
  >([]);
  const [endTokenListOptions, setEndTokenListOptions] = useState<OptionItem[]>(
    [],
  );
  const [endToken, setEndToken] = useState<OptionItem>();

  useEffect(() => {
    init();
    showFloatingBar(false);
  }, []);

  const init = async () => {
    //TODO bellow uncomment & finish up
    let tokenInitialization;
    try {
      if (!tokenMarket.length) loadTokensMarket();
      setLoading(true);
      tokenInitialization = initTokenSelectOptions();
      const [serverStatus, config] = await Promise.all([
        SwapTokenUtils.getServerStatus(),
        SwapTokenUtils.getConfig(),
      ]);
      console.log({serverStatus, config}); //TODO remove line

      setUnderMaintenance(serverStatus.isMaintenanceOn);
      setSwapConfig(config);
      // if (
      //   serverStatus.layerTwoDelayed &&
      //   (!['HIVE', 'HBD'].includes(endToken?.value.symbol) ||
      //     !['HIVE', 'HBD'].includes(startToken?.value.symbol))
      // ) {
      //   setLayerTwoDelayed(true);
      //   setWarningMessage('swap_layer_two_delayed');
      // }
      // setSlippage(config.slippage.default);
    } catch (err) {
      console.log('Error Swap tokens', {err});
      setServiceUnavailable(true);
      // setErrorMessage(err.reason?.template, err.reason?.params);
    } finally {
      await tokenInitialization;
      setLoading(false);
    }
  };

  const initTokenSelectOptions = async () => {
    const [startList, allTokens] = await Promise.all([
      SwapTokenUtils.getSwapTokenStartList(activeAccount.account),
      getAllTokens(),
    ]);
    // console.log({startList, allTokens}); //TODO remove line
    let list = startList.map((token) => {
      const tokenInfo = allTokens.find((t) => t.symbol === token.symbol);
      let img = '';
      let imgBackup = '';
      if (tokenInfo) {
        img =
          tokenInfo.metadata.icon && tokenInfo.metadata.icon.length > 0
            ? tokenInfo.metadata.icon
            : '/assets/images/wallet/hive-engine.svg';
        imgBackup = '/assets/images/wallet/hive-engine.svg';
      } else {
        //TODO fix all this part bellow!
        img =
          token.symbol === getCurrency('HIVE')
            ? `/assets/images/wallet/HIVE-logo.svg`
            : `/assets/images/wallet/HBD-logo.svg`;
      }
      return {
        value: token,
        label: token.symbol,
        img: img,
        imgBackup,
      };
    });
    let endList: OptionItem[] = [
      {
        value: {symbol: getCurrency('HIVE'), precision: 3},
        label: getCurrency('HIVE'),
        img: `/assets/images/wallet/HIVE-logo.svg`,
      },
      {
        value: {symbol: getCurrency('HBD'), precision: 3},
        label: getCurrency('HBD'),
        img: `/assets/images/wallet/HBD-logo.svg`,
      },
      ...allTokens
        .filter((token: Token) => token.precision !== 0) // Remove token that doesn't allow decimals
        .map((token: Token) => {
          let img = '';
          img = token.metadata.icon ?? '/assets/images/wallet/hive-engine.svg';
          return {
            value: token,
            label: token.symbol,
            img: img,
            imgBackup: '/assets/images/wallet/hive-engine.svg',
          };
        }),
    ];

    const lastUsed = await SwapTokenUtils.getLastUsed();
    setStartToken(
      lastUsed.from
        ? list.find((t) => t.value.symbol === lastUsed.from.symbol) || list[0]
        : list[0],
    );
    setStartTokenListOptions(list);
    const endTokenToSet = lastUsed.to
      ? endList.find((t) => t.value.symbol === lastUsed.to.symbol)
      : endList[1];
    setEndToken(endTokenToSet);
    setEndTokenListOptions(endList);
    console.log({endTokenListOptions}); //TODO remove line
  };

  const styles = getStyles(theme);

  return (
    <>
      {!underMaintenance && !loading && !serviceUnavailable && (
        <OperationThemed
          additionalSVGOpacity={0.5}
          childrenTop={
            <View style={styles.marginHorizontal}>
              <Separator />
              <Text style={[styles.textBase, styles.opaque]}>
                {translate('wallet.operations.swap.disclaimer')}
              </Text>
              <Separator height={25} />
              <View style={styles.flexRowbetween}>
                <Text style={[styles.textBase, styles.opaque]}>
                  {translate('wallet.operations.swap.swap_fee_title')} 0.75 %
                </Text>
                <Icon
                  theme={theme}
                  name="back_time"
                  additionalContainerStyle={[styles.squareButton]}
                />
              </View>
              <Separator />
            </View>
          }
          childrenMiddle={
            <View style={styles.marginHorizontal}>
              <Separator height={35} />
              <View style={styles.flexRowbetween}>
                <DropdownSelector
                  theme={theme}
                  list={startTokenListOptions.map((item) => item.label)}
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                />
                <OperationInput
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={capitalize(translate('common.enter_amount'))}
                  value={'1.000'}
                  //TODO finish bellow!
                  onChangeText={(text) => {}}
                  additionalInputContainerStyle={{
                    marginHorizontal: 0,
                  }}
                  additionalOuterContainerStyle={{
                    width: '54%',
                  }}
                  inputStyle={styles.textBase}
                  rightIcon={
                    <View style={styles.flexRowCenter}>
                      <Separator
                        drawLine
                        additionalLineStyle={getHorizontalLineStyle(
                          theme,
                          1,
                          35,
                          16,
                        )}
                      />
                      <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.textBase}>
                          {translate('common.max').toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
              <Separator />
              <Icon theme={theme} name="repeat" />
              <Separator />
              <View style={styles.flexRowbetween}>
                <DropdownSelector
                  theme={theme}
                  list={endTokenListOptions.map((item) => item.label)}
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                />
                <OperationInput
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={capitalize(translate('common.enter_amount'))}
                  value={'1.000'}
                  //TODO finish bellow!
                  onChangeText={(text) => {}}
                  additionalInputContainerStyle={{
                    marginHorizontal: 0,
                  }}
                  additionalOuterContainerStyle={{
                    width: '54%',
                  }}
                  inputStyle={styles.textBase}
                  rightIcon={
                    <View style={styles.flexRowCenter}>
                      <Separator
                        drawLine
                        additionalLineStyle={getHorizontalLineStyle(
                          theme,
                          1,
                          35,
                          16,
                        )}
                      />
                      <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.textBase}>
                          {translate('common.max').toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
              <Separator height={40} />
            </View>
          }
        />
      )}
      {underMaintenance && !loading && !serviceUnavailable && (
        <View style={styles.flexCentered}>
          <ErrorSvg {...styles.icon} />
          <Text
            style={[
              styles.textBase,
              styles.biggerText,
              styles.marginHorizontal,
              styles.textCentered,
            ]}>
            {translate('wallet.operations.swap.swap_under_maintenance')}
          </Text>
        </View>
      )}
      {loading && (
        <View style={styles.flexCentered}>
          <Loader animating size={'large'} />
        </View>
      )}
      {!underMaintenance && !loading && serviceUnavailable && (
        <View style={styles.flexCentered}>
          <ErrorSvg {...styles.icon} />
          <Text
            style={[
              styles.textBase,
              styles.biggerText,
              styles.marginHorizontal,
              styles.textCentered,
            ]}>
            {translate('wallet.operations.swap.service_unavailable_message')}
          </Text>
        </View>
      )}
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    opaque: {
      opacity: 0.8,
    },
    marginHorizontal: {marginHorizontal: 16},
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 0,
      borderRadius: 50,
      width: '15%',
      paddingHorizontal: 0,
      paddingVertical: 10,
    },
    flexRowbetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    currencySelector: {
      width: '40%',
    },
    flexCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 45,
      height: 45,
    },
    biggerText: {
      fontSize: 17,
    },
    textCentered: {
      textAlign: 'center',
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      tokenMarket: state.tokensMarket,
      activeAccount: state.activeAccount,
    };
  },
  {showFloatingBar, loadTokensMarket},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Swap);
