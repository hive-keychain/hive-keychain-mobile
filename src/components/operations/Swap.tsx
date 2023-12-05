import {showFloatingBar} from 'actions/floatingBar';
import {loadTokensMarket} from 'actions/index';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import DropdownSelector from 'components/form/DropdownSelector';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {SwapConfig} from 'src/interfaces/swap-token.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getBorderTest} from 'src/styles/test';
import {getRotateStyle} from 'src/styles/transform';
import {
  body_primary_body_1,
  button_link_primary_medium,
  button_link_primary_small,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
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
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [layerTwoDelayed, setLayerTwoDelayed] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [swapConfig, setSwapConfig] = useState({} as SwapConfig);
  const [isAdvanceSettingOpen, setIsAdvanceSettingOpen] = useState(false);
  const [startToken, setStartToken] = useState<OptionItem>();
  const [slippage, setSlippage] = useState(5);
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
        img: 'will_throw_error',
      },
      {
        value: {symbol: getCurrency('HBD'), precision: 3},
        label: getCurrency('HBD'),
        img: 'will_throw_error',
      },
      ...allTokens
        .filter((token: Token) => token.precision !== 0) // Remove token that doesn't allow decimals
        .map((token: Token) => {
          let img = '';
          img =
            token.metadata.icon && token.metadata.icon.trim().length > 0
              ? token.metadata.icon
              : 'will_throw_error';
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
    const endTokenToSet = lastUsed.to
      ? endList.find((t) => t.value.symbol === lastUsed.to.symbol)
      : endList[1];
    setEndToken(endTokenToSet);
    setEndTokenListOptions(endList);
    // console.log({endTokenListOptions}); //TODO remove line
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
            <View
              style={[
                styles.marginHorizontal,
                getBorderTest('blue'),
                {zIndex: 20},
              ]}>
              <Separator height={35} />
              <View style={styles.flexRowbetween}>
                <DropdownSelector
                  theme={theme}
                  list={startTokenListOptions}
                  titleTranslationKey="wallet.operations.swap.select_title_from"
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                  searchOption
                  //TODO finish bellow
                  onSelectedItem={(item) => console.log('TODO with: ', {item})}
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
                  list={endTokenListOptions}
                  titleTranslationKey="wallet.operations.swap.select_title_to"
                  labelTranslationKey="common.select"
                  additionalContainerStyle={styles.currencySelector}
                  //TODO finish bellow
                  onSelectedItem={(item) => console.log('TODO with: ', {item})}
                  searchOption
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
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsAdvanceSettingOpen(!isAdvanceSettingOpen)}
                style={styles.flexRowbetween}>
                <Text style={[styles.textBase, {...body_primary_body_1}]}>
                  {translate('wallet.operations.swap.advance_setting_title')}
                </Text>
                <Icon
                  theme={theme}
                  name="expand_thin"
                  {...styles.dropdownIcon}
                  additionalContainerStyle={
                    isAdvanceSettingOpen
                      ? getRotateStyle('180')
                      : getRotateStyle('0')
                  }
                />
              </TouchableOpacity>
              {isAdvanceSettingOpen && (
                <OperationInput
                  keyboardType="decimal-pad"
                  infoIconAction={() =>
                    navigate('ModalScreen', {
                      name: ModalComponent.SWAP_INFO,
                      fixedHeight: 0.3,
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
                />
              )}
            </View>
          }
          childrenBottom={
            <View style={getBorderTest('red')}>
              <ActiveOperationButton
                title={translate('wallet.operations.swap.title')}
                //TODO finish bellow
                onPress={() => {}}
                style={[
                  getButtonStyle(theme).warningStyleButton,
                  styles.button,
                ]}
                isLoading={loadingSwap}
                additionalTextStyle={{...button_link_primary_medium}}
              />
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
    button: {marginBottom: 20},
    dropdownIcon: {
      width: 15,
      height: 15,
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
