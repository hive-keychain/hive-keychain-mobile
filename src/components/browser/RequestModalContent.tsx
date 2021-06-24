import {Account} from 'actions/interfaces';
import Operation from 'components/operations/Operation';
import React from 'react';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Requests from './requestOperations';

type Props = {
  accounts: Account[];
  onForceCloseModal: () => void;
  sendError: () => void;
  sendResponse: () => void;
};
export default ({
  accounts,
  request,
  onForceCloseModal,
  sendResponse,
  sendError,
}: Props) => {
  const renderOperationDetails = () => {
    const type = capitalize(request.type);
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
  const getOperationTitle = ({type, title}) => {
    if (type === 'signBuffer' && title) {
      return title;
    }
    return translate(`request.title.${type}`);
  };
  //TODO : add dApp icon
  return (
    <Operation title={getOperationTitle(request)} onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};
