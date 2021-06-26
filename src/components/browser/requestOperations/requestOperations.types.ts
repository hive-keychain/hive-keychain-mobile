import {Account} from 'actions/interfaces';
import {RequestError, RequestSuccess} from 'utils/keychain.types';

export type RequestComponentCommonProps = {
  accounts: Account[];
  closeGracefully: () => void;
  sendResponse: (obj: RequestSuccess) => void;
  sendError: (obj: RequestError) => void;
};
