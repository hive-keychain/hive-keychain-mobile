import {waitFor} from '@testing-library/react-native';
import {RequestBroadcast} from 'utils/keychain.types';
import {requestWithoutConfirmation} from 'utils/requestWithoutConfirmation';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import testRequest from '__tests__/utils-for-testing/data/test-request';
import objects from '__tests__/utils-for-testing/helpers/objects';
import bridgeModuleMocks from '__tests__/utils-for-testing/mocks/as-module/as-index-file/bridge-module-mocks';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
afterAllTest.clearAllMocks;
describe('requestWithoutConfirmation tests:\n', () => {
  describe('requestWithoutConfirmation cases:\n', () => {
    it('Must decode without confirmation', async () => {
      bridgeModuleMocks.decodeMemo(false, 'decoded');
      const spySuccessCb = jest.fn().mockImplementation(() => {});
      requestWithoutConfirmation(
        [testAccount._default],
        {...testRequest.decode, request_id: 1000},
        spySuccessCb,
        () => {},
      );
      await waitFor(() => {
        const {calls} = spySuccessCb.mock;
        expect((calls[0][0] as any).result).toEqual('decoded');
      });
    });

    it('Must sign buffer without confirmation', async () => {
      bridgeModuleMocks.signBuffer(false, 'signed');
      const spySuccessCb = jest.fn().mockImplementation(() => {});
      requestWithoutConfirmation(
        [testAccount._default],
        {...testRequest.signBuffer, request_id: 1000},
        spySuccessCb,
        () => {},
      );
      await waitFor(() => {
        const {calls} = spySuccessCb.mock;
        expect((calls[0][0] as any).result).toEqual('signed');
      });
    });

    it('Must broadcast without confirmation', async () => {
      hiveUtilsMocks.broadcast(testBroadcastResponse.sucess);
      const spySuccessCb = jest.fn().mockImplementation(() => {});
      const cloneBroadcastRequest = objects.clone(
        testRequest.broadcast,
      ) as RequestBroadcast;
      cloneBroadcastRequest.operations = JSON.stringify(
        testOperation.filter((op) => op[0] === 'custom_json'),
      );
      requestWithoutConfirmation(
        [testAccount._default],
        {...cloneBroadcastRequest, request_id: 1000},
        spySuccessCb,
        () => {},
      );
      await waitFor(() => {
        const {calls} = spySuccessCb.mock;
        expect((calls[0][0] as any).result).toEqual(
          testBroadcastResponse.sucess,
        );
      });
    });

    //TODO complete cases.
    //  vote, post, custom, encode, signTx
  });
});
