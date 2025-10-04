import {ActionPayload} from 'actions/interfaces';
import {ADD_PREFERENCE, REMOVE_PREFERENCE} from 'actions/types';
import {
  addPreferenceToState,
  removePreferenceFromState,
} from 'utils/preferences.utils';
import {PreferencePayload, UserPreference} from './preferences.types';

const preferences = (
  state: UserPreference[] = [],
  {type, payload}: ActionPayload<PreferencePayload>,
): UserPreference[] => {
  switch (type) {
    case ADD_PREFERENCE:
      const {username, domain, request} = payload;
      return addPreferenceToState(state, username, domain, request);
    case REMOVE_PREFERENCE: {
      const {username, domain, request} = payload;
      return removePreferenceFromState(state, username, domain, request);
    }
    default:
      return state;
  }
};
export default preferences;
