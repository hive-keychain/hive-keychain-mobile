import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CollateralizedConvert} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

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
  );

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
      date={date}
      textLine1={translate('wallet.operations.convert.start_collateralized', {
        amount: `${formattedAmount} ${amount.split(' ')[1]}`,
      })}
    />
  );
};

export default CollateralizedConvertTransactionComponent;
