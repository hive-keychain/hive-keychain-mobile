import {renderHook} from '@testing-library/react-native';
import {useHasExpiration} from '../useHasExpiration';
import {goBack} from 'utils/navigation.utils';

jest.mock('utils/navigation.utils');

describe('useHasExpiration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onExpire callback after expiration', () => {
    const onExpire = jest.fn();
    const expiration = Date.now() + 1000;

    renderHook(() => useHasExpiration(expiration, onExpire));

    jest.advanceTimersByTime(1000);

    expect(onExpire).toHaveBeenCalled();
  });

  it('should call goBack if onExpire not provided', () => {
    const expiration = Date.now() + 1000;

    renderHook(() => useHasExpiration(expiration));

    jest.advanceTimersByTime(1000);

    expect(goBack).toHaveBeenCalled();
  });

  it('should not set timeout if expiration is falsy', () => {
    const onExpire = jest.fn();

    renderHook(() => useHasExpiration(0, onExpire));

    jest.advanceTimersByTime(1000);

    expect(onExpire).not.toHaveBeenCalled();
    expect(goBack).not.toHaveBeenCalled();
  });

  it('should cleanup timeout on unmount', () => {
    const onExpire = jest.fn();
    const expiration = Date.now() + 1000;

    const {unmount} = renderHook(() => useHasExpiration(expiration, onExpire));

    unmount();
    jest.advanceTimersByTime(1000);

    expect(onExpire).not.toHaveBeenCalled();
  });
});
