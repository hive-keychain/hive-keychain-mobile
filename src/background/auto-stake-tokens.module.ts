import AsyncStorage from '@react-native-async-storage/async-storage';
import {Account, TokenBalance} from 'actions/interfaces';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {stakeToken} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {ObjectUtils} from 'utils/object.utils';
import {getUserBalance} from 'utils/tokens.utils';

let accounts: Account[];
const start = async (list: Account[]) => {
  console.info(
    `Will autostake tokens every ${ClaimsConfig.autoStakeTokens.FREQUENCY}m`,
  );
  timeOutAlarmHandler;
  accounts = list;
  await alarmHandler();
};

const alarmHandler = async () => {
  try {
    const [autoStakeUsernameList, autoStakeTokenList] = (
      await AsyncStorage.multiGet([
        KeychainStorageKeyEnum.HE_AUTO_STAKE,
        KeychainStorageKeyEnum.LAYER_TWO_AUTO_STAKE_TOKENS,
      ])
    ).map((e) => JSON.parse(e[1]));
    if (autoStakeUsernameList && autoStakeTokenList) {
      await initAutoStakeTokens(autoStakeUsernameList, autoStakeTokenList);
    }
  } catch (e) {
    console.log('error autostake token', e);
  }
};

const timeOutAlarmHandler = setInterval(
  alarmHandler,
  ClaimsConfig.autoStakeTokens.FREQUENCY * 1000 * 60,
);

const initAutoStakeTokens = async (
  autoStakeUserList: {[x: string]: boolean},
  autoStakeTokenList: {[x: string]: {symbol: string}[]},
) => {
  if (
    ObjectUtils.isPureObject(autoStakeUserList) &&
    ObjectUtils.isPureObject(autoStakeTokenList)
  ) {
    const users = Object.keys(autoStakeUserList).filter(
      (user) => autoStakeUserList[user] === true,
    );
    let tokens: any[] = [];
    Object.entries(autoStakeTokenList).map((value) => {
      if (value[1].length > 0) {
        tokens.push({
          user: value[0],
          tokenList: value[1].map((t) => t.symbol),
        });
      }
    });

    if (tokens.length > 0) {
      await iterateAutoStakeAccounts(users, tokens);
    }
  } else {
    console.error(
      'startAutoStakeTokens: autoStakeUserList/autoStakeTokenList not defined',
    );
  }
};

const iterateAutoStakeAccounts = async (
  users: string[],
  tokens: {
    user: string;
    tokenList: string[];
  }[],
) => {
  for (const acc of accounts) {
    let loggerMessage = null;
    if (!acc.keys.active) {
      loggerMessage = "Can't autostake token, active key is not in Keychain";
    }
    if (loggerMessage) {
      console.warn(`@${acc.name}` + loggerMessage);
      await AutomatedTasksUtils.saveUserAutoStake(acc.name, false);
      continue;
    }
    const userTokens = tokens.find((t) => t.user === acc.name);
    if (userTokens) {
      let tokensBalance: TokenBalance[] = (
        await getUserBalance(acc.name)
      ).filter(
        (tb) =>
          userTokens.tokenList.includes(tb.symbol) &&
          parseFloat(tb.balance) > 0,
      );
      let tokenOperationResult;
      for (const token of tokensBalance) {
        tokenOperationResult = await stakeToken(acc.keys.active!, acc.name!, {
          to: sanitizeUsername(acc.name!),
          symbol: token.symbol,
          quantity: sanitizeAmount(token.balance),
        });
        if (tokenOperationResult.id) {
          console.info(
            `autostake module staked ${token.balance} ${token.symbol} using @${acc.name}`,
          );
        }
      }
    }
  }
};

const AutoStakeTokensModule = {
  start,
};

export default AutoStakeTokensModule;
