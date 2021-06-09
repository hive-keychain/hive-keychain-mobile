import {SET_RPC} from './types';

export const setRpc = (payload: string) => ({
  type: SET_RPC,
  payload,
});
