import {prepareRegistrationChallenge} from 'utils/hiveAuthenticationService/helpers/challenge';
import storeDispatch from '__tests__/utils-for-testing/data/store/store-dispatch';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHAS_ConnectPayload from '__tests__/utils-for-testing/data/test-HAS_ConnectPayload';
import bridgeModuleMocks from '__tests__/utils-for-testing/mocks/as-module/as-index-file/bridge-module-mocks';
import navigationModuleMocks from '__tests__/utils-for-testing/mocks/as-module/navigation-module-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import hasSpy from '__tests__/utils-for-testing/mocks/spies/has-spy';
import storeSpy from '__tests__/utils-for-testing/mocks/spies/store-spy';
describe('challenge tests:\n', () => {
  afterEach(async () => {
    await storeDispatch.clear('forgetAccounts');
    await storeDispatch.clear('HAS_CLEAR');
  });
  describe('prepareRegistrationChallenge cases:\n', () => {
    it('Must return key with challenge', async () => {
      bridgeModuleMocks.encodeMemo(false, 'challenge_encoded');
      await storeDispatch.one('ADD_ACCOUNT', {
        addAccount: {account: testAccount._default},
      });
      expect(
        await prepareRegistrationChallenge(
          testHas._default,
          testAccount._default.name,
          'server_key',
          'message',
        ),
      ).toEqual({
        challenge: 'challenge_encoded',
        key_type: 'memo',
        name: testAccount._default.name,
      });
    });
    it('Must throw error and return undefined if no key', async () => {
      expect(
        await prepareRegistrationChallenge(
          testHas._default,
          testAccount._default.name,
          'server_key',
          'message',
        ),
      ).toBe(undefined);
      expect(asModuleSpy.navigation.navigate).not.toBeCalled();
    });
    it('Must call navigate, dispatch & send', async () => {
      navigationModuleMocks.navigate;
      await storeDispatch.one('HAS_REQUEST', {
        treatHASRequest: {data: testHAS_ConnectPayload._default},
      });
      expect(
        await prepareRegistrationChallenge(
          testHas._default,
          testAccount._default.name,
          'server_key',
          'message',
        ),
      ).toBe(undefined);
      expect(asModuleSpy.navigation.navigate.mock.calls[0][0]).toBe(
        'ModalScreen',
      );
      expect(storeSpy.dispatch.mock.calls[0][0].type).toBe('HAS_REQUEST');
      expect(hasSpy.send).toBeCalledWith(
        JSON.stringify({
          cmd: 'auth_nack',
          uuid: testHAS_ConnectPayload._default.uuid,
        }),
      );
    });
  });
});
