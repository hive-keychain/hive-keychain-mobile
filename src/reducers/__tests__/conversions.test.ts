import conversionsReducer from '../conversions';
import {FETCH_CONVERSION_REQUESTS} from 'actions/types';
import {Conversion} from 'actions/interfaces';

describe('conversions reducer', () => {
  const initialState: Conversion[] = [];

  it('should return initial state', () => {
    expect(conversionsReducer(undefined, {type: 'UNKNOWN'})).toEqual([]);
  });

  it('should handle FETCH_CONVERSION_REQUESTS', () => {
    const conversions: Conversion[] = [
      {
        id: 1,
        owner: 'user1',
        requestid: 123,
        amount: '100.000 HBD',
      } as Conversion,
      {
        id: 2,
        owner: 'user2',
        requestid: 124,
        amount: '200.000 HBD',
      } as Conversion,
    ];
    const action = {
      type: FETCH_CONVERSION_REQUESTS,
      payload: conversions,
    };
    const result = conversionsReducer(initialState, action);
    expect(result).toEqual(conversions);
  });

  it('should replace existing conversions', () => {
    const oldConversions: Conversion[] = [
      {id: 1, owner: 'user1'} as Conversion,
    ];
    const newConversions: Conversion[] = [
      {id: 2, owner: 'user2'} as Conversion,
    ];
    const state = conversionsReducer(initialState, {
      type: FETCH_CONVERSION_REQUESTS,
      payload: oldConversions,
    });
    const result = conversionsReducer(state, {
      type: FETCH_CONVERSION_REQUESTS,
      payload: newConversions,
    });
    expect(result).toEqual(newConversions);
    expect(result).not.toContainEqual(oldConversions[0]);
  });

  it('should handle empty conversions array', () => {
    const action = {
      type: FETCH_CONVERSION_REQUESTS,
      payload: [],
    };
    const result = conversionsReducer(initialState, action);
    expect(result).toEqual([]);
  });

  it('should return state unchanged for unknown action', () => {
    const state: Conversion[] = [
      {id: 1, owner: 'user1'} as Conversion,
    ];
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: [],
    };
    const result = conversionsReducer(state, action);
    expect(result).toEqual(state);
  });
});












