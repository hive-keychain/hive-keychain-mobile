import {Account, KeyTypes, PubKeyTypes} from 'actions/interfaces';
import {signBuffer} from 'components/bridge';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {urlTransformer} from 'utils/browser';
import {beautifyIfJSON} from 'utils/format';
import {
  RequestError,
  RequestId,
  RequestSignBuffer,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestSignBuffer & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;
  const {
    getAccountKey,
    getAccountPublicKey,
    RequestUsername,
    getUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      message={
        username
          ? translate('request.message.signBuffer', {
              domain: urlTransformer(domain).hostname,
              method,
              username,
            })
          : translate('request.message.signBufferNoUsername', {
              domain: urlTransformer(domain).hostname,
              method,
            })
      }
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signBuffer')}
      errorMessage={translate('request.error.signBuffer')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      additionalData={{
        publicKey: getAccountPublicKey(),
      }}
      selectedUsername={getUsername()}
      performOperation={async () => {
        return performSignBufferOperation(getAccountKey(), message);
      }}>
      <RequestUsername />
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={beautifyIfJSON(message)}
      />
    </RequestOperation>
  );
};

const performSignBufferOperation = async (key: string, message: string) => {
  return await signBuffer(key, message);
};

export const signBufferWithoutConfirmation = (
  accounts: Account[],
  request: RequestSignBuffer & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  const {username, message, method} = request;
  processOperationWithoutConfirmation(
    () =>
      performSignBufferOperation(
        accounts.find((e) => e.name === username).keys[
          method.toLowerCase() as KeyTypes
        ],
        message,
      ),
    request,
    sendResponse,
    sendError,
    false,
    translate('request.success.signBuffer'),
    translate('request.error.signBuffer'),
    {
      publicKey: accounts.find((e) => e.name === username).keys[
        `${method.toLowerCase()}Pubkey` as PubKeyTypes
      ],
    },
  );
};
