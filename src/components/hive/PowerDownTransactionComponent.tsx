import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PowerDown} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

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
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);
  const isCancellation = parseFloat(formattedAmount) === 0;
  const text = isCancellation
    ? `${translate('wallet.operations.powerdown.cancelled_power_down')}`
    : `${translate('common.initiated_a')} ${formattedAmount} ${
        amount.split(' ')[1]
      } `;
  const text2 = isCancellation
    ? undefined
    : `${translate('wallet.operations.powerdown.info_power_down')}`;

  return (
    <ItemCardExpandable
      toggle
      setToggle={() => {}}
      theme={theme}
      textLine1={text}
      textLine2={text2}
      date={date}
      icon={
        useIcon ? (
          <Icon
            name={Icons.POWER_UP}
            theme={theme}
            additionalContainerStyle={getRotateStyle('180')}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
            width={24}
            height={24}
          />
        ) : null
      }
    />
  );
};

export default PowerDownTransactionComponent;
