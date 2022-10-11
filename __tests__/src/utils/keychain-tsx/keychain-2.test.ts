import {KeyTypes} from 'actions/interfaces';
import {beautifyErrorMessage, getRequiredWifType} from 'utils/keychain';
import {
  HiveErrorMessage,
  KeychainKeyTypes,
  RequestCustomJSON,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testRequest from '__tests__/utils-for-testing/data/test-request';
import objects from '__tests__/utils-for-testing/helpers/objects';
afterAllTest.clearAllMocks;
describe('keychain.tsx part 2 tests:\n', () => {
  describe('getRequiredWifType cases:\n', () => {
    it('Must return lower case method on each', () => {
      [
        testRequest.decode,
        testRequest.encode,
        testRequest.signBuffer,
        testRequest.broadcast,
        testRequest.addaccountAuth,
        testRequest.removeAccountAuth,
        testRequest.removeKeyAuthority,
        testRequest.addKeyAuthority,
        testRequest.signTx,
        testRequest.custom,
      ].forEach((req) => {
        expect(getRequiredWifType(req)).toBe(req.method.toLowerCase());
      });
    });

    it('Must return posting method', () => {
      const clonedCustomRequest = objects.cloneAndRemoveObjProperties(
        testRequest.custom,
        ['method'],
      ) as RequestCustomJSON;
      [testRequest.post, testRequest.vote, clonedCustomRequest].forEach(
        (req) => {
          expect(getRequiredWifType(req)).toBe(
            KeychainKeyTypes.posting.toLowerCase(),
          );
        },
      );
    });

    it('Must return active method on each case', () => {
      [
        testRequest.transfer,
        testRequest.sendToken,
        testRequest.delegation,
        testRequest.witnessVote,
        testRequest.proxy,
        testRequest.powerUp,
        testRequest.powerDown,
        testRequest.createClaimedAccount,
        testRequest.createProposal,
        testRequest.removeProposal,
        testRequest.updateProposalVote,
        testRequest.convert,
        testRequest.recurrentTransfer,
      ].forEach((req) => {
        expect(getRequiredWifType(req)).toBe(
          KeychainKeyTypes.active.toLowerCase(),
        );
      });
    });

    it('Must return typeWif lower case method', () => {
      expect(getRequiredWifType(testRequest.signedCall)).toBe(
        KeyTypes.active.toLowerCase(),
      );
    });
  });

  describe('beautifyErrorMessage cases:\n', () => {
    it('Must return err.message', () => {
      const error = {
        message: 'error_message',
        code: 10,
      } as HiveErrorMessage;
      expect(beautifyErrorMessage(error)).toEqual(
        `${translate('request.error.ops')} : ${error.message}`,
      );
    });

    it('Must return description error', () => {
      const error = {
        message: 'Error:There was an error',
        code: 10,
      } as HiveErrorMessage;
      expect(beautifyErrorMessage(error)).toEqual(
        `${translate('request.error.ops')} : There was an error`,
      );
    });

    it('Must return exception error description', () => {
      const error = {
        message: 'Exception:There was an exception.rethrow',
        code: 10,
      } as HiveErrorMessage;
      expect(beautifyErrorMessage(error)).toEqual(
        `${translate('request.error.ops')} : There was an exception.`,
      );
    });
  });
});
