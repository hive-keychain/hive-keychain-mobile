import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {CollateralizedConvert} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: CollateralizedConvert;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const CollateralizedConvertTransactionComponent = ({
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

  return (
    <ItemCardExpandable
      theme={theme}
      toggle
      setToggle={() => {}}
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
      date={date}
      textLine1={translate('wallet.operations.convert.started_a')}
      textLine2={` ${formattedAmount} ${amount.split(' ')[1]}`}
      textLine3={translate('wallet.operations.convert.start_collateralized')}
    />
  );
};

export default CollateralizedConvertTransactionComponent;
