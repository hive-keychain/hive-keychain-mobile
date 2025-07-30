import {KeyTypes} from 'actions/interfaces';
import {ConfirmationDataTag} from 'components/operations/ConfirmationCard';
import React from 'react';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {collateralizedConvert, convert} from 'utils/hive';
import {getConversionRequests} from 'utils/hiveUtils';
import {RequestConvert, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestConvert & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, amount, collaterized} = data;
  const performOperation = async (options: TransactionOptions) => {
    const account = accounts.find((e) => e.name === request.username);
    const key = account.keys.active;
    const conversions = await getConversionRequests(username);
    const requestid = Math.max(...conversions.map((e) => e.requestid), 0) + 1;
    if (!collaterized) {
      return await convert(
        key,
        {
          owner: username,
          amount: `${amount} HBD`,
          requestid,
        },
        options,
      );
    } else {
      return await collateralizedConvert(
        key,
        {
          owner: username,
          amount: `${amount} HIVE`,
          requestid,
        },
        options,
      );
    }
  };
  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate(`request.success.convert`, {
        amount,
        from: collaterized ? 'HIVE' : 'HBD',
        to: collaterized ? 'HBD' : 'HIVE',
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={performOperation}
      confirmationData={[
        {
          title: 'request.item.username',
          value: `@${username}`,
          tag: ConfirmationDataTag.USERNAME,
        },
        {
          title: 'request.item.amount',
          value: amount,
          currency: collaterized ? 'HIVE' : 'HBD',
          tag: ConfirmationDataTag.AMOUNT,
        },
      ]}
    />
  );
};
