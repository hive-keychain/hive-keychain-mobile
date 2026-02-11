import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import {EscrowHistoryUtils} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {EscrowRelease} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {translateEscrowHistoryMessage} from '../../../utils/escrowHistory.utils';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: EscrowRelease;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const EscrowReleaseTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const date = new Date(
    token
      ? (transaction.timestamp as unknown as number) * 1000
      : transaction.timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const detail = translateEscrowHistoryMessage(
    EscrowHistoryUtils.getEscrowReleaseHistoryMessage(user.name!, transaction),
  );

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={detail}
      date={date}
      icon={
        useIcon ? (
          <Icon
            name={Icons.ESCROW}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
          />
        ) : null
      }
    />
  );
};

export default EscrowReleaseTransactionComponent;
