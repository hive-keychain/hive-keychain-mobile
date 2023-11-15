import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {FillCollateralizedConvert} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: FillCollateralizedConvert;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const FillCollateralizedConvertTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount_in, amount_out} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmountIn = withCommas(amount_in);
  const formattedAmountOut = withCommas(amount_out);

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
      textLine1={translate('wallet.operations.convert.fill_convert_request')}
      textLine2={` ${formattedAmountOut} ${
        amount_out.split(' ')[1]
      } => ${formattedAmountIn} ${amount_in.split(' ')[1]}`}
    />
  );
};

export default FillCollateralizedConvertTransactionComponent;
