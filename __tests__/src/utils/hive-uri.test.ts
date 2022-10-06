import {processQRCodeOp} from 'utils/hive-uri';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import hiveUriUtilsArray from '__tests__/utils-for-testing/data/array-cases/hive-uri-utils-array';
import method from '__tests__/utils-for-testing/helpers/method';
afterAllTest.clearAllMocks;
describe('hive-uri.tsx tests:/n', () => {
  describe('processQRCodeOp cases:\n', () => {
    const {cases: processQRCodeOpCases, spies} = hiveUriUtilsArray;
    it('Must call dispatch on each case', async () => {
      for (let i = 0; i < processQRCodeOpCases.length; i++) {
        const element = processQRCodeOpCases[i];
        element.toMock(element.accounts);
        await processQRCodeOp(element.op);
        element.toAssert(element.op);
        method.clearSpies(spies);
      }
    });
  });
});