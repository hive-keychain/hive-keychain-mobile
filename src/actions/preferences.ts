import {PreferencePayload} from 'reducers/preferences.types';
import {ActionPayload} from './interfaces';
import {ADD_PREFERENCE, REMOVE_PREFERENCE} from './types';

export const addPreference = (
  username: string,
  domain: string,
  request: string,
): ActionPayload<PreferencePayload> => {
  return {
    type: ADD_PREFERENCE,
    payload: {
      username,
      domain,
      request,
    },
  };
};

export const removePreference = (
  username: string,
  domain: string,
  request: string,
): ActionPayload<PreferencePayload> => {
  return {
    type: REMOVE_PREFERENCE,
    payload: {
      username,
      domain,
      request,
    },
  };
};
