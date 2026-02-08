import {setAccountValueDisplay} from '../accountValueDisplay';
import {SET_ACCOUNT_VALUE_DISPLAY} from '../types';

describe('accountValueDisplay actions', () => {
  describe('setAccountValueDisplay', () => {
    it('should create action to set account value display', () => {
      const value = 1234.56;
      const action = setAccountValueDisplay(value);
      expect(action.type).toBe(SET_ACCOUNT_VALUE_DISPLAY);
      expect(action.payload).toBe(value);
    });

    it('should handle zero value', () => {
      const action = setAccountValueDisplay(0);
      expect(action.payload).toBe(0);
    });

    it('should handle negative values', () => {
      const action = setAccountValueDisplay(-100);
      expect(action.payload).toBe(-100);
    });
  });
});
