import delegationsReducer from '../delegations';
import {FETCH_DELEGATEES, FETCH_DELEGATORS} from 'actions/types';
import {VestingDelegation} from '@hiveio/dhive';

describe('delegations reducer', () => {
  const initialState = {incoming: [], outgoing: []};

  it('should return initial state', () => {
    expect(delegationsReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle FETCH_DELEGATEES', () => {
    const outgoing: VestingDelegation[] = [
      {
        id: 1,
        delegator: 'user1',
        delegatee: 'user2',
        vesting_shares: {amount: '1000', precision: 3, nai: '@@000000037'},
        min_delegation_time: '2023-01-01T00:00:00',
      } as VestingDelegation,
    ];
    const action = {
      type: FETCH_DELEGATEES,
      payload: {outgoing, incoming: []},
    };
    const result = delegationsReducer(initialState, action);
    expect(result.outgoing).toEqual(outgoing);
    expect(result.incoming).toEqual([]);
  });

  it('should handle FETCH_DELEGATORS', () => {
    const incoming: VestingDelegation[] = [
      {
        id: 1,
        delegator: 'user2',
        delegatee: 'user1',
        vesting_shares: {amount: '2000', precision: 3, nai: '@@000000037'},
        min_delegation_time: '2023-01-01T00:00:00',
      } as VestingDelegation,
    ];
    const action = {
      type: FETCH_DELEGATORS,
      payload: {incoming, outgoing: []},
    };
    const result = delegationsReducer(initialState, action);
    expect(result.incoming).toEqual(incoming);
    expect(result.outgoing).toEqual([]);
  });

  it('should preserve existing delegations when updating one type', () => {
    const state = {
      incoming: [
        {
          id: 1,
          delegator: 'user2',
          delegatee: 'user1',
        } as VestingDelegation,
      ],
      outgoing: [],
    };
    const newOutgoing: VestingDelegation[] = [
      {
        id: 2,
        delegator: 'user1',
        delegatee: 'user3',
      } as VestingDelegation,
    ];
    const action = {
      type: FETCH_DELEGATEES,
      payload: {outgoing: newOutgoing, incoming: state.incoming},
    };
    const result = delegationsReducer(state, action);
    expect(result.outgoing).toEqual(newOutgoing);
    // The reducer spreads state, so incoming should be preserved from state
    expect(result.incoming).toEqual(state.incoming);
  });

  it('should return state unchanged for unknown action', () => {
    const state = {
      incoming: [],
      outgoing: [],
    };
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = delegationsReducer(state, action);
    expect(result).toEqual(state);
  });
});

