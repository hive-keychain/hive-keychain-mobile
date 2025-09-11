import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrencyPrices, TokenBalance, TokenMarket} from 'actions/interfaces';
import api from 'api/keychain';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {toHP} from 'utils/format';
import {getHiveEngineTokenValue} from './hiveEngine';

export const getPrices = async () => {
  return (await api.get('/hive/v2/price')).data;
};

export const getAccountValue = async (
  {
    hbd_balance,
    balance,
    vesting_shares,
    savings_balance,
    savings_hbd_balance,
  }: ExtendedAccount,
  {hive, hive_dollar}: CurrencyPrices,
  props: DynamicGlobalProperties,
  userTokens: TokenBalance[],
  tokenMarket: TokenMarket[],
) => {
  if (!hive_dollar.usd || !hive.usd) return 0;
  const hiddenTokens: string[] = JSON.parse(
    (await AsyncStorage.getItem(KeychainStorageKeyEnum.HIDDEN_TOKENS)) || '[]',
  );
  return (
    (parseFloat(hbd_balance as string) +
      parseFloat(savings_hbd_balance as string)) *
      hive_dollar.usd +
    (toHP(vesting_shares as string, props) +
      parseFloat(balance as string) +
      parseFloat(savings_balance as string)) *
      hive.usd +
    userTokens
      .map((userToken) => {
        // Ignore hidden tokens
        if (hiddenTokens.find((e) => e === userToken.symbol)) return 0;
        const tokenInHive = getHiveEngineTokenValue(userToken, tokenMarket);
        const tokenInUSD = tokenInHive * hive.usd;
        return tokenInUSD;
      })
      .reduce((a, b) => a + b, 0)
  ).toFixed(3);
};
