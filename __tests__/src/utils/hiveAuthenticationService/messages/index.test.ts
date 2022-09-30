import {waitFor} from '@testing-library/react-native';
import {onMessageReceived} from 'utils/hiveAuthenticationService/messages';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import onMessageReceivedError from '__tests__/utils-for-testing/data/array-cases/error/on-message-received-error';
import onMessageReceivedSucess from '__tests__/utils-for-testing/data/array-cases/success/on-message-received-sucess';
import testHas from '__tests__/utils-for-testing/data/test-has';
import authenticateModuleMocks from '__tests__/utils-for-testing/mocks/as-module/authenticate-module-mocks';
import challengeModuleMock from '__tests__/utils-for-testing/mocks/as-module/challenge-module-mock';
import signModuleMocks from '__tests__/utils-for-testing/mocks/as-module/sign-module-mocks';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import mockWebsocket from '__tests__/utils-for-testing/mocks/mock-websocket';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('index tests:\n', () => {
  const {_default: has} = testHas;
  const {cases: errorCases} = onMessageReceivedError;
  const {cases: successCases} = onMessageReceivedSucess;
  describe('onMessageReceived cases:\n', () => {
    beforeEach(() => {
      mockWebsocket.prototype.send;
    });
    it('Must log error on each case', async () => {
      for (let i = 0; i < errorCases.length; i++) {
        const element = errorCases[i];
        await onMessageReceived(element.webSocketEvent, has);
        expect(consoleSpy.log).toBeCalledWith(element.error);
      }
    });
    it('Must pass each case', async () => {
      mockHASClass.registerAccounts;
      authenticateModuleMocks.processAuthenticationRequest;
      signModuleMocks.processSigningRequest;
      challengeModuleMock.processChallengeRequest.processChallengeRequest;
      has.awaitingRegistration = ['theghost1980'];
      for (let i = 0; i < successCases.length; i++) {
        const element = successCases[i];
        const result = await onMessageReceived(element.webSocketEvent, has);
        await element.assertion(result, element.webSocketEvent, has);
        if (element.toClear) {
          element.toClear.forEach((spy) => spy.mockClear());
        }
      }
    });
  });
});
