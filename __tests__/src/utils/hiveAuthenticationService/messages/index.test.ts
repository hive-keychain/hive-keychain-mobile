import HAS from 'utils/hiveAuthenticationService';
import { onMessageReceived } from 'utils/hiveAuthenticationService/messages';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import onMessageReceivedError from '__tests__/utils-for-testing/data/array-cases/error/on-message-received-error';
import onMessageReceivedSucess from '__tests__/utils-for-testing/data/array-cases/success/on-message-received-sucess';
import testHas from '__tests__/utils-for-testing/data/test-has';
import objects from '__tests__/utils-for-testing/helpers/objects';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('index tests:\n', () => {
  const {_default: has} = testHas;
  const { cases: errorCases } = onMessageReceivedError;
  const { cases: successCases} = onMessageReceivedSucess;
  describe('onMessageReceived cases:\n', () => {
    it('Must log error on each case', async () => {
      for (let i = 0; i < errorCases.length; i++) {
        const element = errorCases[i];
        await onMessageReceived(element.webSocketEvent, has);
        expect(consoleSpy.log).toBeCalledWith(element.error);
      }
    });
    it.skip('Must pass each case', async () => {
      const clone_has = objects.clone(has) as HAS;
      clone_has.awaitingRegistration = ['theghost1980'];
      for (let i = 0; i < successCases.length; i++) {
        const element = successCases[i];
        const result = await onMessageReceived(element.webSocketEvent, clone_has);
        element.assertion(result, element.webSocketEvent, clone_has);
        consoleSpy.log.mockClear();
      }
    });
  });
});
