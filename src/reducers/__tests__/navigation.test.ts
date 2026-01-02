import navigationReducer from '../navigation';
import {UPDATE_NAVIGATION_SCREEN} from 'actions/types';
import {BottomBarLink} from 'src/enums/bottomBarLink.enum';

describe('navigation reducer', () => {
  const initialState = {activeScreen: BottomBarLink.Wallet};

  it('should return initial state', () => {
    expect(navigationReducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle UPDATE_NAVIGATION_SCREEN', () => {
    const action = {
      type: UPDATE_NAVIGATION_SCREEN,
      payload: BottomBarLink.Browser,
    };
    const result = navigationReducer(initialState, action);
    expect(result.activeScreen).toBe(BottomBarLink.Browser);
  });

  it('should return state unchanged for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: '',
    };
    const result = navigationReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});


















