import {Account} from 'actions/interfaces';
import Operation from 'components/operations/Operation';
import {useHasExpiration} from 'hooks/useHasExpiration';
import React from 'react';
import {
  KeychainRequest,
  RequestError,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Requests from './requestOperations';

type Props = {
  accounts: Account[];
  onForceCloseModal?: () => void;
  sendError: (obj: RequestError) => void;
  sendResponse: (obj: RequestSuccess) => void;
  request: KeychainRequest;
  expiration?: number;
};

export default ({
  accounts,
  request,
  onForceCloseModal,
  sendResponse,
  sendError,
  expiration,
}: Props) => {
  useHasExpiration(expiration);
  const renderOperationDetails = () => {
    console.log(request);
    const type = request.type;
    //@ts-ignore
    const Request = Requests[type];
    return (
      <Request
        request={request}
        accounts={accounts}
        sendResponse={sendResponse}
        sendError={sendError}
        closeGracefully={() => {
          goBack();
        }}
      />
    );
  };
  const getOperationTitle = (req: KeychainRequest) => {
    if (req.type === 'signBuffer' && req.title) {
      return req.title;
    }
    return translate(`request.title.${req.type}`);
  };
  //TODO : add dApp icon
  return (
    <Operation title={getOperationTitle(request)} onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};
