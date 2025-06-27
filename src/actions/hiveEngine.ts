import AsyncStorage from '@react-native-async-storage/async-storage';
import {HiveEngineApi} from 'api/hiveEngine';
import {DEFAULT_HE_RPC_NODE} from 'screens/hive/settings/RpcNodes';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {AppThunk} from 'src/hooks/redux';
import {
  OperationsHiveEngine,
  Token,
  TokenMarket,
  TokenTransaction,
} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState, store} from 'store';
import {HiveEngineConfigUtils} from 'utils/hive-engine-config.utils';
import {decodeMemoIfNeeded} from 'utils/hiveEngine';
import {getAllTokens, getUserBalance} from 'utils/tokens.utils';
import {ActionPayload, TokenBalance} from './interfaces';
import {showModal} from './message';
import {setHiveEngineRpc} from './settings';
import {
  CLEAR_TOKEN_HISTORY,
  CLEAR_USER_TOKENS,
  LOAD_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
  LOAD_USER_TOKENS,
} from './types';

export const loadTokens = (): AppThunk => async (dispatch) => {
  const tokens = await getAllTokens();
  const action: ActionPayload<Token[]> = {
    type: LOAD_TOKENS,
    payload: tokens,
  };
  dispatch(action);
};

export const loadTokensMarket = (): AppThunk => async (dispatch) => {
  let tokensMarket: TokenMarket[] = [];
  let offset = 0;
  let tokens;
  do {
    tokens = await HiveEngineApi.getSSC().find(
      'market',
      'metrics',
      {},
      1000,
      offset,
      [],
    );
    offset += 1000;
    tokensMarket = [...tokensMarket, ...tokens];
  } while (tokens.length === 1000);
  const action: ActionPayload<TokenMarket[]> = {
    type: LOAD_TOKENS_MARKET,
    payload: tokensMarket,
  };
  dispatch(action);
};

export const loadUserTokens = (account: string): AppThunk => async (
  dispatch,
) => {
  try {
    dispatch({
      type: CLEAR_USER_TOKENS,
    });

    let tokensBalance: TokenBalance[] = await getUserBalance(account);
    tokensBalance = tokensBalance.sort(
      (a, b) => parseFloat(b.balance) - parseFloat(a.balance),
    );
    const action: ActionPayload<TokenBalance[]> = {
      type: LOAD_USER_TOKENS,
      payload: tokensBalance,
    };
    dispatch(action);
  } catch (e) {
    const switchAuto = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.SWITCH_HE_RPC_AUTO,
    );
    if (
      switchAuto === 'true' ||
      (switchAuto === null &&
        HiveEngineConfigUtils.getApi() === DEFAULT_HE_RPC_NODE)
    ) {
      const newApi = await HiveEngineConfigUtils.switchToNextRpc();
      dispatch(setHiveEngineRpc(newApi));
      dispatch(loadUserTokens(account));
    } else dispatch(showModal('toast.tokens_timeout', MessageModalType.ERROR));
  }
};

export const loadTokenHistory = (
  account: string,
  currency: string,
): AppThunk => async (dispatch) => {
  const memoKey = (store.getState() as RootState).accounts.find(
    (a) => a.name === account,
  )!.keys.memo;
  let tokenHistory: TokenTransaction[] = [];

  let start = 0;
  let previousTokenHistoryLength = 0;

  do {
    previousTokenHistoryLength = tokenHistory.length;
    let result: TokenTransaction[] = (
      await HiveEngineApi.getHistoryApi().get('accountHistory', {
        params: {
          account,
          symbol: currency,
          type: 'user',
          offset: start,
        },
      })
    ).data;
    start += 1000;
    tokenHistory = [...tokenHistory, ...result];
  } while (previousTokenHistoryLength !== tokenHistory.length);

  tokenHistory = tokenHistory.map((t: any) => {
    t.amount = `${t.quantity} ${t.symbol}`;
    switch (t.operation) {
      case OperationsHiveEngine.COMMENT_CURATION_REWARD:
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD:
        return {
          ...(t as TokenTransaction),
          authorPerm: t.authorperm,
        };
      case OperationsHiveEngine.MINING_LOTTERY:
        return {...(t as TokenTransaction), poolId: t.poolId};
      case OperationsHiveEngine.TOKENS_TRANSFER:
        return {
          ...(t as TokenTransaction),
          from: t.from,
          to: t.to,
          memo: decodeMemoIfNeeded(t.memo, memoKey),
        };
      case OperationsHiveEngine.TOKEN_STAKE:
        return {
          ...(t as TokenTransaction),
          from: t.from,
          to: t.to,
        };
      case OperationsHiveEngine.TOKENS_DELEGATE:
        return {
          ...(t as TokenTransaction),
          delegator: t.from,
          delegatee: t.to,
        };
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START:
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE:
        return {
          ...(t as TokenTransaction),
          delegator: t.to,
          delegatee: t.from,
        };
      default:
        return t as TokenTransaction;
    }
  });

  const action: ActionPayload<TokenTransaction[]> = {
    type: LOAD_TOKEN_HISTORY,
    payload: tokenHistory,
  };
  dispatch(action);
};

export const clearTokenHistory = (): AppThunk => async (dispatch) => {
  dispatch({
    type: CLEAR_TOKEN_HISTORY,
  });
};
