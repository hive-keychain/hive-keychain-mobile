import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {
  HiveErrorMessage,
  KeychainRequest,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'src/interfaces/keychain.interface';
import {beautifyErrorMessage} from 'utils/keychain.utils';
import {translate} from 'utils/localize';

type RequestOperationErrorMessage =
  | string
  | ((
      msg: HiveErrorMessage,
      data: {currency?: string; username?: string; to?: string},
    ) => string);

type ExecuteRequestOperationParams = {
  request: KeychainRequest & RequestId;
  performOperation: (options: TransactionOptions) => Promise<any>;
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void;
  sendError: (msg: RequestError) => void;
  successMessage: string;
  errorMessage?: RequestOperationErrorMessage;
  additionalData?: object;
  beautifyError?: boolean;
  selectedUsername?: string;
  keep: boolean;
  addPreference: (username: string, domain: string, type: string) => void;
  domain: string;
  type: string;
  username?: string;
  has?: boolean;
  isMultisig: boolean;
  twoFABots: Record<string, string>;
};

export const executeRequestOperation = async ({
  request,
  performOperation,
  sendResponse,
  sendError,
  successMessage,
  errorMessage,
  additionalData = {},
  beautifyError,
  selectedUsername,
  keep,
  addPreference,
  domain,
  type,
  username,
  has,
  isMultisig,
  twoFABots,
}: ExecuteRequestOperationParams) => {
  const {request_id, ...data} = request;
  try {
    const result = await Promise.race([
      performOperation({
        metaData: {twoFACodes: twoFABots},
        multisig: isMultisig,
        fromWallet: false,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject('REQ_TIMEOUT'), 30000),
      ),
    ]);
    if (result && result.error) throw result.error;

    const response = {
      data,
      request_id,
      result,
      message: successMessage,
      ...additionalData,
    };
    if (selectedUsername) {
      response.data.username = selectedUsername;
    }
    if (keep && !has && username) {
      addPreference(username, domain, type);
    }
    sendResponse(response, keep);
    return successMessage;
  } catch (error) {
    let message: string;
    if (error === 'REQ_TIMEOUT') {
      message = isMultisig
        ? translate('multisig.pending')
        : translate('request.error.timeout');
    } else if (!beautifyError) {
      message =
        typeof errorMessage === 'function'
          ? errorMessage(error as HiveErrorMessage, data)
          : errorMessage ?? translate('request.error.unknown');
    } else {
      message = beautifyErrorMessage(error as HiveErrorMessage);
    }

    sendError({
      data,
      request_id,
      error: error === 'timeout' ? 'pending_multisig' : {},
      message,
    });
    return message;
  }
};

type ExecuteWithoutConfirmationParams = {
  performOperation: () => Promise<any>;
  request: KeychainRequest & RequestId;
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void;
  sendError: (msg: RequestError) => void;
  beautifyError: boolean;
  successMessage?: string;
  errorMessage?: string;
  additionalData?: any;
};

export const executeRequestOperationWithoutConfirmation = async ({
  performOperation,
  request,
  sendResponse,
  sendError,
  beautifyError,
  successMessage,
  errorMessage,
  additionalData,
}: ExecuteWithoutConfirmationParams) => {
  const {request_id, ...data} = request;
  try {
    const result = await performOperation();
    sendResponse({
      data,
      request_id,
      result,
      message: successMessage,
      ...additionalData,
    });
  } catch (error) {
    const message = beautifyError
      ? beautifyErrorMessage(error as HiveErrorMessage)
      : errorMessage;
    sendError({data, request_id, error: {}, message});
  }
};
