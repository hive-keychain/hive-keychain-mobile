import {addPreference, removePreference} from '../preferences';
import {ADD_PREFERENCE, REMOVE_PREFERENCE} from '../types';

describe('preferences actions', () => {
  describe('addPreference', () => {
    it('should create action to add preference', () => {
      const action = addPreference('testuser', 'example.com', 'transfer');
      expect(action.type).toBe(ADD_PREFERENCE);
      expect(action.payload).toEqual({
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      });
    });
  });

  describe('removePreference', () => {
    it('should create action to remove preference', () => {
      const action = removePreference('testuser', 'example.com', 'transfer');
      expect(action.type).toBe(REMOVE_PREFERENCE);
      expect(action.payload).toEqual({
        username: 'testuser',
        domain: 'example.com',
        request: 'transfer',
      });
    });
  });
});
