import {addAccount} from 'actions/index';
import {AccountKeys} from 'actions/interfaces';
import {ConfirmationDataTag} from 'components/operations/Confirmation';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {getClient} from 'utils/hive';
import {
  RequestAddAccount,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'utils/keychain.types';
import {getPublicKeyFromPrivateKeyString} from 'utils/keyValidation';
import {translate} from 'utils/localize';
import RequestOperation, {
  processOperationWithoutConfirmation,
} from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestAddAccount & RequestId;
} & RequestComponentCommonProps &
  PropsFromRedux;

const AddAccount = ({
  request,
  closeGracefully,
  sendResponse,
  sendError,
  addAccount,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, keys} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.addAccount', {username})}
      errorMessage={translate('request.error.addAccount')}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        return performAddAccountOperation(request, addAccount);
      }}
      confirmationData={[
        {
          title: 'request.item.username',
          value: `@${username}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.keys',
          value: JSON.stringify(keys, undefined, 2),
          tag: ConfirmationDataTag.COLLAPSIBLE,
          hidden: translate('request.item.hidden_data'),
        },
      ]}
    />
  );
};

const performAddAccountOperation = async (
  request: RequestAddAccount & RequestId,
  addAccount: (
    name: string,
    keys: AccountKeys,
    wallet: boolean,
    qr: boolean,
  ) => void,
) => {
  const {username, keys} = request;
  const account = (await getClient().database.getAccounts([username]))[0];
  const savedKeys: AccountKeys = keys;
  if (keys.memo) savedKeys.memoPubkey = account.memo_key;
  if (keys.active) {
    for (const active of account.active.key_auths) {
      if (
        getPublicKeyFromPrivateKeyString(keys.active) === (active[0] as string)
      )
        savedKeys.activePubkey = active[0] as string;
    }
    if (!savedKeys.activePubkey) throw new Error();
  }
  if (keys.posting) {
    for (const posting of account.posting.key_auths) {
      if (
        getPublicKeyFromPrivateKeyString(keys.posting) ===
        (posting[0] as string)
      )
        savedKeys.postingPubkey = posting[0] as string;
    }
    if (!savedKeys.postingPubkey) throw new Error();
  }
  addAccount(username, keys, false, false);
};

export const addAccountWithoutConfirmation = (
  request: RequestAddAccount & RequestId,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  addAccount: (
    name: string,
    keys: AccountKeys,
    wallet: boolean,
    qr: boolean,
  ) => void,
) => {
  processOperationWithoutConfirmation(
    async () => await performAddAccountOperation(request, addAccount),
    request,
    sendResponse,
    sendError,
    false,
    translate('request.success.addAccount'),
    translate('request.error.addAccount'),
  );
};

const connector = connect(null, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccount);
