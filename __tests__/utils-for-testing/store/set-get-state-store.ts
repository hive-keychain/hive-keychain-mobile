import {store} from 'store';
import {RootState} from './fake-store';

const initialState = (fakeState: RootState) => {
  store.getState = jest.fn().mockImplementation(() => {
    return fakeState;
  });
};

const set = {initialState};

export default set;
