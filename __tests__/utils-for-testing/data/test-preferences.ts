import {UserPreference} from 'reducers/preferences.types';
import testAccount from './test-account';

const defaultPrefState = [
  {
    username: testAccount._default.name,
    domains: [
      {
        domain: 'domain',
        whitelisted_requests: ['request'],
      },
    ],
  },
] as UserPreference[];
const defaultPrefStateTwoUsers = [
  ...defaultPrefState,
  {
    username: 'theghost1980',
    domains: [
      {
        domain: 'domain_2',
        whitelisted_requests: ['request_ghost'],
      },
    ],
  },
] as UserPreference[];

const defaultError = [
  {
    username: testAccount._default.name,
  },
] as UserPreference[];

export default {defaultPrefState, defaultPrefStateTwoUsers, defaultError};
