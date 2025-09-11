import {useEffect} from 'react';
import {goBack} from 'utils/navigation.utils';

export const useHasExpiration = (expiration: number, onExpire?: () => void) => {
  if (!expiration) return;
  useEffect(() => {
    const timeout = setTimeout(onExpire || goBack, expiration - Date.now());
    return () => {
      clearTimeout(timeout);
    };
  }, []);
};
