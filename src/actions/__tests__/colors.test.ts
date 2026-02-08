import {getTokensBackgroundColors} from '../colors';
import {GET_BACKGROUND_COLORS} from '../types';
import {downloadTokenBackgroundColors} from 'utils/colors.utils';

jest.mock('utils/colors.utils');

describe('colors actions', () => {
  describe('getTokensBackgroundColors', () => {
    it('should dispatch action with downloaded colors', async () => {
      const mockColors = {
        HIVE: '#000000',
        HBD: '#FFFFFF',
      };
      (downloadTokenBackgroundColors as jest.Mock).mockResolvedValueOnce(
        mockColors,
      );

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = getTokensBackgroundColors();

      await thunk(dispatch, getState, undefined);

      expect(downloadTokenBackgroundColors).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_BACKGROUND_COLORS,
        payload: mockColors,
      });
    });
  });
});
