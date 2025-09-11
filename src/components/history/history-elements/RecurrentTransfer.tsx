import {ActiveAccount, Transaction} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {RecurrentTransfer as RecurrentTransferInterface} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {capitalize, withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: Transaction;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const RecurrentTransfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, from, to, amount, memo, executions, recurrence} =
    transaction as RecurrentTransferInterface;
  const other = from === username ? to : from;
  const date = new Date(
    token ? (timestamp as unknown as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={translate(
        'wallet.operations.transfer.started_recurrent_transfer',
        {amount: `${formattedAmount} ${amount.split(' ')[1]}`},
      )}
      date={date}
      icon={
        useIcon ? (
          <Icon
            name={Icons.RECURRENT_TRANSFER}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
          />
        ) : null
      }
      memo={`${translate(
        'wallet.operations.transfer.start_recurrent_transfer_out',
        {
          other,
          recurrence,
          executions,
        },
      )} \n${
        memo.trim().length > 0
          ? `${capitalize(translate('common.memo'))}: ${memo}`
          : ''
      }`}
    />
  );
};

export default RecurrentTransfer;
