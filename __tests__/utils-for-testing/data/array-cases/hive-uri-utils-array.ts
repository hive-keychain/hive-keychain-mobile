import {Operation} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';
import {fn} from 'moment';
import accounts from 'reducers/accounts';
import {store} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import method from '__tests__/utils-for-testing/helpers/method';
import {TestingNavigateParams} from '__tests__/utils-for-testing/interface/params';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import mockKeychainComponent from '__tests__/utils-for-testing/mocks/component/mock-keychain-component';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import {RootState} from '__tests__/utils-for-testing/store/fake-store';
import set from '__tests__/utils-for-testing/store/set-get-state-store';
import testAccount from '../test-account';
import {initialEmptyStateStore} from '../test-initial-state';
import testOperation from '../test-operation';

const mocking = (mockAccounts: Account[], extraMock?: any) => {
  set.initialState({...initialEmptyStateStore, accounts: mockAccounts});
  if (extraMock) extraMock();
};

const checkOnOperation = (op: Operation) => {
  const {calls} = storeSpy.dispatchWithoutImplementation.mock;
  expect(calls[0][0]).toEqual({
    payload: op,
    type: HiveURIActionTypes.SAVE_OPERATION,
  });
};

const checkNavigateParamToBe = (name: string) => {
  const {calls} = asModuleSpy.navigation.navigate.mock;
  expect(calls[0][0]).toBe('ModalScreen');
  expect((calls[0][1] as TestingNavigateParams).name).toBe(name);
};

const spies = [
  storeSpy.dispatchWithoutImplementation,
  asModuleSpy.navigation.navigate,
];

const cases = [
  {
    op: testOperation.filter((op) => op[0] === 'transfer')[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => {
      checkOnOperation(op);
    },
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'delegate_vesting_shares',
    )[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => {
      checkOnOperation(op);
    },
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'account_witness_vote',
    )[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => {
      checkOnOperation(op);
    },
  },
  {
    op: {0: 'account_create_with_delegation'} as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => {
      checkOnOperation(op);
    },
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'account_witness_proxy',
    )[0] as Operation,
    accounts: [testAccount._default] as Account[],
    toMock: (accounts: Account[]) =>
      mocking(accounts, () => {
        mockKeychainComponent.validateAuthority({valid: false, error: 'error'});
        navigationModuleMocks.navigate;
      }),
    toAssert: (op: Operation) => {
      checkNavigateParamToBe(`Operation_${op[1].type}`);
    },
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'account_witness_proxy',
    )[0] as Operation,
    accounts: [testAccount._default] as Account[],
    toMock: (accounts: Account[]) =>
      mocking(accounts, () => {
        mockKeychainComponent.validateAuthority({valid: true});
        navigationModuleMocks.navigate;
      }),
    toAssert: (op: Operation) => {
      checkNavigateParamToBe(ModalComponent.BROADCAST);
    },
  },
];

export default {
  cases,
  spies,
};
