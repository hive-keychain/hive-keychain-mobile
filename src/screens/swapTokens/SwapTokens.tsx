import {loadTokensMarket} from 'actions/hiveEngine';
import {Token} from 'actions/interfaces';
import CustomSelector, {SelectOption} from 'components/form/CustomSelector';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
import {SwapConfig, SwapStep} from 'src/interfaces/swap-token.interface';
import {RootState} from 'store';
import {BaseCurrencies} from 'utils/currency.utils';
import {getAllTokens} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';

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

  useEffect(() => {
    init();
  }, []);

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
      console.log(err);
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

  //TODO remove block
  // useEffect(() => {
  //   if (startTokenListOptions) console.log({startTokenListOptions});
  // }, [startTokenListOptions]);
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
            <Text>{translate('swapTokens.swap_caption')}</Text>
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
                fillIconColor="red"
                // type={IconType.OUTLINED}
                // onClick={() => navigateTo(Screen.TOKENS_SWAP_HISTORY)}
              />
            </View>
            <Separator />
            <CustomSelector list={endTokenListOptions} />
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
  container: {width: '100%', flex: 1},
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
