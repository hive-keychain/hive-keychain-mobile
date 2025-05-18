import {KeyTypes} from 'actions/interfaces';
import {RequestSwap} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {transfer} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {getTokenPrecision} from 'utils/tokens.utils';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSwap & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, startToken, endToken, amount, steps, slippage} = data;
  const [estimateValue, setEstimateValue] = useState<string>();

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
        setEstimateValue(finalValue);
      } catch (error) {
        console.error('Error calculating estimate:', error);
      }
    };

    calculateEstimate();
  }, [steps]);

  const handleSwap = async (options: TransactionOptions) => {
    try {
      const swapConfig = await SwapTokenUtils.getConfig();

      const account = accounts.find((e) => e.name === request.username);
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
        username,
      );
      if (!estimateId) {
        throw new Error('Failed to save swap estimate');
      }

      return await transfer(
        account.keys.active!,
        {
          from: username,
          to: sanitizeUsername(swapConfig.account),
          amount: sanitizeAmount(amount, startToken),
          memo: estimateId.toString(),
        },
        options,
      );
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
        startToken,
        endToken,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={handleSwap}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('common.from')} content={startToken} />
      <RequestItem title={translate('common.to')} content={endToken} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${startToken}`}
      />
      {estimateValue && (
        <RequestItem
          title={translate('wallet.operations.swap.swap_estimation')}
          content={`${estimateValue} ${endToken}`}
        />
      )}
    </RequestOperation>
  );
};
