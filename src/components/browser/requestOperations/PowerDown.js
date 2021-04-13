import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {powerDown} from 'utils/hive';
import {connect} from 'react-redux';
import {sanitizeAmount} from 'utils/hiveUtils';
import {fromHP} from 'utils/format';

const PowerDown = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
  properties,
}) => {
  const {request_id, ...data} = request;
  const {username, steem_power: hp} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(
        `request.success.${
          parseFloat(hp) === 0 ? 'stop_power_down' : 'power_down'
        }`,
        {
          username,
          hp,
        },
      )}
      beautifyError
      method={'active'}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        const vesting_shares = sanitizeAmount(
          fromHP(sanitizeAmount(hp), properties.globals).toString(),
          'VESTS',
          6,
        );
        return await powerDown(key, {
          account: username,
          vesting_shares,
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${hp} HP`}
      />
    </RequestOperation>
  );
};

export default connect((state) => {
  return {
    properties: state.properties,
  };
})(PowerDown);
