import {processSigningRequest} from 'utils/hiveAuthenticationService/messages/sign';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import processSigningRequestError from '__tests__/utils-for-testing/data/array-cases/error/process-signing-request-error';
import processSigningRequestOneOp from '__tests__/utils-for-testing/data/array-cases/success/process-signing-request-one-op';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import testHAS_SignPayload from '__tests__/utils-for-testing/data/test-HAS_SignPayload';
afterAllTest.clearAllMocks;
describe('sign tests:\n', () => {
  const {_default: has} = testHas;
  const {_default: payload} = testHAS_SignPayload;
  const {_default: session} = testHAS_Session.has_session;
  const {cases: errorCases} = processSigningRequestError;
  const {cases: oneOpCases} = processSigningRequestOneOp;
  describe('processSigningRequest cases:\n', () => {
    it('Must match each error case', async () => {
      for (let i = 0; i < errorCases.length; i++) {
        const element = errorCases[i];
        element.mocking();
        expect(await processSigningRequest(has, payload)).toBeUndefined();
        element.assertion();
        element.toClear.forEach((spy) => spy.mockClear());
      }
    });
    it('Must call navigate on each case', async () => {
      for (let i = 0; i < oneOpCases.length; i++) {
        const element = oneOpCases[i];
        await element.mocking();
        expect(await processSigningRequest(has, payload)).toBeUndefined();
        element.assertion();
        element.toClear.forEach((spy) => spy.mockClear());
      }
    });
  });
});
