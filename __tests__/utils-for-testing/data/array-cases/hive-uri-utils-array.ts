import {Operation} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';
import {fn} from 'moment';
import accounts from 'reducers/accounts';
import {store} from 'store';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import method from '__tests__/utils-for-testing/helpers/method';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import mockKeychainComponent from '__tests__/utils-for-testing/mocks/component/mock-keychain-component';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import {RootState} from '__tests__/utils-for-testing/store/fake-store';
import testAccount from '../test-account';
import {initialEmptyStateStore} from '../test-initial-state';
import testOperation from '../test-operation';

const mocking = (mockAccounts: Account[], extraMock?: any) => {
  store.getState = jest.fn().mockImplementation(() => {
    return {
      ...initialEmptyStateStore,
      accounts: mockAccounts,
    } as RootState;
  });
  if (extraMock) extraMock();
};

const asserting = (op: Operation, extraAssertions?: any) => {
  const spy = () => jest.spyOn(store, 'dispatch');
  expect(spy()).toBeCalledWith('');
  //TODO: important -> next time look carefully at the code.
  //    -> the problem was, the function is not calling the dispatcher when there is accounts :S
  // const {calls} = storeSpy.dispatchWithoutImplementation.mock;
  // expect(calls[0][0]).toEqual({
  //   payload: op,
  //   type: HiveURIActionTypes.SAVE_OPERATION,
  // });
  if (extraAssertions) extraAssertions();
  method.clearSpies([storeSpy.dispatchWithoutImplementation]);
};

const cases = [
  // {
  //   op: testOperation.filter((op) => op[0] === 'transfer')[0] as Operation,
  //   accounts: [] as Account[],
  //   toMock: (accounts: Account[]) => mocking(accounts),
  //   toAssert: (op: Operation) => asserting(op),
  // },
  // {
  //   op: testOperation.filter(
  //     (op) => op[0] === 'delegate_vesting_shares',
  //   )[0] as Operation,
  //   accounts: [] as Account[],
  //   toMock: (accounts: Account[]) => mocking(accounts),
  //   toAssert: (op: Operation) => asserting(op),
  // },
  // {
  //   op: testOperation.filter(
  //     (op) => op[0] === 'account_witness_vote',
  //   )[0] as Operation,
  //   accounts: [] as Account[],
  //   toMock: (accounts: Account[]) => mocking(accounts),
  //   toAssert: (op: Operation) => asserting(op),
  // },
  {
    op: testOperation.filter(
      (op) => op[0] === 'account_witness_proxy',
    )[0] as Operation,
    accounts: [testAccount._default] as Account[],
    toMock: (accounts: Account[]) =>
      mocking(accounts, () => {
        mockKeychainComponent.validateAuthority({valid: false});
        navigationModuleMocks.navigate;
      }),
    toAssert: (op: Operation) =>
      asserting(op, () => {
        expect(asModuleSpy.navigation.navigate).toBeCalledWith('');
      }),
  },
  // {
  //   op: {0: 'account_create_with_delegation'} as Operation,
  //   accounts: [] as Account[],
  //   toMock: (accounts: Account[]) => mocking(accounts),
  //   toAssert: (op: Operation) => asserting(op),
  // },
];

export default {
  cases,
};
