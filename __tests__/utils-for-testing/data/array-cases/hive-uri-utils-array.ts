import {Operation} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';
import accounts from 'reducers/accounts';
import {store} from 'store';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import method from '__tests__/utils-for-testing/helpers/method';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import {RootState} from '__tests__/utils-for-testing/store/fake-store';
import testOperation from '../test-operation';

const mocking = (mockAccounts: Account[]) => {
  jest.mock('store', () => {
    return {
      getState: jest.fn().mockResolvedValue(mockAccounts),
    };
  });
};

const asserting = (op: Operation) => {
  const {calls} = storeSpy.dispatchWithoutImplementation.mock;
  expect(calls[0][0]).toEqual({
    payload: op,
    type: HiveURIActionTypes.SAVE_OPERATION,
  });
  method.clearSpies([storeSpy.dispatchWithoutImplementation]);
};

const cases = [
  {
    op: testOperation.filter((op) => op[0] === 'transfer')[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => asserting(op),
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'delegate_vesting_shares',
    )[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => asserting(op),
  },
  {
    op: testOperation.filter(
      (op) => op[0] === 'account_witness_vote',
    )[0] as Operation,
    accounts: [] as Account[],
    toMock: (accounts: Account[]) => mocking(accounts),
    toAssert: (op: Operation) => asserting(op),
  },
];

export default {
  cases,
};
