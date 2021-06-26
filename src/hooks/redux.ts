import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkAction} from 'redux-thunk';
import type {AppDispatch, RootState} from 'store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
