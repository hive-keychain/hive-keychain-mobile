import {ActionPayload} from 'actions/interfaces';
import {GET_ECOSYSTEM} from 'actions/types';
import {dAppCategory} from 'components/browser/HomeTab/Explore';

const ecosystemReducer = (
  state: dAppCategory[] = [],
  {type, payload}: ActionPayload<dAppCategory[]>,
) => {
  switch (type) {
    case GET_ECOSYSTEM:
      return [...payload];
    default:
      return state;
  }
};

export default ecosystemReducer;
