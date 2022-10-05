import {waitFor} from '@testing-library/react-native';
import {processSigningRequest} from 'utils/hiveAuthenticationService/messages/sign';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import processSigningRequestError from '__tests__/utils-for-testing/data/array-cases/error/process-signing-request-error';
import processSigningRequestOps from '__tests__/utils-for-testing/data/array-cases/success/process-signing-request-ops';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHAS_SignPayload from '__tests__/utils-for-testing/data/test-HAS_SignPayload';
import mockWebsocket from '__tests__/utils-for-testing/mocks/mock-websocket';
afterAllTest.clearAllMocks;
describe('sign tests:\n', () => {
  const {_default: has} = testHas;
  const {cases: errorCases} = processSigningRequestError;
  const {cases: operationCases} = processSigningRequestOps;
  describe('processSigningRequest cases:\n', () => {
    beforeEach(() => {
      mockWebsocket.prototype.send;
    });
    it('Must match each error case', async () => {
      const {_default: payload} = testHAS_SignPayload;
      for (let i = 0; i < errorCases.length; i++) {
        const element = errorCases[i];
        element.mocking();
        expect(await processSigningRequest(has, payload)).toBeUndefined();
        await element.assertion();
        element.toClear.forEach((spy) => spy.mockClear());
      }
    });
    it('Must call navigate on each case', async () => {
      for (let i = 0; i < operationCases.length; i++) {
        const {toMock, toAssert, toClear, payload} = operationCases[i];
        toMock();
        expect(await processSigningRequest(has, payload)).toBeUndefined();
        await waitFor(() => {
          toAssert();
        });
        toClear();
      }
    });
  });
});
