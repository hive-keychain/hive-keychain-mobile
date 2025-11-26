import {
  addPreferenceToState,
  removePreferenceFromState,
  hasPreference,
} from '../preferences.utils';
import {UserPreference} from 'reducers/preferences.types';

describe('preferences.utils', () => {
  describe('addPreferenceToState', () => {
    it('should add preference for new user', () => {
      const state: UserPreference[] = [];
      const result = addPreferenceToState(
        state,
        'testuser',
        'example.com',
        'transfer',
      );
      expect(result).toEqual([
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ]);
    });

    it('should add preference for existing user and new domain', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      const result = addPreferenceToState(
        state,
        'testuser',
        'other.com',
        'delegate',
      );
      expect(result[0].domains).toHaveLength(2);
      expect(result[0].domains[1].domain).toBe('other.com');
    });

    it('should add request to existing domain', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      const result = addPreferenceToState(
        state,
        'testuser',
        'example.com',
        'delegate',
      );
      expect(result[0].domains[0].whitelisted_requests).toContain('transfer');
      expect(result[0].domains[0].whitelisted_requests).toContain('delegate');
    });

    it('should not add duplicate request', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      const result = addPreferenceToState(
        state,
        'testuser',
        'example.com',
        'transfer',
      );
      expect(result[0].domains[0].whitelisted_requests).toHaveLength(1);
    });
  });

  describe('removePreferenceFromState', () => {
    it('should remove request from domain', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer', 'delegate'],
            },
          ],
        },
      ];
      const result = removePreferenceFromState(
        state,
        'testuser',
        'example.com',
        'transfer',
      );
      expect(result[0].domains[0].whitelisted_requests).not.toContain('transfer');
      expect(result[0].domains[0].whitelisted_requests).toContain('delegate');
    });

    it('should remove domain when last request is removed', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      const result = removePreferenceFromState(
        state,
        'testuser',
        'example.com',
        'transfer',
      );
      expect(result).toEqual([]);
    });

    it('should return state unchanged if user not found', () => {
      const state: UserPreference[] = [];
      const result = removePreferenceFromState(
        state,
        'testuser',
        'example.com',
        'transfer',
      );
      expect(result).toEqual(state);
    });

    it('should return state unchanged if domain not found', () => {
      const state: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      const result = removePreferenceFromState(
        state,
        'testuser',
        'other.com',
        'transfer',
      );
      expect(result).toEqual(state);
    });
  });

  describe('hasPreference', () => {
    it('should return true if preference exists', () => {
      const preferences: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      expect(
        hasPreference(preferences, 'testuser', 'example.com', 'transfer'),
      ).toBe(true);
    });

    it('should return false if preference does not exist', () => {
      const preferences: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      expect(
        hasPreference(preferences, 'testuser', 'example.com', 'delegate'),
      ).toBe(false);
    });

    it('should return false if user not found', () => {
      const preferences: UserPreference[] = [];
      expect(
        hasPreference(preferences, 'testuser', 'example.com', 'transfer'),
      ).toBe(false);
    });

    it('should return false if domain not found', () => {
      const preferences: UserPreference[] = [
        {
          username: 'testuser',
          domains: [
            {
              domain: 'example.com',
              whitelisted_requests: ['transfer'],
            },
          ],
        },
      ];
      expect(
        hasPreference(preferences, 'testuser', 'other.com', 'transfer'),
      ).toBe(false);
    });
  });
});












