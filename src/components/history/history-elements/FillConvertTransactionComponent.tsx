import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {FillConvert} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format.utils';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: FillConvert;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const FillConvertTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount_in, amount_out} = transaction;
  const date = new Date(
    token ? (timestamp as unknown as number) * 1000 : timestamp,
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
            name={Icons.CONVERT}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
            width={24}
            height={24}
          />
        ) : null
      }
      date={date}
      textLine1={translate('wallet.operations.convert.fill_convert_request')}
      textLine2={`${formattedAmountOut} ${
        amount_out.split(' ')[1]
      } => ${formattedAmountIn} ${amount_in.split(' ')[1]}`}
    />
  );
};

export default FillConvertTransactionComponent;
