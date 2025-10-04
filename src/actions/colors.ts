import {AppThunk} from 'hooks/redux';
import {Colors, downloadTokenBackgroundColors} from 'utils/colors.utils';
import {ActionPayload} from './interfaces';
import {GET_BACKGROUND_COLORS} from './types';

export const getTokensBackgroundColors = (): AppThunk => async (dispatch) => {
  const action: ActionPayload<Colors> = {
    type: GET_BACKGROUND_COLORS,
    payload: await downloadTokenBackgroundColors(),
  };
  dispatch(action);
};
