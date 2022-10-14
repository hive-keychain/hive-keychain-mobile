import {waitFor} from '@testing-library/react-native';
import HAS from 'utils/hiveAuthenticationService';
import {
  answerFailedBroadcastReq,
  answerSuccessfulBroadcastReq,
} from 'utils/hiveAuthenticationService/helpers/sign';
import {HAS_SignPayload} from 'utils/hiveAuthenticationService/payloads.types';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testHas from '__tests__/utils-for-testing/data/test-has';
import testHAS_SignPayload from '__tests__/utils-for-testing/data/test-HAS_SignPayload';
import objects from '__tests__/utils-for-testing/helpers/objects';
import mockHASClass from '__tests__/utils-for-testing/mocks/mock-HAS-class';
import mockWebsocket from '__tests__/utils-for-testing/mocks/mock-websocket';
import hasSpy from '__tests__/utils-for-testing/mocks/spies/has-spy';
afterAllTest.clearAllMocks;
describe('sign tests:\n', () => {
  describe('answerSuccessfulBroadcastReq cases:\n', () => {
    it('Must throw an unhandled error', () => {
      const clonePayload = objects.clone(
        testHAS_SignPayload._default,
      ) as HAS_SignPayload;
      clonePayload.decryptedData.broadcast = false;
      try {
        answerSuccessfulBroadcastReq(testHas._default, clonePayload, {});
      } catch (error) {
        expect(error).toEqual(new Error('Transaction signing not implemented'));
      }
    });
    it('Must call send', async () => {
      answerSuccessfulBroadcastReq(
        testHas._default,
        testHAS_SignPayload._default,
        {id: 1},
      );
      await waitFor(() => {
        expect(hasSpy.send).toBeCalledWith(
          JSON.stringify({
            cmd: 'sign_ack',
            uuid: testHAS_SignPayload._default.uuid,
            broadcast: testHAS_SignPayload._default.decryptedData.broadcast,
            data: 1,
          }),
        );
      });
    });
  });
  describe('answerFailedBroadcastReq cases:\n', () => {
    beforeEach(() => {
      mockWebsocket.prototype.send;
    });
    it('Must call send with error', async () => {
      answerFailedBroadcastReq(
        testHas._default,
        testHAS_SignPayload._default,
        'passed_error',
      );
      await waitFor(() => {
        expect(hasSpy.send).toBeCalledWith(
          JSON.stringify({
            cmd: 'sign_nack',
            uuid: testHAS_SignPayload._default.uuid,
            error: 'passed_error',
          }),
        );
      });
    });
    it('Must call send with default error', async () => {
      answerFailedBroadcastReq(testHas._default, testHAS_SignPayload._default);
      await waitFor(() => {
        expect(hasSpy.send).toBeCalledWith(
          JSON.stringify({
            cmd: 'sign_nack',
            uuid: testHAS_SignPayload._default.uuid,
            error: 'Request was canceled by the user.',
          }),
        );
      });
    });
  });
});
