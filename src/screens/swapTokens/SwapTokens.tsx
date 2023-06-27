import {loadTokensMarket} from 'actions/hiveEngine';
import {KeyTypes, Token} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomPicker from 'components/form/CustomPicker';
import {SelectOption} from 'components/form/CustomSelector';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import TokenSwap from 'components/operations/TokenSwap';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import {ThrottleSettings, throttle} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
import {SwapConfig, SwapStep} from 'src/interfaces/swap-token.interface';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {BaseCurrencies} from 'utils/currency.utils';
import {withCommas} from 'utils/format';
import {getAllTokens, getTokenPrecision} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {SwapTokenUtils} from 'utils/swap-token.utils';

export const SVGICONPATHPREFIX = 'src/assets/icons/svgs/';

const SwapTokens = ({
  loadTokensMarket,
  activeAccount,
  price,
  tokenMarket,
  navigate,
}: PropsFromRedux) => {
  const [swapConfig, setSwapConfig] = useState({} as SwapConfig);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [slippage, setSlippage] = useState(5);
  const [amount, setAmount] = useState<string>('');

  const [startToken, setStartToken] = useState<SelectOption>();
  const [endToken, setEndToken] = useState<SelectOption>();
  const [startTokenListOptions, setStartTokenListOptions] = useState<
    SelectOption[]
  >([]);
  const [endTokenListOptions, setEndTokenListOptions] = useState<
    SelectOption[]
  >([]);
  const [estimate, setEstimate] = useState<SwapStep[]>();
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

      const [serverStatus, res] = await Promise.all([
        SwapTokenUtils.getServerStatus(),
        SwapTokenUtils.getConfig(),
      ]);
      setUnderMaintenance(serverStatus.isMaintenanceOn);
      setSwapConfig(res);
      setSlippage(res.slippage.default);
    } catch (err) {
      // Logger.error(err);
      console.log({err}); //TODO remove line
      // Toast.show(err.reason.template, 3000);
      // setErrorMessage(err.reason.template, err.reason.params);
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
        const parsedMetadata: any = tokenInfo.metadata; //TODO why??
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
        const parsedMetadata: any = token.metadata; //TODO why??
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
    setStartTokenListOptions(list);
    const endTokenToSet = lastUsed.to
      ? endList.find((t) => t.value.symbol === lastUsed.to.symbol)
      : endList[1];
    setEndToken(endTokenToSet);
    setEndTokenListOptions(endList);
  };

  const calculateEstimate = async (
    amount: string,
    startToken: SelectOption,
    endToken: SelectOption,
    swapConfig: SwapConfig,
  ) => {
    if (startToken === endToken) {
      // setErrorMessage('swap_start_end_token_should_be_different');
      // Toast.show(translate('swapTokens.swap_start_end_token_should_be_different'), Toast.LONG);
      return;
    }

    try {
      setLoadingEstimate(true);
      setEstimate(undefined);
      setEstimateValue(undefined);
      const result: SwapStep[] = await SwapTokenUtils.getEstimate(
        startToken?.value.symbol,
        endToken?.value.symbol,
        amount,
        () => {
          setAutoRefreshCountdown(null);
        },
      );
      console.log({result}); //TODO remove
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
      // setErrorMessage(err.reason.template, err.reason.params);
      // Toast.show(err.reason.template, 3000);
      console.log({err});
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
      console.log({err});
      //TODO finish bellow
      // SimpleToast.show(err.reason.template, err.reason.params);
      return;
    }

    // const startTokenPrecision = await getTokenPrecision(
    //   startToken?.value.symbol,
    // );
    // const endTokenPrecision = await getTokenPrecision(endToken?.value.symbol);

    // const fields = [
    //   {label: 'html_popup_swap_swap_id', value: estimateId},
    //   {
    //     label: 'html_popup_swap_swap_amount',
    //     value: `${withCommas(Number(amount).toFixed(startTokenPrecision))} ${
    //       startToken?.value.symbol
    //     } => ${withCommas(estimateValue!.toString())} ${
    //       endToken?.value.symbol
    //     }`,
    //   },
    //   {
    //     label: 'html_popup_swap_swap_slipperage',
    //     value: `${slippage}% (for each step)`,
    //   },
    // ];

    navigate('ModalScreen', {
      name: 'TransferEngine', //TODO check & fix
      modalContent: (
        <TokenSwap
          currency={BaseCurrencies.HBD}
          tokenBalance={estimateValue}
          tokenLogo={<Icon name="transfer" />} //TODO add start & end tokens, symbols.
          engine={true}
        />
      ),
    });

    //Bellow will move to TokenSwap.
    //TODO uncomment + finish bellow
    // navigateToWithParams(Screen.CONFIRMATION_PAGE, {
    //   message: chrome.i18n.getMessage('html_popup_swap_token_confirm_message'),
    //   fields: fields,
    //   title: 'html_popup_swap_token_confirm_title',
    //   formParams: getFormParams(),
    //   afterConfirmAction: async () => {
    //     addToLoadingList(
    //       'html_popup_swap_sending_token_to_swap_account',
    //       KeysUtils.getKeyType(
    //         activeAccount.keys.active!,
    //         activeAccount.keys.activePubkey!,
    //       ),
    //       [startToken?.value.symbol, swapConfig.account],
    //     );
    //     try {
    //       let success;

    //       success = await SwapTokenUtils.processSwap(
    //         estimateId,
    //         startToken?.value.symbol,
    //         parseFloat(amount),
    //         activeAccount,
    //         swapConfig.account,
    //       );

    //       removeFromLoadingList(
    //         'html_popup_swap_sending_token_to_swap_account',
    //       );

    //       if (success) {
    //         await SwapTokenUtils.saveLastUsed(
    //           startToken?.value,
    //           endToken?.value,
    //         );
    //         await SwapTokenUtils.setAsInitiated(estimateId);
    //         setSuccessMessage('html_popup_swap_sending_token_successful');
    //         goBackToThenNavigate(Screen.TOKENS_SWAP_HISTORY);
    //       } else {
    //         SimpleToast.show('html_popup_swap_error_sending_token', [
    //           swapConfig.account,
    //         ]);
    //       }
    //     } catch (err: any) {
    //       SimpleToast.show(err.message);
    //     } finally {
    //       removeFromLoadingList('html_popup_delegate_rc_operation');
    //     }
    //   },
    //   afterCancelAction: async () => {
    //     await SwapTokenUtils.cancelSwap(estimateId);
    //   },
    // });
  };

  //TODO remove block
  useEffect(() => {
    if (startToken) console.log({startToken});
  }, [startToken]);
  //end block

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
            <Text style={{marginTop: 10}}>
              {translate('swapTokens.swap_caption')}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>
                {translate('swapTokens.swap_fee')}: {swapConfig.fee.amount}%
              </Text>
              <Icon
                name={'history'}
                fillIconColor="black"
                // type={IconType.OUTLINED}
                //TODO swap history page
                // onClick={() => navigateTo(Screen.TOKENS_SWAP_HISTORY)}
              />
            </View>

            <Separator />

            {/* Selector from */}
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
                    width: '40%',
                  }}
                />
              )}
              <OperationInput
                placeholder={'0.000'}
                keyboardType="decimal-pad"
                // rightIcon={<Text style={styles.currency}>{currency}</Text>}
                textAlign="right"
                value={amount}
                onChangeText={setAmount}
                containerStyle={{
                  maxWidth: '40%',
                }}
              />
            </View>
            <Text
              onPress={() =>
                setAmount(
                  startToken?.value.balance ? startToken?.value.balance : '',
                )
              }>
              available:
              {startToken?.value.balance
                ? withCommas(startToken?.value.balance)
                : ''}
            </Text>
            {/* End Selector From */}

            <Separator />

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
                    width: '40%',
                  }}
                />
              )}
              <OperationInput
                placeholder={'0.000'}
                keyboardType="decimal-pad"
                // rightIcon={<Text style={styles.currency}>{currency}</Text>}
                textAlign="right"
                value={estimateValue ? withCommas(estimateValue!) : ''}
                onChangeText={setEstimateValue}
                containerStyle={{
                  maxWidth: '40%',
                }}
              />
              <Icon
                name="refresh"
                fillIconColor="black"
                width={30}
                height={30}
                onClick={() => {
                  calculateEstimate(
                    amount,
                    startToken!,
                    endToken!,
                    swapConfig!,
                  );
                  setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
                }}
                rotate={loadingEstimate}
              />
            </View>

            {!!autoRefreshCountdown && (
              <Text>
                {translate('swapTokens.swap_autorefresh', {
                  autoRefreshCountdown: autoRefreshCountdown.toString(),
                })}
              </Text>
            )}
            {/* End Selector To */}

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
          <View>
            <Icon name={'engineering'} fillIconColor="red" />
            <Text>{translate('swapTokens.swap_under_maintenance')}</Text>
          </View>
        )}
        {serviceUnavailable && (
          <View>
            <Icon name={'cloud_off'} fillIconColor="red" />
            <Text>{translate('common.service_unavailable_message')}</Text>
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
  navigate,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SwapTokens);
