import {Asset, ExtendedAccount} from '@hiveio/dhive';
import {ActiveAccount} from 'actions/interfaces';
import hsc from 'api/hiveEngine';
import {KeychainSwapApi} from 'api/keychain-swap';
import {
  Swap,
  SwapConfig,
  SwapStatus,
  SwapStep,
} from 'src/interfaces/swap-token.interface';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {BaseCurrencies} from './currency.utils';
import {withCommas} from './format';
import {sendToken, transfer} from './hive';
import {getTokenInfo} from './hiveEngine';
import {getFromKeychain, saveOnKeychain} from './keychainStorage';

const getSwapTokenStartList = async (account: ExtendedAccount) => {
  let userTokenList: TokenBalance[] = await hsc.find('tokens', 'balances', {
    account: account.name,
  });
  userTokenList = userTokenList.filter(
    (token) => parseFloat(token.balance) > 0,
  );
  userTokenList = userTokenList.sort((a, b) =>
    b.symbol.toLowerCase() > a.symbol.toLowerCase() ? -1 : 1,
  );
  if (Asset.fromString(account.balance.toString()).amount > 0) {
    userTokenList.unshift({
      account: account.name,
      balance: Asset.fromString(account.balance.toString()).amount.toString(),
      symbol: BaseCurrencies.HIVE.toUpperCase(),
    } as TokenBalance);
  }
  if (Asset.fromString(account.hbd_balance.toString()).amount > 0) {
    userTokenList.unshift({
      account: account.name,
      balance: Asset.fromString(
        account.hbd_balance.toString(),
      ).amount.toString(),
      symbol: BaseCurrencies.HBD.toUpperCase(),
    } as TokenBalance);
  }

  return userTokenList;
};

const getSwapTokenEndList = () => {};

const getEstimate = async (
  startToken: string,
  endToken: string,
  amount: string,
  handleErrors: () => void,
) => {
  if (startToken && endToken && amount.length && parseFloat(amount) > 0) {
    const res = await KeychainSwapApi.get(
      `token-swap/estimate/${startToken}/${endToken}/${parseFloat(amount)}`,
    );

    if (res.error) {
      handleErrors();
      throw res.error;
    }

    return res.result;
  }
};

const saveEstimate = async (
  steps: SwapStep[],
  slipperage: number,
  startToken: string,
  endToken: string,
  amount: number,
  username: string,
): Promise<string> => {
  const response = await KeychainSwapApi.post(`token-swap/estimate/save`, {
    slipperage,
    steps,
    startToken,
    endToken,
    amount,
    username,
  });
  if (response.error) {
    throw response.error;
  } else {
    return response.result.estimateId;
  }
};

const processSwap = async (
  estimateId: string,
  startToken: string,
  amount: number,
  activeAccount: ActiveAccount,
  swapAccount: string,
) => {
  if (
    startToken === BaseCurrencies.HBD.toUpperCase() ||
    startToken === BaseCurrencies.HIVE.toUpperCase()
  ) {
    const status = await transfer(activeAccount.keys.active!, {
      from: activeAccount.name!,
      to: swapAccount,
      amount: `${amount.toFixed(3)} ${startToken}`,
      memo: estimateId,
    });
    return status;
  } else {
    const tokenInfo = await getTokenInfo(startToken);
    const status = await sendToken(
      activeAccount.keys.active!,
      activeAccount.name!,
      {
        symbol: startToken,
        to: swapAccount,
        quantity: `${amount.toFixed(tokenInfo.precision)}`,
        memo: estimateId,
      },
    );
    return status;
  }
};

const retrieveSwapHistory = async (username: string): Promise<Swap[]> => {
  const res = await KeychainSwapApi.get(`token-swap/history/${username}`);
  if (res.error) {
    return [];
  }
  const swaps = [];
  for (const s of res.result) {
    // const precisionStartToken = await TokensUtils.getTokenPrecision(
    //   s.startToken,
    // );
    // const precisionEndToken = await TokensUtils.getTokenPrecision(s.endToken);
    if (s.status === SwapStatus.PENDING && !s.transferInitiated) continue;
    swaps.push({
      ...s,
      amount: withCommas(Number(s.amount).toString(), 3),
      received: s.received && withCommas(Number(s.received).toString(), 3),
      finalAmount: withCommas(
        Number(s.received ?? s.expectedAmountAfterFee).toString(),
        3,
      ),
    });
  }
  return swaps;
};

const cancelSwap = async (swapId: string) => {
  await KeychainSwapApi.post(`token-swap/${swapId}/cancel`, {});
};

const getServerStatus = async () => {
  const res = await KeychainSwapApi.get(`server/status`);
  return res.result;
};

const getConfig = async (): Promise<SwapConfig> => {
  const res = await KeychainSwapApi.get(`token-swap/public-config`);
  return res.result;
};

const saveLastUsed = async (from: string, to: string) => {
  await saveOnKeychain(
    KeychainStorageKeyEnum.SWAP_LAST_USED_TOKENS,
    JSON.stringify({from, to}),
  );
};
const getLastUsed = async () => {
  const lastUsed = await getFromKeychain(
    KeychainStorageKeyEnum.SWAP_LAST_USED_TOKENS,
  );
  if (!lastUsed) return {from: null, to: null};
  else return JSON.parse(lastUsed);
};

const setAsInitiated = async (swapId: Swap['id']) => {
  const res = await KeychainSwapApi.post(`token-swap/${swapId}/confirm`, {});
  if (!res.result) {
    throw new Error(`Couldn't set as initiated`);
  }
};

export const SwapTokenUtils = {
  getSwapTokenStartList,
  getSwapTokenEndList,
  processSwap,
  getEstimate,
  saveEstimate,
  retrieveSwapHistory,
  cancelSwap,
  getServerStatus,
  getConfig,
  saveLastUsed,
  getLastUsed,
  setAsInitiated,
};
