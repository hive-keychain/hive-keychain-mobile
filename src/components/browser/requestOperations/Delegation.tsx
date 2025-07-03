import {KeyTypes} from 'actions/interfaces';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {RootState} from 'store';
import {beautifyTransferError, fromHP} from 'utils/format';
import {delegate} from 'utils/hive';
import {sanitizeAmount} from 'utils/hiveUtils';
import {RequestDelegation, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestDelegation & RequestId;
} & RequestComponentCommonProps &
  PropsFromRedux;

const Delegation = ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
  properties,
}: Props) => {
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
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      selectedUsername={getUsername()}
      performOperation={async (options: TransactionOptions) => {
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
        return await delegate(
          getAccountKey(),
          {
            delegator: getUsername(),
            delegatee,
            vesting_shares,
          },
          options,
        );
      }}>
      <RequestUsername />
      <UsernameWithAvatar
        title={translate('request.item.delegatee')}
        username={delegatee}
        avatarPosition="left"
      />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${amount} ${unit}`}
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
export default connector(Delegation);
