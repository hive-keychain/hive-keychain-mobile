import {onMessageReceived} from 'utils/hiveAuthenticationService/messages';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHas from '__tests__/utils-for-testing/data/test-has';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('index tests:\n', () => {
  const {_default: has} = testHas;
  describe('onMessageReceived cases:\n', () => {
    it.skip('Must log error on each case', async () => {
      const errors = [
        {
          description: 'no cmd',
          error: new Error(`invalid payload (cmd)`),
          webSocketEvent: {payload: 'string_data'} as WebSocketMessageEvent,
        },
        {
          description: 'no cmd on cases, default',
          error: new Error('Invalid payload (unknown cmd)'),
          webSocketEvent: {
            payload: 'string_data',
            cmd: 'unknown_cmd',
          } as WebSocketMessageEvent,
        },
      ];
      for (let i = 0; i < errors.length; i++) {
        const element = errors[i];
        expect(
          await onMessageReceived(element.webSocketEvent, has),
        ).toBeUndefined();
        expect(consoleSpy.log).toBeCalledWith(element.error);
        consoleSpy.log.mockReset();
      }
    });
  });
});
