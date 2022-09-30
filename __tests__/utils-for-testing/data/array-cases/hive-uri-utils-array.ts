import {Operation} from '@hiveio/dhive';
import {store} from 'store';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import method from '__tests__/utils-for-testing/helpers/method';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
import testOperation from '../test-operation';

const cases = [
  {
    op: testOperation.filter((op) => op[0] === 'transfer')[0] as Operation,
    toMock: () => {
      store.getState().account = jest.fn().mockReturnValue([]);
    },
    toAssert: () => {
      expect(storeSpy.dispatchWithoutImplementation).toBeCalledWith('');
      method.clearSpies([storeSpy.dispatchWithoutImplementation]);
    },
  },
];

export default {
  cases,
};
