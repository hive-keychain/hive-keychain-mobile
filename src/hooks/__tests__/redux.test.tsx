import React from 'react';
import {Provider} from 'react-redux';
import {renderHook} from '@testing-library/react-native';
import {store} from 'store';
import {useAppDispatch, useAppSelector} from '../redux';

const wrapper = ({children}: {children: React.ReactNode}) => (
  <Provider store={store}>{children}</Provider>
);

describe('redux hooks', () => {
  it('useAppDispatch returns the store dispatch function', () => {
    const {result} = renderHook(() => useAppDispatch(), {wrapper});

    expect(typeof result.current).toBe('function');
    expect(result.current).toBe(store.dispatch);
  });

  it('useAppSelector reads from the Redux state', () => {
    const {result} = renderHook(
      () => useAppSelector((state) => state.browser),
      {wrapper},
    );

    expect(result.current).toEqual(expect.any(Object));
  });
});
