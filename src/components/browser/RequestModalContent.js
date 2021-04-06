import React from 'react';
import Operation from 'components/operations/Operation';
import Requests from './requestOperations';
import {translate} from 'utils/localize';
import {capitalize} from 'utils/format';
import {goBack} from 'utils/navigation';
export default ({
  accounts,
  request,
  onForceCloseModal,
  sendResponse,
  sendError,
}) => {
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
