import {
  validateAuthority,
  validateRequest,
  getValidAuthorityAccounts,
  getRequestTitle,
  getRequiredWifType,
  beautifyErrorMessage,
  sleep,
} from '../keychain.utils';
import {Account, KeyTypes} from 'actions/interfaces';
import {KeychainRequestTypes} from 'src/interfaces/keychain.interface';

jest.mock('utils/localize', () => ({
  translate: (key: string, params?: Record<string, any>) => {
    if (params) {
      return `${key} ${JSON.stringify(params)}`;
    }
    return key;
  },
}));

describe('keychain.utils', () => {
  const mockAccounts: Account[] = [
    {
      name: 'user1',
      keys: {
        active: 'STM...',
        posting: 'STM...',
        memo: 'STM...',
      },
    } as Account,
    {
      name: 'user2',
      keys: {
        posting: 'STM...',
      },
    } as Account,
  ];

  describe('validateAuthority', () => {
    it('should return valid for addAccount request', () => {
      const result = validateAuthority(mockAccounts, {
        type: KeychainRequestTypes.addAccount,
      } as any);
      expect(result.valid).toBe(true);
    });

    it('should return invalid if account not found', () => {
      const result = validateAuthority(mockAccounts, {
        type: KeychainRequestTypes.transfer,
        username: 'nonexistent',
      } as any);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return invalid if required key missing', () => {
      const result = validateAuthority(mockAccounts, {
        type: KeychainRequestTypes.transfer,
        username: 'user2', // user2 doesn't have active key
      } as any);
      expect(result.valid).toBe(false);
    });

    it('should return valid if account has required key', () => {
      const result = validateAuthority(mockAccounts, {
        type: KeychainRequestTypes.transfer,
        username: 'user1',
      } as any);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateRequest', () => {
    it('should reject sendToken requests with empty amount', () => {
      expect(
        validateRequest({
          type: KeychainRequestTypes.sendToken,
          amount: '',
          to: 'user2',
          currency: 'BEE',
        } as any),
      ).toBe(false);
    });

    it('should reject malformed proposal id payloads', () => {
      expect(
        validateRequest({
          type: KeychainRequestTypes.updateProposalVote,
          username: 'user1',
          proposal_ids: 'not-json',
          approve: true,
        } as any),
      ).toBe(false);
    });

    it('should reject invalid comment options payloads', () => {
      expect(
        validateRequest({
          type: KeychainRequestTypes.post,
          username: 'user1',
          body: 'body',
          title: 'title',
          permlink: 'permlink',
          parent_perm: 'test',
          parent_username: '',
          json_metadata: '{}',
          comment_options: 'not-json',
        } as any),
      ).toBe(false);
    });
  });

  describe('getValidAuthorityAccounts', () => {
    it('should return accounts with required key type', () => {
      const result = getValidAuthorityAccounts(mockAccounts, KeyTypes.active);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('user1');
    });

    it('should return accounts with posting key', () => {
      const result = getValidAuthorityAccounts(mockAccounts, KeyTypes.posting);
      expect(result.length).toBe(2);
    });
  });

  describe('getRequestTitle', () => {
    it('should return custom title if provided', () => {
      const result = getRequestTitle({
        type: KeychainRequestTypes.transfer,
        title: 'Custom Title',
      } as any);
      expect(result).toBe('Custom Title');
    });

    it('should format type as title if no custom title', () => {
      const result = getRequestTitle({
        type: KeychainRequestTypes.transfer,
        title: 'title',
      } as any);
      expect(result).toContain('Transfer');
    });
  });

  describe('getRequiredWifType', () => {
    it('should return posting for vote request', () => {
      const result = getRequiredWifType({
        type: KeychainRequestTypes.vote,
      } as any);
      expect(result).toBe(KeyTypes.posting);
    });

    it('should return active for transfer request', () => {
      const result = getRequiredWifType({
        type: KeychainRequestTypes.transfer,
      } as any);
      expect(result).toBe(KeyTypes.active);
    });

    it('should return method for decode request', () => {
      const result = getRequiredWifType({
        type: KeychainRequestTypes.decode,
        method: 'Active',
      } as any);
      expect(result).toBe(KeyTypes.active);
    });
  });

  describe('beautifyErrorMessage', () => {
    it('should return null for empty error', () => {
      const result = beautifyErrorMessage(null as any);
      expect(result).toBeNull();
    });

    it('should extract error message after exception', () => {
      const result = beautifyErrorMessage({
        message: 'Exception: Some error message',
      } as any);
      expect(result).toContain('Some error message');
    });

    it('should extract error message after colon', () => {
      const result = beautifyErrorMessage({
        message: 'Error: Something went wrong',
      } as any);
      expect(result).toContain('Something went wrong');
    });
  });

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      jest.useFakeTimers();
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await promise;
      jest.useRealTimers();
    });
  });
});
