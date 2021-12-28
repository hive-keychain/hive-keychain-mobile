import {goBack} from 'utils/navigation';

export const useHasExpiration = (expiration: number, onExpire?: () => void) => {
  setTimeout(onExpire || goBack, expiration - Date.now());
};
