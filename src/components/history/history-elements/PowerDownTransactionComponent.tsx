import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {PowerDown} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format.utils';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: PowerDown;
  locale: string;
  theme: Theme;
  useIcon?: boolean;
  token?: boolean;
};

const PowerDownTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount} = transaction;
  const date = new Date(
    token ? (timestamp as unknown as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);
  const isCancellation = parseFloat(formattedAmount) === 0;
  const text = isCancellation
    ? translate('wallet.operations.powerdown.canceled_power_down')
    : translate('wallet.operations.powerdown.info_power_down', {
        amount: `${formattedAmount} ${amount.split(' ')[1]} `,
      });

  return (
    <ItemCardExpandable
      toggle
      setToggle={() => {}}
      theme={theme}
      textLine1={text}
      date={date}
      icon={
        useIcon ? (
          <Icon
            name={Icons.POWER_DOWN}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
            width={18}
            height={18}
          />
        ) : null
      }
    />
  );
};

export default PowerDownTransactionComponent;
