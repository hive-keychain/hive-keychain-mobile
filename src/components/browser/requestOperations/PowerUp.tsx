import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {RequestId, RequestPowerUp} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {powerUp} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestPowerUp & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {recipient: to, steem: hive} = data;
  const {getUsername, getAccountKey, RequestUsername} =
    usePotentiallyAnonymousRequest(request, accounts);
  const performOperation = async (options: TransactionOptions) => {
    return await powerUp(
      getAccountKey(),
      {
        from: getUsername(),
        to,
        amount: `${hive} HIVE`,
      },
      options,
    );
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.power_up', {
        hive,
        to,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      RequestUsername={RequestUsername}
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.username',
          value: '',
          tag: ConfirmationDataTag.REQUEST_USERNAME,
        },
        {
          title: 'request.item.to',
          value: to,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.amount',
          value: hive,
          currency: 'HIVE',
          tag: ConfirmationDataTag.AMOUNT,
        },
      ]}
    />
  );
};
