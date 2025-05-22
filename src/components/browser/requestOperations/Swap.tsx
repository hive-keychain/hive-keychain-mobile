import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import {RequestSwap} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import SimpleToast from 'react-native-simple-toast';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCurrency} from 'utils/hive';
import {getAccount} from 'utils/hiveUtils';
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
  const [estimateValue, setEstimateValue] = useState<number>();
  const [balance, setBalance] = useState<number>();
  const [balanceAfterSwap, setBalanceAfterSwap] = useState<number>();

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

  const getBalance = async () => {
    const account = accounts.find((e) => e.name === username);
    if (!account) return 0;

    try {
      const extendedAccount = await getAccount(username);
      if (!extendedAccount) return 0;

      let balance = 0;
      if (startToken === getCurrency('HBD')) {
        balance = parseFloat(
          (extendedAccount.hbd_balance as string).split(' ')[0],
        );
      } else if (startToken === getCurrency('HIVE')) {
        balance = parseFloat((extendedAccount.balance as string).split(' ')[0]);
      } else {
        const tokenBalances = await SwapTokenUtils.getSwapTokenStartList(
          extendedAccount,
        );
        if (tokenBalances && tokenBalances.length > 0) {
          const tokenBalance = tokenBalances.find(
            (token) => token.symbol === startToken,
          );
          if (tokenBalance) {
            balance = parseFloat(tokenBalance.balance);
          }
        }
      }

      return balance;
    } catch (error) {
      showModal('request.error.swap.fetching_balance', MessageModalType.ERROR, {
        error: error.message,
      });
      return 0;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const balance = await getBalance();
        setBalance(balance);
        const newBalanceAfterSwap = balance - amount;
        setBalanceAfterSwap(newBalanceAfterSwap);

        if (newBalanceAfterSwap < 0) {
          SimpleToast.show(
            translate('request.error.swap.insufficient_balance'),
          );
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        showModal(
          'request.error.swap.fetching_balance',
          MessageModalType.ERROR,
          {
            error: error.message,
          },
        );
      }
    };

    initializeData();
  }, [startToken, username, accounts, amount]);

  const handleSwap = async (options: TransactionOptions) => {
    try {
      if (balanceAfterSwap < 0) {
        SimpleToast.show(translate('request.error.swap.insufficient_balance'));
        throw new Error(translate('request.error.swap.insufficient_balance'));
      }

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

      const result = await SwapTokenUtils.processSwap(
        estimateId.toString(),
        startToken,
        amount,
        (account as unknown) as ActiveAccount,
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
      <RequestItem
        key="account"
        title={translate('common.account')}
        content={`@${username}`}
      />
      <RequestItem
        key="swap"
        title={translate('request.item.swap')}
        content={
          estimateValue
            ? `${amount} ${startToken} ==> ${estimateValue} ${endToken}`
            : 'calculating...'
        }
      />
      <RequestItem
        key="balance"
        title={translate('common.balance')}
        content={
          balance !== undefined
            ? `${balance} ${startToken} ==> ${balanceAfterSwap} ${startToken}`
            : 'calculating...'
        }
      />
      <RequestItem
        key="slippage"
        title={translate('request.item.slippage')}
        content={`${slippage}%`}
      />
    </RequestOperation>
  );
};
