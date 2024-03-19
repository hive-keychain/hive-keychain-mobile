import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {ClaimReward} from 'src/interfaces/transaction.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

type Props = {
  user: ActiveAccount;
  transaction: ClaimReward;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const ClaimRewardTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const {timestamp, hbd, hp, hive} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const isZeroAmount = (amount: string) => {
    return Number(amount.split(' ')[0]) <= 0;
  };

  const isHBD = hbd && !isZeroAmount(hbd);
  const isHP = hp && !isZeroAmount(hp);
  const isHIVE = hive && !isZeroAmount(hive);

  const line1 =
    `${
      isHBD
        ? `${withCommas(hbd)} ${translate('wallet.claim.info_claim_rewards', {
            currency: 'HBD',
          })}${isHP ? '\n' : ''}`
        : ''
    }` +
    `${
      isHP
        ? `${withCommas(hp)} ${translate('wallet.claim.info_claim_rewards', {
            currency: 'HP',
          })}${isHIVE ? '\n' : ''}`
        : ''
    }` +
    `${
      isHIVE
        ? `${withCommas(hive)} ${translate('wallet.claim.info_claim_rewards', {
            currency: 'HIVE',
          })}`
        : ''
    }`;

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={line1}
      date={date}
      icon={
        <Icon
          name={Icons.INTEREST}
          theme={theme}
          bgImage={<BackgroundIconRed />}
          color={PRIMARY_RED_COLOR}
        />
      }
    />
  );
};

export default ClaimRewardTransactionComponent;
