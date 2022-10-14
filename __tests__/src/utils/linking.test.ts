import {waitFor} from '@testing-library/react-native';
import {HAS_ActionsTypes, HiveURIActionTypes} from 'actions/types';
import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {handleUrl} from 'utils/linking';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHAS_ConnectPayload from '__tests__/utils-for-testing/data/test-HAS_ConnectPayload';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import method from '__tests__/utils-for-testing/helpers/method';
import objects from '__tests__/utils-for-testing/helpers/objects';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import storeMock from '__tests__/utils-for-testing/mocks/store-mock';
afterAllTest.clearAllMocks;
describe('linking tests:\n', () => {
  describe('handleUrl cases:\n', () => {
    beforeEach(() => {
      navigationModuleMocks.goBack;
      storeMock.dispatch.omit;
    });
    afterEach(() => {
      method.clearSpies([
        asModuleSpy.navigation.goBack,
        storeMock.dispatch.omit,
      ]);
    });
    it('Must call dispatch', async () => {
      storeMock.dispatch.omit;
      handleUrl('https://discord.com/keychain');
      expect(storeMock.dispatch.omit).toBeCalledTimes(1);
    });

    it('Must call goBack if it is default qr url and call dispatch', async () => {
      expect(handleUrl('https://discord.com/keychain', true)).toBeUndefined();
      expect(asModuleSpy.navigation.goBack).toBeCalledTimes(1);
      expect(storeMock.dispatch.omit).toBeCalledTimes(1);
    });

    it('Must call process Op if url starts with hive://sign/op/', async () => {
      const originalTransfer = testOperation.filter(
        (op) => op[0] === 'transfer',
      )[0];
      handleUrl(
        'hive://sign/op/' + method.toBuffer(originalTransfer, 'base64'),
      );
      await waitFor(() => {
        expect(storeMock.dispatch.omit).toBeCalledWith({
          payload: originalTransfer,
          type: HiveURIActionTypes.SAVE_OPERATION,
        });
      });
    });

    it('Must call go back if url starts with hive://', () => {
      handleUrl('hive://api/', true);
      expect(asModuleSpy.navigation.goBack).toBeCalledTimes(1);
    });

    it('Must call dispatcher if auth_req', () => {
      handleUrl(
        'has://auth_req/' +
          method.toBuffer(testHAS_ConnectPayload._default, 'base64'),
      );
      const clonePayload = objects.cloneAndRemoveObjProperties(
        testHAS_ConnectPayload._default,
        ['auth_key'],
      ) as HAS_ConnectPayload & {
        key: string;
      };
      expect(storeMock.dispatch.omit).toBeCalledWith({
        payload: clonePayload,
        type: HAS_ActionsTypes.REQUEST,
      });
    });

    it('Must call go back if auth_req qr', () => {
      handleUrl(
        'has://auth_req/' +
          method.toBuffer(testHAS_ConnectPayload._default, 'base64'),
        true,
      );
      expect(asModuleSpy.navigation.goBack).toBeCalledTimes(1);
    });
  });
});
