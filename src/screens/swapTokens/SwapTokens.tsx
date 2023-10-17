import {loadTokensMarket} from 'actions/hiveEngine';
import {KeyTypes, Token} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomPicker from 'components/form/CustomPicker';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import TokenSwap from 'components/operations/TokenSwap';
import CustomToolTip from 'components/ui/CustomToolTip';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import {IStep} from 'hive-keychain-commons';
import {ThrottleSettings, throttle} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
import {SwapConfig} from 'src/interfaces/swap-token.interface';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {BaseCurrencies} from 'utils/currency.utils';
import {withCommas} from 'utils/format';
import {getAllTokens, getTokenPrecision} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {SwapTokenUtils} from 'utils/swap-token.utils';

export interface SelectOption {
  label: string;
  subLabel?: string;
  value: any;
  img?: string;
  imgBackup?: string;
}

export const SVGICONPATHPREFIX = 'src/assets/icons/svgs/';

const SwapTokens = ({
  loadTokensMarket,
  activeAccount,
  price,
  tokenMarket,
}: PropsFromRedux) => {
  const [swapConfig, setSwapConfig] = useState({} as SwapConfig);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [slippage, setSlippage] = useState(5);
  const [amount, setAmount] = useState<string>('');
  const [layerTwoDelayed, setLayerTwoDelayed] = useState(false);
  const [startToken, setStartToken] = useState<SelectOption>();
  const [endToken, setEndToken] = useState<SelectOption>();
  const [startTokenListOptions, setStartTokenListOptions] = useState<
    SelectOption[]
  >([]);
  const [endTokenListOptions, setEndTokenListOptions] = useState<
    SelectOption[]
  >([]);
  const [estimate, setEstimate] = useState<IStep[]>();
  const [estimateValue, setEstimateValue] = useState<string | undefined>();

  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);

  const [isAdvancedParametersOpen, setIsAdvancedParametersOpen] = useState(
    false,
  );

  const [serviceUnavailable, setServiceUnavailable] = useState(false);

  const throttledRefresh = useMemo(() => {
    return throttle(
      (newAmount, newEndToken, newStartToken, swapConfig) => {
        if (parseFloat(newAmount) > 0 && newEndToken && newStartToken) {
          calculateEstimate(newAmount, newStartToken, newEndToken, swapConfig);
          setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
        }
      },
      1000,
      {leading: false} as ThrottleSettings,
    );
  }, []);

  useEffect(() => {
    throttledRefresh(amount, endToken, startToken, swapConfig);
  }, [amount, endToken, startToken, swapConfig]);

  useEffect(() => {
    init();
    return () => {
      throttledRefresh.cancel();
    };
  }, []);

  useEffect(() => {
    if (autoRefreshCountdown === null) {
      return;
    }

    if (autoRefreshCountdown === 0 && startToken && endToken) {
      calculateEstimate(amount, startToken, endToken, swapConfig);
      setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
      return;
    }

    const a = setTimeout(() => {
      setAutoRefreshCountdown(autoRefreshCountdown! - 1);
    }, 1000);

    return () => {
      clearTimeout(a);
    };
  }, [autoRefreshCountdown]);

  const init = async () => {
    let tokenInitialization;
    try {
      if (!tokenMarket.length) loadTokensMarket();
      setLoading(true);
      tokenInitialization = initTokenSelectOptions();

      const [serverStatus, config] = await Promise.all([
        SwapTokenUtils.getServerStatus(),
        SwapTokenUtils.getConfig(),
      ]);
      setUnderMaintenance(serverStatus.isMaintenanceOn);
      setSwapConfig(config);
      if (
        serverStatus.layerTwoDelayed &&
        (!['HIVE', 'HBD'].includes(endToken?.value.symbol) ||
          !['HIVE', 'HBD'].includes(startToken?.value.symbol))
      ) {
        setLayerTwoDelayed(true);
        SimpleToast.show(
          translate('swapTokens.swap_layer_two_delayed'),
          SimpleToast.LONG,
        );
      }
      setSlippage(config.slippage.default);
    } catch (err) {
      SimpleToast.show(translate(err.reason.template), SimpleToast.LONG);
      setServiceUnavailable(true);
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

    let list = startList.map((token) => {
      const tokenInfo = allTokens.find((t) => t.symbol === token.symbol);
      let img = '';
      let imgBackup = '';
      if (tokenInfo) {
        const parsedMetadata: any = tokenInfo.metadata;
        img =
          parsedMetadata.icon && parsedMetadata.icon.length > 0
            ? parsedMetadata.icon
            : `${SVGICONPATHPREFIX}hive-engine.svg`;
        imgBackup = `${SVGICONPATHPREFIX}hive-engine.svg`;
      } else {
        img =
          token.symbol === BaseCurrencies.HIVE.toUpperCase()
            ? `${SVGICONPATHPREFIX}${Icons.HIVE}`
            : `${SVGICONPATHPREFIX}${Icons.HBD}`;
      }
      return {
        value: token,
        label: token.symbol,
        img: img,
        imgBackup,
      };
    });

    let endList: SelectOption[] = [
      {
        value: {symbol: BaseCurrencies.HIVE.toUpperCase(), precision: 3},
        label: BaseCurrencies.HIVE.toUpperCase(),
        img: `${SVGICONPATHPREFIX}${Icons.HIVE}`,
      },
      {
        value: {symbol: BaseCurrencies.HBD.toUpperCase(), precision: 3},
        label: BaseCurrencies.HBD.toUpperCase(),
        img: `${SVGICONPATHPREFIX}${Icons.HBD}`,
      },
      ...allTokens.map((token: Token) => {
        const parsedMetadata: any = token.metadata;
        let img = '';
        img = parsedMetadata.icon ?? `${SVGICONPATHPREFIX}hive-engine.svg`;
        return {
          value: token,
          label: token.symbol,
          img: img,
          imgBackup: `${SVGICONPATHPREFIX}hive-engine.svg`,
        };
      }),
    ];

    const lastUsed = await SwapTokenUtils.getLastUsed();
    setStartToken(
      lastUsed.from
        ? list.find((t) => t.value.symbol === lastUsed.from.symbol)
        : list[0],
    );
    setStartTokenListOptions(list.sort());
    const endTokenToSet = lastUsed.to
      ? endList.find((t) => t.value.symbol === lastUsed.to.symbol)
      : endList[1];
    setEndToken(endTokenToSet);
    setEndTokenListOptions(
      endList.sort((a, b) => (a.label < b.label ? -1 : 1)),
    );
  };

  const calculateEstimate = async (
    amount: string,
    startToken: SelectOption,
    endToken: SelectOption,
    swapConfig: SwapConfig,
  ) => {
    if (startToken === endToken) {
      return;
    }

    try {
      setLoadingEstimate(true);
      setEstimate(undefined);
      setEstimateValue(undefined);
      const result: IStep[] = await SwapTokenUtils.getEstimate(
        startToken?.value.symbol,
        endToken?.value.symbol,
        amount,
        () => {
          setAutoRefreshCountdown(null);
        },
      );
      if (result.length) {
        const precision = await getTokenPrecision(
          result[result.length - 1].endToken,
        );
        const value = Number(result[result.length - 1].estimate);
        const fee =
          (Number(result[result.length - 1].estimate) * swapConfig.fee.amount) /
          100;
        const finalValue = Number(value - fee).toFixed(precision);
        setEstimate(result);
        setEstimateValue(finalValue);
      } else {
        setEstimateValue(undefined);
      }
    } catch (err) {
      setEstimate(undefined);
      SimpleToast.show(
        translate(
          `swapTokens.${err.reason.template}`,
          err.reason.params
            ? {
                value: err.reason.params.join(' '),
              }
            : null,
        ),
        SimpleToast.LONG,
      );
    } finally {
      setLoadingEstimate(false);
    }
  };

  const swapStartAndEnd = () => {
    const option = startTokenListOptions.find(
      (option) => option.value.symbol === endToken?.value.symbol,
    );
    if (option) {
      const tmp = startToken;
      setStartToken(option);
      setEndToken(tmp);
    } else {
      SimpleToast.show(
        translate('swapTokens.swap_cannot_switch_tokens', {
          symbol: endToken?.value.symbol,
        }),
      );
    }
  };

  const processSwap = async () => {
    if (!estimate) {
      SimpleToast.show(
        translate('swapTokens.swap_no_estimate_error'),
        SimpleToast.LONG,
      );
      return;
    }
    if (slippage < swapConfig.slippage.min) {
      SimpleToast.show(
        translate('swapTokens.swap_min_slippage_error', {
          min: swapConfig.slippage.min.toString(),
        }),
      );
      return;
    }
    if (startToken?.value.symbol === endToken?.value.symbol) {
      SimpleToast.show('swapTokens.swap_start_end_token_should_be_different');
      return;
    }
    if (!amount || amount.length === 0) {
      SimpleToast.show(translate('common.need_positive_amount'));
      return;
    }

    if (parseFloat(amount) > parseFloat(startToken?.value.balance)) {
      SimpleToast.show(
        translate('error.transfer.adjust_balance', {
          currency: startToken?.label!,
          username: activeAccount.name!,
        }),
      );
      return;
    }
    let estimateId: string;
    try {
      estimateId = await SwapTokenUtils.saveEstimate(
        estimate!,
        slippage,
        startToken?.value.symbol,
        endToken?.value.symbol,
        parseFloat(amount),
        activeAccount.name!,
      );
    } catch (err) {
      SimpleToast.show(
        translate(`swapTokens.${err.reason.template}`, ...err.reason.params),
      );
      return;
    }

    const startTokenPrecision = await getTokenPrecision(
      startToken?.value.symbol,
    );
    const endTokenPrecision = await getTokenPrecision(endToken?.value.symbol);

    navigate('ModalScreen', {
      name: 'SwapTokenEngine',
      modalContent: (
        <TokenSwap
          estimateId={estimateId}
          startToken={startToken}
          endToken={endToken}
          amount={amount}
          swapAccount={swapConfig.account}
          slippage={slippage}
          estimateValue={estimateValue}
          startTokenPrecision={startTokenPrecision}
          endTokenPrecision={endTokenPrecision}
        />
      ),
    });
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <Loader animating={loading} />
      </View>
    );
  else
    return (
      <View style={[styles.container, styles.paddingHorizontal]}>
        {!loading && !underMaintenance && !serviceUnavailable && (
          <>
            <Text style={{marginTop: 20, fontSize: 16}}>
              {translate('swapTokens.swap_caption')}
            </Text>
            <View style={styles.flexRowBetween}>
              <Text>
                {translate('swapTokens.swap_fee')}: {swapConfig.fee.amount}%
              </Text>
              <Icon
                name={'history'}
                height={20}
                width={20}
                fillIconColor="black"
                onClick={() => navigate('SwapTokensHistoryScreen')}
              />
            </View>

            <Separator />

            <View style={{maxHeight: 700}}>
              <View style={styles.flexRowAligned}>
                {startTokenListOptions.length > 0 && (
                  <CustomPicker
                    list={startTokenListOptions}
                    selectedValue={startToken}
                    labelCreator={(itemSelectOption: SelectOption) =>
                      `${itemSelectOption.label}`
                    }
                    onSelected={(item: SelectOption) => setStartToken(item)}
                    prompt=""
                    style={{
                      width: '35%',
                    }}
                  />
                )}
                <OperationInput
                  placeholder={'0.000'}
                  keyboardType="decimal-pad"
                  textAlign="right"
                  value={amount}
                  onChangeText={setAmount}
                  containerStyle={{
                    maxWidth: '60%',
                  }}
                  rightIcon={
                    <EllipticButton
                      title={translate('common.max')}
                      onPress={() =>
                        setAmount(
                          startToken?.value.balance
                            ? startToken?.value.balance
                            : '',
                        )
                      }
                      style={styles.button}
                      additionalTextStyle={{color: 'black'}}
                    />
                  }
                />
              </View>
              <Text
                style={{marginRight: 10, textAlign: 'right'}}
                onPress={() =>
                  setAmount(
                    startToken?.value.balance ? startToken?.value.balance : '',
                  )
                }>
                {translate('common.available')}:
                {startToken?.value.balance
                  ? withCommas(startToken?.value.balance)
                  : ''}
              </Text>
              {/* End Selector From */}

              <Separator />

              <View style={styles.flexColumnCenteredAligned}>
                <Icon
                  name="swap_vert"
                  fillIconColor="black"
                  onClick={swapStartAndEnd}
                />
              </View>
              <Separator />

              {/* Selector To */}
              <View style={styles.flexRowAligned}>
                {endTokenListOptions.length > 0 && (
                  <CustomPicker
                    list={endTokenListOptions}
                    labelCreator={(itemSelectOption: SelectOption) =>
                      `${itemSelectOption.label}`
                    }
                    selectedValue={endToken}
                    onSelected={(item: SelectOption) => setEndToken(item)}
                    prompt=""
                    style={{
                      width: '35%',
                    }}
                  />
                )}
                <OperationInput
                  placeholder={'0.000'}
                  keyboardType="decimal-pad"
                  textAlign="right"
                  value={estimateValue ? withCommas(estimateValue!) : ''}
                  onChangeText={setEstimateValue}
                  rightIcon={
                    <View style={styles.flexRowAligned}>
                      {estimateValue ? (
                        <CustomToolTip
                          message={SwapTokenUtils.getTokenUSDPrice(
                            estimateValue,
                            endToken?.value.symbol,
                            price,
                            tokenMarket,
                          )}
                          width={100}
                          skipTranslation
                          iconHeight={20}
                          iconWidth={20}
                          color="white"
                        />
                      ) : null}
                      <Icon
                        name="refresh"
                        fillIconColor="black"
                        width={20}
                        height={20}
                        onClick={() => {
                          if (amount && startToken && endToken) {
                            calculateEstimate(
                              amount,
                              startToken!,
                              endToken!,
                              swapConfig!,
                            );
                            setAutoRefreshCountdown(
                              SwapsConfig.autoRefreshPeriodSec,
                            );
                          }
                        }}
                        rotate={loadingEstimate}
                      />
                    </View>
                  }
                  containerStyle={{
                    maxWidth: '60%',
                  }}
                  disabled={true}
                />
              </View>

              {!!autoRefreshCountdown && (
                <Text style={{textAlign: 'right'}}>
                  {translate('swapTokens.swap_autorefresh', {
                    autoRefreshCountdown: autoRefreshCountdown.toString(),
                  })}
                </Text>
              )}
            </View>
            {/* End Selector To */}

            {/* Advance Parameters */}
            <View>
              <TouchableOpacity
                style={styles.flexRowAligned}
                onPress={() =>
                  setIsAdvancedParametersOpen(!isAdvancedParametersOpen)
                }>
                <Text style={styles.title}>
                  {translate('swapTokens.swap_advanced_parameters')}
                </Text>
                <Icon
                  name={
                    !isAdvancedParametersOpen ? 'expand_more' : 'expand_less'
                  }
                  width={25}
                  height={25}
                />
              </TouchableOpacity>
              {isAdvancedParametersOpen && (
                <View
                  style={{
                    marginTop: 8,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 4,
                      marginBottom: 10,
                    }}>
                    <Text>{translate('swapTokens.swaps_slipperage')} </Text>
                    <CustomToolTip
                      message={'swapTokens.swaps_slippage_definition'}
                      height={250}
                      width={250}
                      iconHeight={20}
                      iconWidth={20}
                      color="white"
                    />
                  </View>
                  <OperationInput
                    placeholder={'0.000'}
                    keyboardType="decimal-pad"
                    textAlign="right"
                    value={slippage.toString()}
                    onChangeText={(value) =>
                      setSlippage(value === '' ? 0 : parseFloat(value))
                    }
                  />
                </View>
              )}
            </View>

            <Separator />

            <ActiveOperationButton
              title={translate('swapTokens.swap')}
              onPress={processSwap}
              style={styles.send}
              isLoading={loading}
              method={KeyTypes.active}
            />
          </>
        )}
        {underMaintenance && (
          <View style={styles.loader}>
            <Icon
              name={'engineering'}
              fillIconColor="red"
              width={70}
              height={70}
            />
            <Text style={[styles.title, styles.marginTop]}>
              {translate('swapTokens.swap_under_maintenance')}
            </Text>
          </View>
        )}
        {serviceUnavailable && (
          <View style={styles.loader}>
            <Icon
              name={'cloud_off'}
              fillIconColor="red"
              width={70}
              height={70}
            />
            <Text style={[styles.title, styles.marginTop]}>
              {translate('common.service_unavailable_message')}
            </Text>
          </View>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1, justifyContent: 'space-between'},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
  withdrawingValue: {color: '#b8343f', fontSize: 14},
  flexRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  send: {backgroundColor: '#68A0B4', marginBottom: 20},
  title: {fontWeight: 'bold', fontSize: 16},
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumnCenteredAligned: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginTop: {
    marginTop: 8,
  },
  button: {
    marginHorizontal: 0,
    width: '30%',
    color: 'black',
    backgroundColor: 'white',
    height: 30,
    minWidth: 40,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
    price: state.currencyPrices,
    tokenMarket: state.tokensMarket,
  };
};
const connector = connect(mapStateToProps, {
  loadTokensMarket,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SwapTokens);
