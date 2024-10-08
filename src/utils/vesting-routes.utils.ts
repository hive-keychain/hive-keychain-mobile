import {SetWithdrawVestingRouteOperation} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Account} from 'actions/interfaces';
import {
  AccountVestingRoutesDifferences,
  UserVestingRoute,
  VestingRoute,
  VestingRouteDifference,
} from 'components/popups/vesting-routes/vesting-routes.interface';
import _ from 'lodash';
import {Key} from 'src/interfaces/keys.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {broadcast, getData} from './hive';

const getVestingRoutes = async (
  name: string,
  type: 'outgoing' | 'incoming' | 'all',
): Promise<VestingRoute[]> => {
  let vestingRoutes = await getData('condenser_api.get_withdraw_routes', [
    name,
    type,
  ]);
  return vestingRoutes.map((vestingRoute: any) => {
    return {
      fromAccount: vestingRoute.from_account,
      toAccount: vestingRoute.to_account,
      percent: vestingRoute.percent,
      autoVest: vestingRoute.auto_vest,
    } as VestingRoute;
  });
};

const getAllAccountsVestingRoutes = async (
  names: string[],
  type: 'outgoing' | 'incoming' | 'all',
) => {
  const allAccountsVestingRoutes: UserVestingRoute[] = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const vestingRoutes = await VestingRoutesUtils.getVestingRoutes(name, type);
    allAccountsVestingRoutes.push({
      account: name,
      routes: vestingRoutes,
    });
  }
  return allAccountsVestingRoutes;
};

const getLastVestingRoutes = async () => {
  const result: UserVestingRoute[] | null = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.LAST_VESTING_ROUTES),
  );
  return result ?? null;
};

const getChangedVestingRoutes = async (localAccounts: Account[]) => {
  let currentVestingRoutes = await VestingRoutesUtils.getAllAccountsVestingRoutes(
    localAccounts.map((acc) => acc.name),
    'outgoing',
  );
  const lastVestingRoutes = await VestingRoutesUtils.getLastVestingRoutes();

  if (!lastVestingRoutes) {
    VestingRoutesUtils.saveLastVestingRoutes(currentVestingRoutes);
    return undefined;
  } else {
    const unsavedAccountsVestingRoutes = currentVestingRoutes.filter(
      (e) => !lastVestingRoutes?.find((elt) => elt.account === e.account),
    );

    if (unsavedAccountsVestingRoutes.length) {
      VestingRoutesUtils.saveLastVestingRoutes([
        ...lastVestingRoutes,
        ...unsavedAccountsVestingRoutes,
      ]);
    }
  }

  let accountsVestingRoutesDifferences: AccountVestingRoutesDifferences[] = [];

  for (const account of localAccounts) {
    const accountVestingRoutesDifferences: AccountVestingRoutesDifferences = {
      account: account.name,
      differences: [],
    };
    const oldRoutes = lastVestingRoutes.find(
      (vestingRoute) => vestingRoute.account === account.name,
    );
    const currentRoutes = currentVestingRoutes.find(
      (vestingRoute) => vestingRoute.account === account.name,
    );

    // Compare
    if (!_.isEqual(oldRoutes, currentRoutes)) {
      if (oldRoutes)
        for (const oldRoute of oldRoutes.routes) {
          let difference: VestingRouteDifference = {};
          const foundInCurrentRoutes = currentRoutes?.routes.find(
            (route) => route.toAccount === oldRoute.toAccount,
          );
          if (foundInCurrentRoutes) {
            if (!_.isEqual(foundInCurrentRoutes, oldRoute)) {
              difference = {oldRoute, newRoute: foundInCurrentRoutes};
            }
          } else {
            difference = {oldRoute, newRoute: undefined};
          }
          accountVestingRoutesDifferences.differences.push(difference);
        }
      if (currentRoutes)
        for (const currentRoute of currentRoutes.routes) {
          let difference: VestingRouteDifference = {};
          const foundInOldRoutes = oldRoutes?.routes.find(
            (route) => route.toAccount === currentRoute.toAccount,
          );
          if (foundInOldRoutes) {
            if (!_.isEqual(foundInOldRoutes, currentRoute)) {
              if (
                !accountVestingRoutesDifferences.differences.find(
                  (diff) =>
                    diff.newRoute?.toAccount === currentRoute.toAccount &&
                    diff.oldRoute?.toAccount === foundInOldRoutes?.toAccount,
                )
              )
                difference = {
                  newRoute: currentRoute,
                  oldRoute: foundInOldRoutes,
                };
            }
          } else {
            difference = {oldRoute: undefined, newRoute: currentRoute};
          }
          if (difference.oldRoute || difference.newRoute) {
            accountVestingRoutesDifferences.differences.push(difference);
          }
        }
    }

    if (accountVestingRoutesDifferences.differences.length > 0) {
      //push but remove posible empty objects
      accountsVestingRoutesDifferences.push({
        account: accountVestingRoutesDifferences.account,
        differences: accountVestingRoutesDifferences.differences.filter(
          (i) => Object.keys(i).length,
        ),
      });
    }
  }

  return accountsVestingRoutesDifferences &&
    accountsVestingRoutesDifferences.length > 0 &&
    accountsVestingRoutesDifferences.some((a) => a.differences.length > 0)
    ? accountsVestingRoutesDifferences
    : undefined;
};

