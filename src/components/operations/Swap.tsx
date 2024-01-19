import {loadTokensMarket} from 'actions/index';
import {showModal} from 'actions/message';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import DropdownSelector from 'components/form/DropdownSelector';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import RotationIconAnimated from 'components/ui/RotationIconAnimated';
import Separator from 'components/ui/Separator';
import {IStep} from 'hive-keychain-commons';
import {ThrottleSettings, throttle} from 'lodash';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {SwapConfig} from 'src/interfaces/swap-token.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {
  BACKGROUNDDARKBLUE,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontPoppinsName,
  body_primary_body_1,
  button_link_primary_medium,
  button_link_primary_small,
} from 'src/styles/typography';
import {RootState} from 'store';
import {SwapsConfig} from 'utils/config';
import {capitalize, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, goBackAndNavigate, navigate} from 'utils/navigation';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {
  getAllTokens,
  getHiveEngineTokenPrice,
  getTokenPrecision,
} from 'utils/tokens.utils';
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
  theme,
  loadTokensMarket,
  tokenMarket,
  activeAccount,
  price,
  showModal,
}: PropsFromRedux & Props) => {
  const [loading, setLoading] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [loadingConfirmationSwap, setLoadingConfirmationSwap] = useState(false);
  const [layerTwoDelayed, setLayerTwoDelayed] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [swapConfig, setSwapConfig] = useState({} as SwapConfig);
  const [isAdvanceSettingOpen, setIsAdvanceSettingOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [startToken, setStartToken] = useState<OptionItem>();
  const [endToken, setEndToken] = useState<OptionItem>();
  const [slippage, setSlippage] = useState(5);
  const [startTokenListOptions, setStartTokenListOptions] = useState<
    OptionItem[]
  >([]);
  const [endTokenListOptions, setEndTokenListOptions] = useState<OptionItem[]>(
    [],
  );
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimate, setEstimate] = useState<IStep[]>();
  const [estimateValue, setEstimateValue] = useState<string | undefined>();

  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);

  useEffect(() => {
    init();
  }, []);

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
          translate('wallet.operations.swap.swap_layer_two_delayed'),
          SimpleToast.LONG,
        );
      }
      setSlippage(config.slippage.default);
    } catch (err) {
      console.log('Error Swap tokens', {err});
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
        img =
          tokenInfo.metadata.icon && tokenInfo.metadata.icon.length > 0
            ? tokenInfo.metadata.icon
            : 'src/assets/new_UI/hive-currency-logo.svg';
        imgBackup = 'src/assets/new_UI/hive-engine.svg';
      } else {
        img =
          token.symbol === getCurrency('HIVE')
            ? 'src/assets/new_UI/hive-currency-logo.svg'
            : 'src/assets/new_UI/hbd-currency-logo.svg';
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
        img: 'will_fire_default',
      },
      {
        value: {symbol: getCurrency('HBD'), precision: 3},
        label: getCurrency('HBD'),
        img: 'will_fire_default',
      },
      ...allTokens
        .filter((token: Token) => token.precision !== 0) // Remove token that doesn't allow decimals
        .map((token: Token) => {
          let img = '';
          img =
            token.metadata.icon && token.metadata.icon.trim().length > 0
              ? token.metadata.icon
              : 'will_fire_default';
          return {
            value: token,
            label: token.symbol,
            img: img,
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
    const findDifferentToken = (start: OptionItem) => {
      return endList.find(
        (endItem) => endItem.value.symbol !== start.value.symbol,
      );
    };
    const endTokenToSet = lastUsed.to
      ? endList.find((t) => t.value.symbol === lastUsed.to.symbol)
      : findDifferentToken(list[0]) ?? endList[1];
    setEndToken(endTokenToSet);
    setEndTokenListOptions(endList);
  };

  const calculateEstimate = async (
    amount: string,
    startToken: OptionItem,
    endToken: OptionItem,
    swapConfig: SwapConfig,
  ) => {
    if (startToken === endToken) {
      SimpleToast.show(
        translate(
          'wallet.operations.swap.swap_start_end_token_should_be_different',
        ),
        SimpleToast.LONG,
      );
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
        translate(`wallet.operations.swap.${err.reason.template}`, {
          currently: Number(err.reason.params[0]).toFixed(3),
        }),
        SimpleToast.LONG,
      );
    } finally {
      setLoadingEstimate(false);
    }
  };

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

  const onHandleRequestEstimate = () => {
    if (!estimate) return;
    calculateEstimate(amount, startToken!, endToken!, swapConfig!);
    setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
  };

  const getTokenUSDPrice = (
    estimateValue: string | undefined,
    symbol: string,
  ) => {
    if (!estimateValue) return undefined;
    else {
      let tokenPrice;
      if (symbol === getCurrency('HIVE')) {
        tokenPrice = price.hive.usd!;
      } else if (symbol === getCurrency('HBD')) {
        tokenPrice = price.hive_dollar.usd!;
      } else {
        tokenPrice =
          getHiveEngineTokenPrice(
            {
              symbol,
            },
            tokenMarket,
          ) * price.hive.usd!;
      }
      const tokenPriceUSD = `≈ $${withCommas(
        Number.parseFloat(estimateValue) * tokenPrice + '',
        2,
      )}`;
      return tokenPriceUSD;
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
        translate('wallet.operations.swap.swap_cannot_switch_tokens', {
          symbol: endToken.value.symbol,
        }),
        SimpleToast.LONG,
      );
    }
  };

  const processSwap = async (estimateId: string) => {
    setLoadingSwap(true);
    try {
      let success;
      success = await SwapTokenUtils.processSwap(
        estimateId,
        startToken?.value.symbol,
        parseFloat(amount),
        activeAccount,
        swapConfig.account,
      );
      console.log({success});
      if (success) {
        await SwapTokenUtils.saveLastUsed(startToken?.value, endToken?.value);
        await SwapTokenUtils.setAsInitiated(estimateId);
        showModal(
          'common.swap_sending_token_successful',
          MessageModalType.SUCCESS,
        );
        goBackAndNavigate('SwapHistory');
      } else {
        SimpleToast.show(
          translate('common.swap_error_sending_token', {
            to: swapConfig.account,
          }),
          SimpleToast.LONG,
        );
      }
    } catch (err) {
      console.log('Swap error', {err});
      SimpleToast.show(err.message, SimpleToast.LONG);
    } finally {
      setLoadingSwap(false);
    }
  };

  const gotoConfirmationStack = async () => {
    if (!estimate) {
      SimpleToast.show(
        translate('wallet.operations.swap.swap_no_estimate_error'),
        SimpleToast.LONG,
      );
      return;
    }
    if (slippage < swapConfig.slippage.min) {
      SimpleToast.show(
        translate('wallet.operations.swap.swap_min_slippage_error', {
          min: swapConfig.slippage.min.toString(),
        }),
        SimpleToast.LONG,
      );
      return;
    }
    if (startToken?.value.symbol === endToken?.value.symbol) {
      SimpleToast.show(
        translate(
          'wallet.operations.swap.swap_start_end_token_should_be_different',
        ),
        SimpleToast.LONG,
      );
      return;
    }
    if (!amount || amount.length === 0) {
      SimpleToast.show(
        translate('common.need_positive_amount'),
        SimpleToast.LONG,
      );
      return;
    }

    if (parseFloat(amount) > parseFloat(startToken?.value.balance)) {
      SimpleToast.show(
        translate('common.overdraw_balance_error', {
          currency: startToken?.label!,
        }),
        SimpleToast.LONG,
      );
      return;
    }
    setLoadingConfirmationSwap(true);
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
        translate(`wallet.operations.swap.${err.reason.template}`),
        SimpleToast.LONG,
      );
      return;
    } finally {
      setLoadingConfirmationSwap(false);
    }

    const onHandleBackButton = async () =>
      await SwapTokenUtils.cancelSwap(estimateId);

    navigate('TemplateStack', {
      titleScreen: translate('common.confirm_token_swap'),
      component: (
        <OperationThemed
          additionalContentContainerStyle={{
            justifyContent: 'space-around',
            alignContent: 'flex-start',
          }}
          childrenTop={
            <>
              <Text
                style={[
                  styles.textBase,
                  styles.opaque,
                  styles.marginHorizontal,
                  styles.textCentered,
                ]}>
                {translate('wallet.operations.swap.swap_token_confirm_message')}
              </Text>
              <Separator />
            </>
          }
          childrenMiddle={
            <View style={{marginTop: 20}}>
              <View style={getCardStyle(theme).defaultCardItem}>
                <View style={styles.flexRowbetween}>
                  <Text style={[styles.textBase, styles.biggerText]}>
                    {translate('wallet.operations.swap.swap_id_title')}
                  </Text>
                  <Text style={[styles.textBase, styles.smallerText]}>
                    {estimateId}
                  </Text>
                </View>
                <Separator
                  drawLine
                  height={0.5}
                  additionalLineStyle={styles.bottomLine}
                />
                <Separator height={10} />
                <View style={styles.flexRowbetween}>
                  <Text style={[styles.textBase, styles.biggerText]}>
                    {translate('wallet.operations.swap.swap_estimation')}
                  </Text>
                  <Text style={[styles.textBase]}>{`${withCommas(amount)} ${
                    startToken.value.symbol
                  } => ${withCommas(estimateValue)} ${
                    endToken.value.symbol
                  }`}</Text>
                </View>
                <Separator
                  drawLine
                  height={0.5}
                  additionalLineStyle={styles.bottomLine}
                />
                <Separator height={10} />
                <View style={styles.flexRowbetween}>
                  <Text style={[styles.textBase, styles.biggerText]}>
                    {translate('wallet.operations.swap.slippage')}
                  </Text>
                  <Text style={[styles.textBase]}>
                    {translate('wallet.operations.swap.swap_slippage_step', {
                      slippage,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          }
          childrenBottom={
            <View style={[styles.flexRowbetween, styles.marginBottom]}>
              <EllipticButton
                title={translate('common.back')}
                onPress={async () => {
                  await SwapTokenUtils.cancelSwap(estimateId);
                  goBack();
                }}
                style={[
                  styles.operationButton,
                  styles.operationButtonConfirmation,
                ]}
                additionalTextStyle={[
                  styles.operationButtonText,
                  styles.buttonTextColorDark,
                ]}
              />
              <ActiveOperationButton
                title={translate('common.confirm')}
                onPress={() => processSwap(estimateId)}
                style={[
                  styles.operationButton,
                  getButtonStyle(theme).warningStyleButton,
                ]}
                additionalTextStyle={styles.operationButtonText}
                isLoading={loadingSwap}
              />
            </View>
          }
        />
      ),
      hideCloseButton: true,
      extraActionOnBack: onHandleBackButton,
    } as TemplateStackProps);
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
                  {translate('wallet.operations.swap.swap_fee_title')}{' '}
                  {swapConfig.fee.amount} %
                </Text>
                <Icon
                  theme={theme}
                  name={Icons.BACK_TIME}
                  additionalContainerStyle={[styles.squareButton]}
                  onClick={() => navigate('SwapHistory')}
                  color={PRIMARY_RED_COLOR}
                />
              </View>
              <Separator />
            </View>
          }
          childrenMiddle={
            <View style={[styles.marginHorizontal]}>
              <Separator height={35} />
              <View style={styles.flexRowbetween}>
                <DropdownSelector
                  theme={theme}
                  list={startTokenListOptions}
                  titleTranslationKey="wallet.operations.swap.select_title_from"
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                  searchOption
                  selected={startToken}
                  onSelectedItem={setStartToken}
                  bottomLabelInfo={`${translate(
                    'common.available',
                  )}: ${parseFloat(startToken.value.balance).toFixed(3)}`}
                  addDropdownTitleIndent
                  additionalDropdownListLabelItemStyle={{fontSize: 13}}
                  dropdownColor={PRIMARY_RED_COLOR}
                />
                <OperationInput
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={'0'}
                  value={amount}
                  onChangeText={setAmount}
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
                      <TouchableOpacity
                        onPress={() => setAmount(startToken.value.balance)}>
                        <Text style={[styles.textBase, styles.redText]}>
                          {translate('common.max').toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
              <Separator />
              <Icon
                theme={theme}
                name={Icons.REPEAT}
                onClick={swapStartAndEnd}
                additionalContainerStyle={styles.autoWidthCentered}
                color={PRIMARY_RED_COLOR}
              />
              <Separator />
              <View style={styles.flexRowbetween}>
                <DropdownSelector
                  theme={theme}
                  list={endTokenListOptions}
                  titleTranslationKey="wallet.operations.swap.select_title_to"
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                  onSelectedItem={setEndToken}
                  selected={endToken}
                  searchOption
                  addDropdownTitleIndent
                  additionalDropdownListLabelItemStyle={{fontSize: 13}}
                  dropdownColor={PRIMARY_RED_COLOR}
                />
                <OperationInput
                  disabled
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={'0'}
                  value={estimateValue ? withCommas(estimateValue) : ''}
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
                      <RotationIconAnimated
                        theme={theme}
                        animate={loadingEstimate}
                        onPressIcon={onHandleRequestEstimate}
                        color={PRIMARY_RED_COLOR}
                      />
                    </View>
                  }
                  labelBottomExtraInfo={getTokenUSDPrice(
                    estimateValue,
                    endToken.value.symbol,
                  )}
                  additionalBottomLabelContainerStyle={styles.positionAbsolute}
                  additionalBottomLabelTextStyle={[
                    styles.textBase,
                    styles.italic,
                    styles.smallerText,
                    styles.opaque,
                  ]}
                />
              </View>
              <Separator height={40} />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsAdvanceSettingOpen(!isAdvanceSettingOpen)}
                style={styles.flexRowbetween}>
                <Text style={[styles.textBase, {...body_primary_body_1}]}>
                  {translate('wallet.operations.swap.advance_setting_title')}
                </Text>
                <Icon
                  theme={theme}
                  name={Icons.EXPAND_THIN}
                  {...styles.dropdownIcon}
                  additionalContainerStyle={
                    isAdvanceSettingOpen
                      ? getRotateStyle('180')
                      : getRotateStyle('0')
                  }
                  color={PRIMARY_RED_COLOR}
                />
              </TouchableOpacity>
              {isAdvanceSettingOpen && (
                <OperationInput
                  keyboardType="decimal-pad"
                  infoIconAction={() =>
                    navigate('ModalScreen', {
                      name: ModalComponent.SWAP_INFO,
                      fixedHeight: 0.35,
                    })
                  }
                  labelInput={translate('wallet.operations.swap.slippage')}
                  placeholder={translate('wallet.operations.swap.slippage')}
                  value={slippage.toString()}
                  onChangeText={(text) =>
                    setSlippage(text.trim().length === 0 ? 0 : parseFloat(text))
                  }
                  additionalInputContainerStyle={{
                    marginHorizontal: 0,
                  }}
                  additionalOuterContainerStyle={{
                    width: '100%',
                    marginBottom: 20,
                  }}
                  inputStyle={styles.textBase}
                  additionalLabelStyle={{fontSize: 13}}
                />
              )}
            </View>
          }
          childrenBottom={
            <ActiveOperationButton
              title={translate('wallet.operations.swap.title')}
              onPress={gotoConfirmationStack}
              style={[getButtonStyle(theme).warningStyleButton, styles.button]}
              isLoading={loadingConfirmationSwap}
              additionalTextStyle={{...button_link_primary_medium}}
            />
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
    button: {marginBottom: 20},
    dropdownIcon: {
      width: 15,
      height: 15,
    },
    positionAbsolute: {
      position: 'absolute',
      bottom: -20,
      alignSelf: 'center',
    },
    smallerText: {
      fontSize: 12,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    autoWidthCentered: {
      width: 'auto',
      alignSelf: 'center',
    },
    operationButton: {
      width: '48%',
      marginHorizontal: 0,
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    marginBottom: {
      marginBottom: 20,
    },
    redText: {
      color: PRIMARY_RED_COLOR,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      tokenMarket: state.tokensMarket,
      activeAccount: state.activeAccount,
      price: state.currencyPrices,
    };
  },
  {loadTokensMarket, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Swap);
