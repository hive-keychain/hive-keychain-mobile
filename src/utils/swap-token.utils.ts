import {Asset, ExtendedAccount} from '@hiveio/dhive';
import AsyncStorage from '@react-native-community/async-storage';
import {TokenBalance} from 'actions/interfaces';
import {KeychainSwapApi} from 'api/keychain-swap';
import {IStep} from 'hive-keychain-commons/lib/swaps/swap.interface';
import {
  SwapConfig,
  SwapServerStatus,
} from 'src/interfaces/swap-token.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getCurrency} from './hive';
import {getUserBalance} from './tokens.utils';

const getSwapTokenStartList = async (account: ExtendedAccount) => {
  let userTokenList: TokenBalance[] = await getUserBalance(account.name);
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
      symbol: getCurrency('HIVE'),
    } as TokenBalance);
  }
  if (Asset.fromString(account.hbd_balance.toString()).amount > 0) {
    userTokenList.unshift({
      account: account.name,
      balance: Asset.fromString(
        account.hbd_balance.toString(),
      ).amount.toString(),
      symbol: getCurrency('HBD'),
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
  steps: IStep[],
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

//TODO bellow uncomment & finish up
// const processSwap = async (
//   estimateId: string,
//   startToken: string,
//   amount: number,
//   activeAccount: ActiveAccount,
//   swapAccount: string,
// ) => {
//   if (
//     startToken === getCurrency('HBD') ||
//     startToken === getCurrency('HIVE')
//   ) {
//     // const status = await TransferUtils.sendTransfer(
//     //   activeAccount.name!,
//     //   swapAccount,
//     //   `${amount.toFixed(3)} ${startToken}`,
//     //   estimateId,
//     //   false,
//     //   0,
//     //   0,
//     //   activeAccount.keys.active!,
//     // );
//     const status = await transfer(
//       activeAccount.keys.active!,
//       {
//         from: activeAccount.name!,
//         to: swapAccount,
//         amount: `${amount.toFixed(3)} ${startToken}`,
//         memo: estimateId
//       }
//     );
//     return status?.id;
//   } else {
//     const tokenInfo = await TokensUtils.getTokenInfo(startToken);
//     const status = await TokensUtils.sendToken(
//       startToken,
//       swapAccount,
//       `${amount.toFixed(tokenInfo.precision)}`,
//       estimateId,
//       activeAccount.keys.active!,
//       activeAccount.name!,
//     );
//     return status.tx_id;
//   }
// };

// const retrieveSwapHistory = async (username: string): Promise<ISwap[]> => {
//   const res = await KeychainSwapApi.get(`token-swap/history/${username}`);
//   if (res.error) {
//     return [];
//   }
//   const swaps = [];
//   for (const s of res.result) {
//     // const precisionStartToken = await TokensUtils.getTokenPrecision(
//     //   s.startToken,
//     // );
//     // const precisionEndToken = await TokensUtils.getTokenPrecision(s.endToken);
//     if (s.status === SwapStatus.PENDING && !s.transferInitiated) continue;
//     swaps.push({
//       ...s,
//       amount: FormatUtils.withCommas(Number(s.amount).toString(), 3, true),
//       received:
//         s.received &&
//         FormatUtils.withCommas(Number(s.received).toString(), 3, true),
//       finalAmount: FormatUtils.withCommas(
//         Number(s.received ?? s.expectedAmountAfterFee).toString(),
//         3,
//         true,
//       ),
//     });
//   }
//   return swaps;
// };

// const cancelSwap = async (swapId: string) => {
//   await KeychainSwapApi.post(`token-swap/${swapId}/cancel`, {});
// };

const getServerStatus = async (): Promise<SwapServerStatus> => {
  const res = await KeychainSwapApi.get(`server/status`);
  return res.result;
};

const getConfig = async (): Promise<SwapConfig> => {
  const res = await KeychainSwapApi.get(`token-swap/public-config`);
  return res.result;
};

const saveLastUsed = async (from: string, to: string) => {
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.SWAP_LAST_USED_TOKENS,
    JSON.stringify({from, to}),
  );
};
const getLastUsed = async () => {
  const lastUsed = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.SWAP_LAST_USED_TOKENS,
  );
  if (!lastUsed) return {from: null, to: null};
  else return JSON.parse(lastUsed);
};

// const setAsInitiated = async (swapId: ISwap['id']) => {
//   const res = await KeychainSwapApi.post(`token-swap/${swapId}/confirm`, {});
//   if (!res.result) {
//     Logger.error(`Couldn't set as initiated`);
//   }
// };

export const SwapTokenUtils = {
  getSwapTokenStartList,
  getSwapTokenEndList,
  // processSwap,
  getEstimate,
  saveEstimate,
  // retrieveSwapHistory,
  // cancelSwap,
  getServerStatus,
  getConfig,
  saveLastUsed,
  getLastUsed,
  // setAsInitiated,
};
