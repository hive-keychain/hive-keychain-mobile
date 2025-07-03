import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {RootState} from 'store';
import {fromHP} from 'utils/format';
import {powerDown} from 'utils/hive';
import {sanitizeAmount} from 'utils/hiveUtils';
import {RequestId, RequestPowerDown} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';

type Props = {
  request: RequestPowerDown & RequestId;
} & RequestComponentCommonProps &
  PropsFromRedux;

const PowerDown = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
  properties,
}: Props) => {
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
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async (options: TransactionOptions) => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        const vesting_shares = sanitizeAmount(
          fromHP(sanitizeAmount(hp), properties.globals).toString(),
          'VESTS',
          6,
        );
        return await powerDown(
          key,
          {
            account: username,
            vesting_shares,
          },
          options,
        );
      }}>
      <UsernameWithAvatar
        title={translate('request.item.username')}
        username={username}
        avatarPosition="left"
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${hp} HP`}
      />
    </RequestOperation>
  );
};
const connector = connect((state: RootState) => {
  return {
    properties: state.properties,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PowerDown);