const saveLastVestingRoutes = async (vestingRoutes: UserVestingRoute[]) => {
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.LAST_VESTING_ROUTES,
    JSON.stringify(vestingRoutes),
  );
};

const sendVestingRoute = async (
  fromAccount: string,
  toAccount: string,
  percent: number,
  autoVest: boolean,
  activeKey: Key,
) => {
  return await broadcast(activeKey, [
    VestingRoutesUtils.getVestingRouteOperation(
      fromAccount,
      toAccount,
      percent,
      autoVest,
    ),
  ]);
};

const getVestingRouteOperation = (
  fromAccount: string,
  toAccount: string,
  percent: number,
  autoVest: boolean,
): SetWithdrawVestingRouteOperation => {
  return [
    'set_withdraw_vesting_route',
    {
      from_account: fromAccount,
      to_account: toAccount,
      percent: percent,
      auto_vest: autoVest,
    },
  ];
};

const skipAccountRoutes = async (
  differences: VestingRouteDifference[],
  account: string,
) => {
  let lastRoutes = await VestingRoutesUtils.getLastVestingRoutes();
  let lastUserRoutes = lastRoutes!.find((i) => i.account === account)!;
  differences.map((difference) => {
    if (difference.oldRoute && difference.newRoute) {
      const foundIndexInLast = lastUserRoutes?.routes.findIndex(
        (l) => l.toAccount === difference.newRoute?.toAccount,
      );
      if (foundIndexInLast !== undefined && foundIndexInLast > -1) {
        lastUserRoutes!.routes[foundIndexInLast] = difference.newRoute;
      }
    } else if (difference.newRoute) {
      lastUserRoutes?.routes.push(difference.newRoute);
    } else if (difference.oldRoute) {
      lastUserRoutes!.routes = lastUserRoutes!.routes.filter(
        (l) => l.toAccount !== difference.oldRoute?.toAccount,
      );
    }
  });
  await VestingRoutesUtils.saveLastVestingRoutes(lastRoutes!);
};

const revertAccountRoutes = async (
  accounts: Account[],
  differences: VestingRouteDifference[],
  account: string,
) => {
  const broadcastOperations: SetWithdrawVestingRouteOperation[] = [];
  const activeKey = accounts.find((a) => a.name === account)?.keys.active!;
  if (activeKey) {
    differences.map(({oldRoute, newRoute}) => {
      if (oldRoute) {
        const {fromAccount, toAccount, percent, autoVest} = oldRoute;
        broadcastOperations.push(
          getVestingRouteOperation(fromAccount, toAccount, percent, autoVest),
        );
      } else if (newRoute) {
        const {fromAccount, toAccount, autoVest} = newRoute;
        broadcastOperations.push(
          getVestingRouteOperation(fromAccount, toAccount, 0, autoVest),
        );
      }
    });
    try {
      const result = await broadcast(activeKey, broadcastOperations);
    } catch (error) {
      console.error('Error while reverting vesting route(s)', true);
    }
  }
};

export const VestingRoutesUtils = {
  getVestingRoutes,
  getAllAccountsVestingRoutes,
  getLastVestingRoutes,
  saveLastVestingRoutes,
  getChangedVestingRoutes,
  getVestingRouteOperation,
  sendVestingRoute,
  skipAccountRoutes,
  revertAccountRoutes,
};
