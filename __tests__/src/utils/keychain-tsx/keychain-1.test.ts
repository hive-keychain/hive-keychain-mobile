import {Account, KeyTypes} from 'actions/interfaces';
import {MutableRefObject} from 'react';
import WebView from 'react-native-webview';
import {
  getValidAuthorityAccounts,
  sendError,
  sendResponse,
  validateAuthority,
} from 'utils/keychain';
import {translate} from 'utils/localize';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testRequest from '__tests__/utils-for-testing/data/test-request';
import method from '__tests__/utils-for-testing/helpers/method';
import objects from '__tests__/utils-for-testing/helpers/objects';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('keychain.tsx part 1 tests:\n', () => {
  const accounts = [testAccount._default];
  describe('validateAuthority cases:\n', () => {
    it('Must validate request', () => {
      expect(validateAuthority(accounts, testRequest.addaccountAuth)).toEqual({
        valid: true,
      });
    });

    it('Must validate addaccount request', () => {
      expect(validateAuthority(accounts, testRequest.addAccount)).toEqual({
        valid: true,
      });
    });

    it('Must return error if no account found', () => {
      const cloneAccounts = objects.clone(accounts) as Account[];
      cloneAccounts[0].name = 'theghost1980';
      expect(validateAuthority(cloneAccounts, testRequest.post)).toEqual({
        valid: false,
        error: translate('request.error.no_account', {
          account: testAccount._default.name,
        }),
      });
    });

    it('Must return error if key found', () => {
      const cloneAccounts = objects.clone(accounts) as Account[];
      delete cloneAccounts[0].keys.posting;
      expect(validateAuthority(cloneAccounts, testRequest.post)).toEqual({
        valid: false,
        error: translate('request.error.no_auth', {
          account: testAccount._default.name,
          auth: 'posting',
        }),
      });
    });

    it('Must return valid if found on no_usernames_types', () => {
      expect(validateAuthority(accounts, testRequest.witnessVote)).toEqual({
        valid: true,
      });
    });

    it('Must return error if key not found on no_usernames_types', () => {
      const cloneAccounts = objects.clone(accounts) as Account[];
      delete cloneAccounts[0].keys.active;
      expect(validateAuthority(cloneAccounts, testRequest.witnessVote)).toEqual(
        {
          valid: false,
          error: translate('request.error.no_active_auth'),
        },
      );
    });
  });

  describe('getValidAuthorityAccounts cases:\n', () => {
    it('Must return no accounts', () => {
      const cloneAccounts = objects.clone(accounts) as Account[];
      delete cloneAccounts[0].keys.active;
      expect(getValidAuthorityAccounts(cloneAccounts, KeyTypes.active)).toEqual(
        [],
      );
    });

    it('Must return valid accounts', () => {
      expect(getValidAuthorityAccounts(accounts, KeyTypes.active)).toEqual(
        accounts,
      );
    });
  });

  describe('sendError cases:\n', () => {
    afterEach(() => {
      method.clearSpies([consoleSpy.log]);
    });
    it('Must call log & injectJavaScript', () => {
      const error = testRequest.error(testRequest.post);
      const tabRefWebView = {
        current: {injectJavaScript: {}},
      } as MutableRefObject<WebView>;
      tabRefWebView.current.injectJavaScript = jest.fn();
      expect(sendError(tabRefWebView, error)).toBeUndefined();
      expect(consoleSpy.log).toBeCalledWith('send error');
      expect(tabRefWebView.current.injectJavaScript).toBeCalledWith(
        `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
          {success: false, result: null, ...error},
        )})`,
      );
    });
  });

  describe('sendResponse cases:\n', () => {
    it('Must call injectJavaScript', () => {
      const success = testRequest.success(testRequest.post);
      const tabRefWebView = {
        current: {injectJavaScript: {}},
      } as MutableRefObject<WebView>;
      tabRefWebView.current.injectJavaScript = jest.fn();
      expect(sendResponse(tabRefWebView, success)).toBeUndefined();
      expect(tabRefWebView.current.injectJavaScript).toBeCalledWith(
        `window.hive_keychain.onAnswerReceived("hive_keychain_response",${JSON.stringify(
          {success: true, error: null, ...success},
        )})`,
      );
    });
  });
});
