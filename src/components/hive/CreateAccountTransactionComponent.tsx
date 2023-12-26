import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CreateAccount} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: CreateAccount;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const CreateAccountTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, creator, new_account_name, fee} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedFee = withCommas(fee);

  return (
    <ItemCardExpandable
      theme={theme}
      toggle
      setToggle={() => {}}
      icon={
        useIcon ? (
          <Icon
            name={Icons.ACCOUNT_CREATE}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      date={date}
      textLine1={translate('wallet.claim.info_account_create', {
        fee: formattedFee,
        new_account_name,
      })}
    />
  );
};

export default CreateAccountTransactionComponent;
