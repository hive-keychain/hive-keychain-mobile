import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CreateClaimedAccount} from 'src/interfaces/transaction.interface';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: CreateClaimedAccount;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const CreateClaimedAccountTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, creator, new_account_name} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <ItemCardExpandable
      theme={theme}
      toggle
      setToggle={() => {}}
      icon={
        useIcon ? (
          <Icon
            name={Icons.CREATE_CLAIMED_ACCOUNT}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      date={date}
      textLine1={translate('wallet.claim.info_claim_account')}
      textLine2={`@${new_account_name}`}
    />
  );
};

export default CreateClaimedAccountTransactionComponent;
