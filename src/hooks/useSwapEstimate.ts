import {IStep} from 'hive-keychain-commons';
import {ThrottleSettings, throttle} from 'lodash';
import {useCallback, useEffect, useMemo, useState} from 'react';
import SimpleToast from 'react-native-root-toast';
import {SwapConfig} from 'src/interfaces/swapTokens.interface';
import {SwapsConfig} from 'utils/config.utils';
import {withCommas} from 'utils/format.utils';
import {getHiveEngineTokenPrice} from 'utils/hiveEngine.utils';
import {getCurrency} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swapToken.utils';
import {getTokenPrecision} from 'utils/tokens.utils';

type SwapOption = {
  value?: {
    symbol: string;
  };
} | null;

type Params = {
  amount: string;
  startToken: SwapOption;
  endToken: SwapOption;
  swapConfig: SwapConfig;
  price: {
    hive: {usd?: number};
    hive_dollar: {usd?: number};
  };
  tokenMarket: any[];
};

export const useSwapEstimate = ({
  amount,
  startToken,
  endToken,
  swapConfig,
  price,
  tokenMarket,
}: Params) => {
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimate, setEstimate] = useState<IStep[]>();
  const [estimateValue, setEstimateValue] = useState<string | undefined>();
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<
    number | null
  >(null);

  const calculateEstimate = useCallback(
    async (
      nextAmount: string,
      nextStartToken: SwapOption,
      nextEndToken: SwapOption,
      nextSwapConfig: SwapConfig,
    ) => {
      if (
        !nextStartToken?.value?.symbol ||
        !nextEndToken?.value?.symbol ||
        !nextSwapConfig?.fee
      ) {
        return;
      }
      if (nextStartToken === nextEndToken) {
        SimpleToast.show(
          translate(
            'wallet.operations.swap.swap_start_end_token_should_be_different',
          ),
          {
            duration: SimpleToast.durations.LONG,
          },
        );
        return;
      }

      try {
        setLoadingEstimate(true);
        setEstimate(undefined);
        setEstimateValue(undefined);
        const result: IStep[] = await SwapTokenUtils.getEstimate(
          nextStartToken.value.symbol,
          nextEndToken.value.symbol,
          nextAmount,
          () => {
            setAutoRefreshCountdown(null);
          },
        );

        if (result.length) {
          const precision = await getTokenPrecision(
            result[result.length - 1].endToken,
          );
          const value = Number(result[result.length - 1].estimate);
          const fee = (value * nextSwapConfig.fee.amount) / 100;
          setEstimate(result);
          setEstimateValue(Number(value - fee).toFixed(precision));
        } else {
          setEstimateValue(undefined);
        }
      } catch (error: any) {
        setEstimate(undefined);
        SimpleToast.show(
          translate(`wallet.operations.swap.${error.reason.template}`, {
            currently: Number(error.reason.params[0]).toFixed(3),
          }),
          {
            duration: SimpleToast.durations.LONG,
          },
        );
      } finally {
        setLoadingEstimate(false);
      }
    },
    [],
  );

  const throttledRefresh = useMemo(
    () =>
      throttle(
        (
          nextAmount: string,
          nextEndToken: SwapOption,
          nextStartToken: SwapOption,
          nextSwapConfig: SwapConfig,
        ) => {
          if (
            parseFloat(nextAmount) > 0 &&
            nextEndToken?.value &&
            nextStartToken?.value
          ) {
            calculateEstimate(
              nextAmount,
              nextStartToken,
              nextEndToken,
              nextSwapConfig,
            );
            setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
          }
        },
        1000,
        {leading: false} as ThrottleSettings,
      ),
    [calculateEstimate],
  );

  useEffect(() => {
    if (startToken?.value && endToken?.value) {
      throttledRefresh(amount, endToken, startToken, swapConfig);
    }
    return () => {
      throttledRefresh.cancel();
    };
  }, [amount, endToken, startToken, swapConfig, throttledRefresh]);

  useEffect(() => {
    if (autoRefreshCountdown === null) {
      return;
    }

    if (autoRefreshCountdown === 0 && startToken?.value && endToken?.value) {
      calculateEstimate(amount, startToken, endToken, swapConfig);
      setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
      return;
    }

    const timeout = setTimeout(() => {
      setAutoRefreshCountdown(autoRefreshCountdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    amount,
    autoRefreshCountdown,
    calculateEstimate,
    endToken,
    startToken,
    swapConfig,
  ]);

  const refreshEstimate = useCallback(() => {
    if (!estimate || !startToken || !endToken || !swapConfig) {
      return;
    }
    calculateEstimate(amount, startToken, endToken, swapConfig);
    setAutoRefreshCountdown(SwapsConfig.autoRefreshPeriodSec);
  }, [amount, calculateEstimate, endToken, estimate, startToken, swapConfig]);

  const getTokenUSDPrice = useCallback(
    (nextEstimateValue: string | undefined, symbol: string) => {
      if (!nextEstimateValue) {
        return undefined;
      }

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
      return `≈ $${withCommas(
        Number.parseFloat(nextEstimateValue) * tokenPrice + '',
        2,
      )}`;
    },
    [price.hive.usd, price.hive_dollar.usd, tokenMarket],
  );

  return {
    autoRefreshCountdown,
    estimate,
    estimateValue,
    getTokenUSDPrice,
    loadingEstimate,
    refreshEstimate,
  };
};
