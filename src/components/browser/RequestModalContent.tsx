import {Account} from 'actions/interfaces';
import Operation from 'components/operations/Operation';
import {useHasExpiration} from 'hooks/useHasExpiration';
import React from 'react';
import {
  KeychainRequest,
  RequestError,
  RequestSuccess,
} from 'src/interfaces/keychain.interface';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation.utils';
import Requests from './requestOperations';

type Props = {
  accounts: Account[];
  onForceCloseModal?: () => void;
  sendError: (obj: RequestError) => void;
  sendResponse: (obj: RequestSuccess, keep?: boolean) => void;
  request: KeychainRequest;
  expiration?: number;
};

const RequestModalContent = ({
  accounts,
  request,
  onForceCloseModal,
  sendResponse,
  sendError,
  expiration,
}: Props) => {
  useHasExpiration(expiration);
  const renderOperationDetails = () => {
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
  return (
    <Operation title={getOperationTitle(request)} onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};

export default RequestModalContent;
