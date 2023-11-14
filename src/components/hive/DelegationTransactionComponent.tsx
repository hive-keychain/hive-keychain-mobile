import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Delegation} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: Delegation;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const DelegationTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, amount, delegatee, delegator} = transaction as Delegation;
  const direction = delegator === username ? '-' : '+';
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);
  const isCancellation = parseFloat(formattedAmount) === 0;
  const finalAmount = `${formattedAmount} ${amount.split(' ')[1]}`;
  const cancellationText = `${translate(
    'wallet.operations.delegation.cancelled_delegation',
    {
      delegatee,
    },
  )}`;
  const delegationText =
    direction === '+'
      ? `${translate('wallet.operations.delegation.info_delegation_in', {
          delegator: delegator,
        })} ${finalAmount}`
      : `${translate('wallet.operations.delegation.info_delegation_out', {
          delegatee,
        })} ${finalAmount}`;

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      icon={
        <Icon name={'delegate'} theme={theme} bgImage={<BackgroundIconRed />} />
      }
      textLine1={isCancellation ? cancellationText : delegationText}
      date={date}
      memo={undefined}
    />
  );
};

export default DelegationTransactionComponent;
