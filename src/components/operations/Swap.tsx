import {loadTokensMarket} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import ErrorSvg from 'assets/new_UI/error-mark.svg';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Loader from 'components/ui/Loader';
import MultisigCaption from 'components/ui/MultisigCaption';
import RotationIconAnimated from 'components/ui/RotationIconAnimated';
import Separator from 'components/ui/Separator';
import SwapCurrencyImage from 'components/ui/SwapCurrencyImage';
import {IStep} from 'hive-keychain-commons';
import {useCheckForMultsig} from 'hooks/useCheckForMultisig';
import {ThrottleSettings, throttle} from 'lodash';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {SwapConfig} from 'src/interfaces/swap-token.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {
  BACKGROUNDDARKBLUE,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {ICONMINDIMENSIONS} from 'src/styles/icon';
import {getHorizontalLineStyle} from 'src/styles/line';
import {MARGIN_PADDING, spacingStyle} from 'src/styles/spacing';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontPoppinsName,
  body_primary_body_1,
  button_link_primary_medium,
  button_link_primary_small,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {SwapsConfig} from 'utils/config';
import {capitalize, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {ModalComponent} from 'utils/modal.enum';
import {goBackAndNavigate, navigate} from 'utils/navigation';
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
  const [disableProcessButton, setDisableProcessButton] = useState(false);
  const [isMultisig, twoFABots, setTwoFABots] = useCheckForMultsig(
    KeyTypes.active,
    activeAccount,
  );
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
        {
          metaData: {twoFACodes: twoFABots},
          multisig: isMultisig,
        },
      );
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
      if (disableProcessButton) return;
      setDisableProcessButton(true);
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

    const getShortenedId = (id: string) => {
      return id.substring(0, 6) + '...' + id.slice(-6);
    };

    const onHandleBackButton = async () =>
      await SwapTokenUtils.cancelSwap(estimateId);

    navigate('TemplateStack', {
      titleScreen: translate('common.confirm_token_swap'),
      component: (
        <Background theme={theme}>
          <View style={{flexGrow: 1, paddingBottom: 16}}>
            {isMultisig && <MultisigCaption />}
            <Caption
              text="wallet.operations.swap.swap_token_confirm_message"
              hideSeparator
            />
            <View
              style={[
                getCardStyle(theme).defaultCardItem,
                {marginHorizontal: 16, marginBottom: 0},
              ]}>
              <View style={styles.flexRowbetween}>
                <Text style={[styles.textBase]}>
                  {translate('wallet.operations.swap.swap_id_title')}
                </Text>
                <Text style={[styles.textBase]}>
                  {getShortenedId(estimateId)}
                </Text>
              </View>
              <Separator
                drawLine
                height={0.5}
                additionalLineStyle={styles.bottomLine}
              />
              <Separator height={10} />
              <View style={styles.flexRowbetween}>
                <Text style={[styles.textBase]}>
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
                <Text style={[styles.textBase]}>
                  {translate('wallet.operations.swap.slippage')}
                </Text>
                <Text style={[styles.textBase]}>
                  {translate('wallet.operations.swap.swap_slippage_step', {
                    slippage,
                  })}
                </Text>
              </View>
            </View>
            <View style={spacingStyle.fillSpace}></View>
            <EllipticButton
              title={translate('common.confirm')}
              preventDoublons
              onPress={() => {
                processSwap(estimateId);
              }}
              isLoading={loading}
              isWarningButton
            />
          </View>
        </Background>
      ),
      hideCloseButton: true,
      extraActionOnBack: onHandleBackButton,
    } as TemplateStackProps);
  };

  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});

  return (
    <View style={[{width: '100%'}]}>
      {!underMaintenance && !loading && !serviceUnavailable && (
        <OperationThemed
          additionalSVGOpacity={1}
          additionalBgSvgImageStyle={{
            top: -70,
            opacity: 1,
          }}
          childrenTop={
            <View style={{}}>
              <Caption text="wallet.operations.swap.disclaimer" hideSeparator />
              <View style={[styles.flexRowbetween, styles.marginHorizontal]}>
                <Text style={[styles.textBase, styles.opaque]}>
                  {translate('wallet.operations.swap.swap_fee_title')}{' '}
                  {swapConfig.fee.amount} %
                </Text>
                <Icon
                  theme={theme}
                  name={Icons.BACK_TIME}
                  additionalContainerStyle={[styles.squareButton]}
                  onPress={() => navigate('SwapHistory')}
                  color={PRIMARY_RED_COLOR}
                />
              </View>
              <Separator />
            </View>
          }
          childrenMiddle={
            <View style={[styles.marginHorizontal]}>
              <Separator height={35} />
              <View
                style={[
                  styles.flexRowbetween,
                  {
                    width: '100%',
                  },
                ]}>
                <DropdownModal
                  enableSearch
                  dropdownTitle="common.token"
                  dropdownIconScaledSize={ICONMINDIMENSIONS}
                  additionalDropdowContainerStyle={{paddingHorizontal: 8}}
                  selected={
                    {
                      value: startToken.value.symbol,
                      label: startToken.label,
                      icon: (
                        <SwapCurrencyImage
                          uri={startToken.img}
                          symbol={startToken.value.symbol}
                          key={startToken.value.symbol}
                          svgHeight={20}
                          svgWidth={20}
                        />
                      ),
                    } as DropdownModalItem
                  }
                  onSelected={(item) => {
                    const selectedItem = startTokenListOptions.find(
                      (token) => token.value.symbol === item.value,
                    );
                    setStartToken(selectedItem);
                  }}
                  list={startTokenListOptions.map((startToken) => {
                    return {
                      value: startToken.value.symbol,
                      label: startToken.label,
                      icon: (
                        <SwapCurrencyImage
                          uri={startToken.img}
                          symbol={startToken.value.symbol}
                          svgHeight={20}
                          svgWidth={20}
                        />
                      ),
                    } as DropdownModalItem;
                  })}
                  additionalMainContainerDropdown={{
                    width: '44%',
                    top: 0,
                  }}
                  bottomLabelInfo={`${translate(
                    'common.available',
                  )}: ${withCommas(startToken.value.balance)}`}
                  drawLineBellowSelectedItem
                  showSelectedIcon={
                    <Icon
                      name={Icons.CHECK}
                      theme={theme}
                      width={18}
                      height={18}
                      strokeWidth={2}
                      color={PRIMARY_RED_COLOR}
                    />
                  }
                  additionalLineStyle={styles.bottomLineDropdownItem}
                />
                <OperationInput
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={'0'}
                  value={amount}
                  onChangeText={setAmount}
                  additionalOuterContainerStyle={{
                    width: '54%',
                  }}
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
                        activeOpacity={1}
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
                onPress={swapStartAndEnd}
                additionalContainerStyle={styles.autoWidthCentered}
                color={PRIMARY_RED_COLOR}
              />
              <Separator />
              <View style={styles.flexRowbetween}>
                <DropdownModal
                  enableSearch
                  dropdownTitle="common.token"
                  dropdownIconScaledSize={ICONMINDIMENSIONS}
                  additionalDropdowContainerStyle={{paddingHorizontal: 8}}
                  selected={
                    {
                      value: endToken.value.symbol,
                      label: endToken.label,
                      icon: (
                        <SwapCurrencyImage
                          uri={endToken.img}
                          symbol={endToken.value.symbol}
                          svgHeight={20}
                          svgWidth={20}
                          key={endToken.value.symbol}
                        />
                      ),
                    } as DropdownModalItem
                  }
                  onSelected={(item) =>
                    setEndToken(
                      endTokenListOptions.find(
                        (token) => token.value.symbol === item.value,
                      ),
                    )
                  }
                  list={endTokenListOptions.map((endToken) => {
                    return {
                      value: endToken.value.symbol,
                      label: endToken.label,
                      icon: (
                        <SwapCurrencyImage
                          uri={endToken.img}
                          symbol={endToken.value.symbol}
                          svgHeight={20}
                          svgWidth={20}
                        />
                      ),
                    } as DropdownModalItem;
                  })}
                  additionalMainContainerDropdown={{
                    width: '44%',
                  }}
                  drawLineBellowSelectedItem
                  showSelectedIcon={
                    <Icon
                      name={Icons.CHECK}
                      theme={theme}
                      width={18}
                      height={18}
                      strokeWidth={2}
                      color={PRIMARY_RED_COLOR}
                    />
                  }
                  additionalLineStyle={styles.bottomLineDropdownItem}
                />
                <OperationInput
                  disabled
                  keyboardType="decimal-pad"
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={'0'}
                  value={estimateValue ? withCommas(estimateValue) : ''}
                  onChangeText={(text) => {}}
                  additionalOuterContainerStyle={{
                    width: '54%',
                  }}
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
                  labelExtraInfo={getTokenUSDPrice(
                    estimateValue,
                    endToken.value.symbol,
                  )}
                />
              </View>
              <Separator height={40} />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsAdvanceSettingOpen(!isAdvanceSettingOpen)}
                style={[styles.flexRowbetween, {marginBottom: 12}]}>
                <Text
                  style={[
                    styles.textBase,
                    {...body_primary_body_1},
                    {fontSize: getFontSizeSmallDevices(width, 16)},
                  ]}>
                  {translate('wallet.operations.swap.advanced_settings_title')}
                </Text>
                <Icon
                  theme={theme}
                  name={Icons.EXPAND_THIN}
                  {...styles.dropdownIcon}
                  additionalContainerStyle={
                    isAdvanceSettingOpen
                      ? getRotateStyle('0')
                      : getRotateStyle('180')
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
                />
              )}
              <Separator height={16} />
            </View>
          }
          buttonTitle={'wallet.operations.swap.title'}
          onNext={gotoConfirmationStack}
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
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
      fontSize: getFontSizeSmallDevices(
        width,
        button_link_primary_small.fontSize,
      ),
    },
    opaque: {
      opacity: 0.8,
    },
    marginHorizontal: {marginHorizontal: MARGIN_PADDING},
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
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
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
