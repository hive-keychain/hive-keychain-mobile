import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {Convert} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format.utils';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: Convert;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const ConvertTransactionComponent = ({
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

  return (
    <ItemCardExpandable
      theme={theme}
      toggle
      setToggle={() => {}}
      icon={
        useIcon ? (
          <Icon
            name={Icons.CONVERT}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
            width={24}
            height={24}
          />
        ) : null
      }
      textLine1={translate('wallet.operations.convert.start_convert', {
        amount: `${formattedAmount} ${amount.split(' ')[1]}`,
      })}
      date={date}
    />
  );
};

export default ConvertTransactionComponent;
