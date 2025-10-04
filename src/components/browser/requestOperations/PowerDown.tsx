import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {RequestId, RequestPowerDown} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {RootState} from 'store';
import {fromHP} from 'utils/format.utils';
import {sanitizeAmount} from 'utils/hive.utils';
import {powerDown} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

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
  const performOperation = async (options: TransactionOptions) => {
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
  };
  const successMessage = translate(
    `request.success.${
      parseFloat(hp) === 0 ? 'stop_power_down' : 'power_down'
    }`,
    {
      username,
      hp,
    },
  );
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={successMessage}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.username',
          value: username,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.amount',
          value: hp,
          currency: 'HP',
          tag: ConfirmationDataTag.AMOUNT,
        },
      ]}
    />
  );
};
const connector = connect((state: RootState) => {
  return {
    properties: state.properties,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PowerDown);
