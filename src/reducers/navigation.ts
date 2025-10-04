import {ActionPayload} from 'actions/interfaces';
import {UPDATE_NAVIGATION_SCREEN} from 'actions/types';
import {BottomBarLink} from 'src/enums/bottomBarLink.enum';

export default (
  state: {activeScreen: string} = {activeScreen: BottomBarLink.Wallet},
  {type, payload}: ActionPayload<string>,
) => {
  switch (type) {
    case UPDATE_NAVIGATION_SCREEN:
      return {...state, activeScreen: payload};
    default:
      return state;
  }
};
