import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {delegate} from 'utils/hive';
import RequestOperation from './components/RequestOperation';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import {beautifyTransferError} from 'utils/format';
import {connect} from 'react-redux';
import {sanitizeAmount} from 'utils/hiveUtils';
import {fromHP} from 'utils/format';

const Delegation = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
  properties,
}) => {
  const {request_id, ...data} = request;
  const {delegatee, unit, amount} = data;
  const {
    getUsername,
    getAccountKey,
    RequestUsername,
  } = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${
          parseFloat(amount) === 0 ? 'undelegate' : 'delegate'
        }`,
        {
          amount,
          unit,
          delegatee,
          username: getUsername(),
        },
      )}
      errorMessage={beautifyTransferError}
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        let vesting_shares;
        if (unit === 'VESTS') {
          vesting_shares = `${amount} ${unit}`;
        } else {
          vesting_shares = sanitizeAmount(
            fromHP(sanitizeAmount(amount), properties.globals).toString(),
            'VESTS',
            6,
          );
        }
        return await delegate(getAccountKey(), {
          delegator: getUsername(),
          delegatee,
          vesting_shares,
        });
      }}>
      <RequestUsername />
      <RequestItem
        title={translate('request.item.delegatee')}
        content={`@${delegatee}`}
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${unit}`}
      />
    </RequestOperation>
  );
};

export default connect((state) => {
  return {
    properties: state.properties,
  };
})(Delegation);
