import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Transfer as TransferInterface} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: TransferInterface;
  locale: string;
  useIcon: boolean;
  theme: Theme;
  token?: boolean;
};
const Transfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, from, to, amount, memo} = transaction;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const operationDetails = {
    action:
      direction === '+'
        ? translate('wallet.operations.transfer.received')
        : translate('wallet.operations.transfer.sent'),
    actionFromTo:
      direction === '+'
        ? translate('wallet.operations.transfer.confirm.from')
        : translate('wallet.operations.transfer.confirm.to'),
  };
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={`${operationDetails.action} ${withCommas(amount)} ${
        amount.split(' ')[1]
      }`}
      textLine2={`${operationDetails.actionFromTo} @${other}`}
      date={date}
      icon={
        useIcon ? (
          <Icon
            name={transaction.type}
            subType={transaction.subType}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      memo={memo}
    />
  );
};

export default Transfer;
