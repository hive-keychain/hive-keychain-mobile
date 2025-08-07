import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import {RequestSwap} from 'hive-keychain-commons';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React, {useEffect, useState} from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import {getTokenPrecision} from 'utils/tokens.utils';
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
      performOperation={handleSwap}
      RequestUsername={RequestUsername}
      selectedUsername={getUsername()}
      confirmationData={[
        {tag: ConfirmationDataTag.REQUEST_USERNAME, title: '', value: ''},
        {
          tag: ConfirmationDataTag.SWAP,
          title: 'request.item.swap',
          value: '',
          startToken,
          endToken,
          amount: amount + '',
          estimateValue,
        },
        {
          title: 'request.item.slippage',
          value: `${slippage}%`,
        },
      ]}
    />
  );
};
