import {ActiveAccount, Transaction} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {FillRecurrentTransfer as FillRecurrentTransferInterface} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: Transaction;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const FillRecurrentTransfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {
    timestamp,
    from,
    to,
    amount,
    memo,
    remainingExecutions,
  } = transaction as FillRecurrentTransferInterface;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);

  const translationMessage =
    direction === '+'
      ? 'wallet.operations.transfer.fill_recurrent_transfer_in'
      : 'wallet.operations.transfer.fill_recurrent_transfer_out';

  const tempMemo =
    memo && memo.trim().length > 0
      ? `${translate('common.memo')}: ${memo}`
      : null;

  const finalMemo = `${translate(translationMessage, {
    other,
    remainingExecutions,
  })} ${tempMemo}`;

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={`${translate(
        direction === '+' ? 'common.received' : 'common.sent',
      )} ${formattedAmount} ${amount.split(' ')[1]}`}
      icon={
        useIcon ? (
          <Icon
            name={Icons.FILL_RECURRENT_TRANSFER}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      date={date}
      memo={finalMemo}
    />
  );
};

export default FillRecurrentTransfer;
