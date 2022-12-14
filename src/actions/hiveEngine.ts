import hsc, {hiveEngineAPI} from 'api/hiveEngine';
import {AppThunk} from 'src/hooks/redux';
import {
  OperationsHiveEngine,
  Token,
  TokenBalance,
  TokenMarket,
  TokenTransaction,
} from 'src/interfaces/tokens.interface';
import {ActionPayload} from './interfaces'; //TODO check this: removed Token, TokenBalance, TokenMarket
import {
  CLEAR_TOKEN_HISTORY,
  CLEAR_USER_TOKENS,
  LOAD_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
  LOAD_USER_TOKENS,
} from './types';

export const loadTokens = (): AppThunk => async (dispatch) => {
  const action: ActionPayload<Token[]> = {
    type: LOAD_TOKENS,
    payload: await hsc.find('tokens', 'tokens', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadTokensMarket = (): AppThunk => async (dispatch) => {
  const action: ActionPayload<TokenMarket[]> = {
    type: LOAD_TOKENS_MARKET,
    payload: await hsc.find('market', 'metrics', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadUserTokens = (account: string): AppThunk => async (
  dispatch,
) => {
  try {
    console.log('about to clear user tokens'); //TODO to remove
    dispatch({
      type: CLEAR_USER_TOKENS,
    });
    console.log('about to find user tokens'); //TODO to remove
    let tokensBalance: TokenBalance[] = await hsc.find('tokens', 'balances', {
      account,
    });
    tokensBalance = tokensBalance
      .filter((t) => parseFloat(t.balance) !== 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
    const action: ActionPayload<TokenBalance[]> = {
      type: LOAD_USER_TOKENS,
      payload: tokensBalance,
    };
    console.log('about dispatch user tokens'); //TODO to remove
    dispatch(action);
  } catch (e) {
    console.log(e);
  }
};

//OLD way
// export const loadTokenHistory = (
//   account: string,
//   currency: string,
// ): AppThunk => async (dispatch) => {
//   dispatch({type: CLEAR_TOKEN_HISTORY});
//   //let tokenHistory: TokenTransaction[] = (
//   let tokenHistory: any[] = (
//     await hiveEngineAPI.get('accountHistory', {
//       params: {account, symbol: currency, type: 'user'},
//     })
//   ).data;

//   tokenHistory = tokenHistory
//     // .filter((e) => e.operation === 'tokens_transfer')
//     .map((e) => {
//       e.amount = `${e.quantity} ${e.symbol}`;
//       return e;
//     });
//   const action: ActionPayload<TokenTransaction[]> = {
//     type: LOAD_TOKEN_HISTORY,
//     payload: tokenHistory,
//   };
//   dispatch(action);
// };

//TODO new way, keepin consistency, remove comments when done & tested.
export const loadTokenHistory = (
  account: string,
  currency: string,
): AppThunk => async (dispatch) => {
  let tokenHistory: TokenTransaction[] = [];

  let start = 0;
  let previousTokenHistoryLength = 0;

  do {
    previousTokenHistoryLength = tokenHistory.length;
    let result: TokenTransaction[] = (
      await hiveEngineAPI.get('accountHistory', {
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

  //------- this is for debug -----//
  // let tokenOperationTypes = tokenHistory.map((e: any) => e.operation);
  // tokenOperationTypes = [...new Set(tokenOperationTypes)];
  // console.log(tokenOperationTypes);

  // for (const type of tokenOperationTypes) {
  //   console.log(tokenHistory.find((e: any) => e.operation === type));
  // }
  //-------------------------------//

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
          memo: t.memo,
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
  console.log('about to dispatch: ', {thL: tokenHistory.length}); //TODO to remove
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
