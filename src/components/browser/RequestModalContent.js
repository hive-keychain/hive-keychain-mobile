import React from 'react';
import Operation from 'components/operations/Operation';
import {translate} from 'utils/localize';

export default ({accounts, request, onForceCloseModal}) => {
  const renderOperationDetails = () => {
    return null;
  };
  const getOperationTitle = ({type, title}) => {
    if (type === 'signBuffer' && title) {
      return title;
    }
    console.log(`request.title.${type}`, translate(`request.title.${type}`));
    return translate(`request.title.${type}`);
  };
  //TODO : add dApp icon
  return (
    <Operation title={getOperationTitle(request)} onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};
