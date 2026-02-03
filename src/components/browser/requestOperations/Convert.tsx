import {KeyTypes} from 'actions/interfaces';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {RequestConvert, RequestId} from 'src/interfaces/keychain.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getConversionRequests} from 'utils/hive.utils';
import {collateralizedConvert, convert} from 'utils/hiveLibs.utils';
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
  const {amount, collaterized} = data;
  const {getUsername, getAccountKey, RequestUsername} =
    usePotentiallyAnonymousRequest(request, accounts);
  const performOperation = async (options: TransactionOptions) => {
    const username = getUsername();
    const conversions = await getConversionRequests(username);
    const requestid = Math.max(...conversions.map((e) => e.requestid), 0) + 1;
    if (!collaterized) {
      return await convert(
        getAccountKey(),
        {
          owner: username,
          amount: `${amount} HBD`,
          requestid,
        },
        options,
      );
    } else {
      return await collateralizedConvert(
        getAccountKey(),
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
          title: 'request.item.amount',
          value: amount,
          currency: collaterized ? 'HIVE' : 'HBD',
          tag: ConfirmationDataTag.AMOUNT,
        },
      ]}
    />
  );
};
