import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {ReceivedInterests} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format.utils';
import {getCurrency} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: ReceivedInterests;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const ReceivedInterestTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, interest} = transaction;
  const date = new Date(
    token ? (timestamp as unknown as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={true}
      setToggle={() => {}}
      icon={
        useIcon ? (
          <Icon
            name={Icons.SAVINGS}
            theme={theme}
            bgImage={<BackgroundIconRed />}
            color={PRIMARY_RED_COLOR}
          />
        ) : null
      }
      date={date}
      textLine1={translate(
        'wallet.operations.savings.info_received_interests',
        {
          amount: `${withCommas(interest)} ${getCurrency('HBD')}`,
        },
      )}
    />
  );
};

export default ReceivedInterestTransactionComponent;
