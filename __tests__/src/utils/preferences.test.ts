import {UserPreference} from 'reducers/preferences.types';
import {
  addPreferenceToState,
  hasPreference,
  removePreferenceFromState,
} from 'utils/preferences';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testPreferences from '__tests__/utils-for-testing/data/test-preferences';
import objects from '__tests__/utils-for-testing/helpers/objects';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';
afterAllTest.clearAllMocks;
describe('preferences tests:\n', () => {
  const {defaultPrefState, defaultPrefStateTwoUsers} = testPreferences;
  const {defaultError} = testPreferences;
  const {name: username} = testAccount._default;
  describe('addPreferenceToState cases', () => {
    it('Must add preferences to empty state', () => {
      expect(addPreferenceToState([], username, 'domain', 'request')).toEqual(
        defaultPrefState,
      );
    });

    it('Must add request to previous state', () => {
      const clonePreferences = objects.clone(
        defaultPrefState,
      ) as UserPreference[];
      const cloneNewState = objects.clone(defaultPrefState) as UserPreference[];
      cloneNewState[0].domains[0].whitelisted_requests.push('request_2');
      expect(
        addPreferenceToState(clonePreferences, username, 'domain', 'request_2'),
      ).toEqual(cloneNewState);
    });
  });

  describe('removePreferenceFromState cases:\n', () => {
    it('Must return state if no user found', () => {
      const clonePreferences = objects.clone(
        defaultPrefState,
      ) as UserPreference[];
      expect(
        removePreferenceFromState(
          clonePreferences,
          'theghost1980',
          'domain',
          'request_a',
        ),
      ).toEqual(defaultPrefState);
    });

    it('Must return state if no domain found', () => {
      const clonePreferences = objects.clone(
        defaultPrefState,
      ) as UserPreference[];
      expect(
        removePreferenceFromState(
          clonePreferences,
          testAccount._default.name,
          'domain_2',
          'request_a',
        ),
      ).toEqual(defaultPrefState);
    });

    it('Must remove request from selected user and return state', () => {
      const clonePreferences = objects.clone(
        defaultPrefStateTwoUsers,
      ) as UserPreference[];
      expect(
        removePreferenceFromState(
          clonePreferences,
          username,
          'domain',
          'request',
        ),
      ).toEqual([defaultPrefStateTwoUsers[1]]);
    });
  });

  describe('hasPreference cases:\n', () => {
    it('Must return true', () => {
      expect(
        hasPreference(defaultPrefState, username, 'domain', 'request'),
      ).toBe(true);
    });

    it('Must return false', () => {
      expect(
        hasPreference(
          defaultPrefStateTwoUsers,
          username,
          'domain',
          'request_not_found',
        ),
      ).toBe(false);
    });

    it('Must catch error, call console and return false', () => {
      expect(hasPreference(defaultError, username, 'domain', 'request')).toBe(
        false,
      );
      expect(consoleSpy.log).toBeCalledWith(
        'catching',
        new TypeError("Cannot read property 'find' of undefined"),
      );
    });
  });
});
