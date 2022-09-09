import * as HiveAuthenticationServiceActions from 'actions/hiveAuthenticationService';
import {Account} from 'actions/interfaces';
import * as AccountsActions from 'src/actions/accounts';
import {store} from 'store';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import encryptUtilsModuleMocks from '__tests__/utils-for-testing/mocks/as-module/encrypt-utils-module-mocks';
import keychainStorageModuleMocks from '__tests__/utils-for-testing/mocks/as-module/keychain-storage-module-mocks';

type UpdateOnState = 'ADD_ACCOUNT' | 'HAS_REQUEST';
type Forget = 'forgetAccounts' | 'HAS_CLEAR';

const one = async (
  updateOnState: UpdateOnState,
  data?: {
    addAccount?: {
      account: Account;
    };
    treatHASRequest?: {
      data: HAS_ConnectPayload & {
        key: string;
      };
    };
  },
) => {
  //necessary mocks to use accounts.actions
  encryptUtilsModuleMocks.encryptJson('encrypted');
  keychainStorageModuleMocks.saveOnKeychain(false);

  switch (updateOnState) {
    case 'ADD_ACCOUNT':
      await store.dispatch<any>(
        AccountsActions.addAccount(
          data.addAccount.account.name,
          data.addAccount.account.keys,
          false,
          false,
        ),
      );
      break;
    case 'HAS_REQUEST':
      await store.dispatch<any>(
        HiveAuthenticationServiceActions.treatHASRequest(
          data.treatHASRequest.data,
        ),
      );
      break;
    default:
      break;
  }
};

const clear = async (forget: Forget) => {
  switch (forget) {
    case 'forgetAccounts':
      await store.dispatch<any>(AccountsActions.forgetAccounts());
      break;
    case 'HAS_CLEAR':
      await store.dispatch<any>(
        HiveAuthenticationServiceActions.clearHASState(),
      );
      break;
    default:
      break;
  }
};

export default {one, clear};
