import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {DepositSavings} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format.utils';
import {getCurrency} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: DepositSavings;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const DepositSavingsTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount, to, from} = transaction;
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
            name={Icons.SAVINGS}
            theme={theme}
            height={26}
            width={26}
            bgImage={<BackgroundIconRed />}
            color={'white'}
          />
        ) : null
      }
      textLine1={translate('wallet.operations.savings.info_deposit_savings', {
        amount: `${formattedAmount} ${getCurrency('HBD')}`,
      })}
      date={date}
    />
  );
};

export default DepositSavingsTransactionComponent;
