import {combineReducers} from 'redux';

const dummyReducer = (state = {test: 0}, {type, payload}) => {
  switch (type) {
    default:
      return state;
  }
};

export default combineReducers({
  dummy: dummyReducer,
});
