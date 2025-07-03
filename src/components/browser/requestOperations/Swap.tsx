import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import {RequestSwap} from 'hive-keychain-commons';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Icon from 'src/components/hive/Icon';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {getTokenPrecision} from 'utils/tokens.utils';
import RequestBalance from './components/RequestBalance';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSwap & RequestId;
} & RequestComponentCommonProps;

const SwapDisplay = ({
  startToken,
  endToken,
  amount,
  estimateValue,
}: {
  startToken: string;
  endToken: string;
  amount: number;
  estimateValue?: number;
}) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  return (
    <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>
        {translate('request.item.swap')}
      </Text>
      <View style={styles.swapContent}>
        {estimateValue ? (
          <>
            <Text style={[styles.textBase, styles.content, styles.opaque]}>
              {`${amount} ${startToken}`}
            </Text>
            <Icon
              name={Icons.ARROW_RIGHT_BROWSER}
              additionalContainerStyle={styles.arrowIcon}
              width={20}
              height={20}
              theme={theme}
              color={getColors(theme).iconBW}
            />
            <Text style={[styles.textBase, styles.content, styles.opaque]}>
              {`${estimateValue} ${endToken}`}
            </Text>
          </>
        ) : (
          <Text style={[styles.textBase, styles.content, styles.opaque]}>
            calculating...
          </Text>
        )}
      </View>
    </View>
  );
};

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {getUsername, RequestUsername} = usePotentiallyAnonymousRequest(
    request,
    accounts,
  );

  const {request_id, ...data} = request;
  const {startToken, endToken, amount, steps, slippage} = data;
  const [estimateValue, setEstimateValue] = useState<number>();
  useEffect(() => {
    const calculateEstimate = async () => {
      try {
        const swapConfig = await SwapTokenUtils.getConfig();
        if (!swapConfig) return;

        const lastStep = steps[steps.length - 1];
        if (!lastStep) return;

        const precision = await getTokenPrecision(lastStep.endToken);
        const value = Number(lastStep.estimate);
        const fee = (value * swapConfig.fee.amount) / 100;
        const finalValue = Number(value - fee).toFixed(precision);
        setEstimateValue(Number(finalValue));
      } catch (error) {
        console.error('Error calculating estimate:', error);
      }
    };

    calculateEstimate();
  }, [steps]);

  const handleSwap = async (options: TransactionOptions) => {
    try {
      const swapConfig = await SwapTokenUtils.getConfig();

      const account = accounts.find((e) => e.name === getUsername());
      if (!account) {
        throw new Error('Account not found');
      }
      if (!swapConfig) {
        throw new Error('Failed to load swap configuration');
      }

      const estimateId = await SwapTokenUtils.saveEstimate(
        steps,
        slippage,
        startToken,
        endToken,
        amount,
        getUsername(),
      );
      if (!estimateId) {
        throw new Error('Failed to save swap estimate');
      }

      const result = await SwapTokenUtils.processSwap(
        estimateId.toString(),
        startToken,
        amount,
        account as ActiveAccount,
        swapConfig.account,
        options,
      );

      if (!result) {
        throw new Error('Swap transfer failed');
      }

      return {...result, swap_id: estimateId};
    } catch (error) {
      if (error.message) {
        throw new Error(`Swap failed: ${error.message}`);
      } else {
        throw new Error('Swap failed: Unknown error occurred');
      }
    }
  };

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.swap', {
        amount,
        from: startToken,
        to: endToken,
      })}
      errorMessage={translate('request.error.swap.failed')}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={handleSwap}>
      <RequestUsername />
      <SwapDisplay
        startToken={startToken}
        endToken={endToken}
        amount={amount}
        estimateValue={estimateValue}
      />
      <RequestBalance
        username={getUsername()}
        startToken={startToken}
        amount={amount}
        accounts={accounts as ActiveAccount[]}
      />
      <RequestItem
        key="slippage"
        title={translate('request.item.slippage')}
        content={`${slippage}%`}
      />
    </RequestOperation>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {paddingVertical: 5},
    title: {fontSize: getFontSizeSmallDevices(width, 14)},
    content: {fontSize: getFontSizeSmallDevices(width, 14)},
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    opaque: {
      opacity: 0.8,
    },
    swapContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrowIcon: {
      marginHorizontal: 5,
    },
  });
