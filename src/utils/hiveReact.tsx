import {ExtendedAccount} from '@hiveio/dhive';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import React from 'react';

export const getCurrencyProperties = (
  currency: string,
  account?: ExtendedAccount,
) => {
  let color, value, logo;
  switch (currency) {
    case 'HIVE':
      color = '#A3112A';
      logo = <Hive />;
      value = account ? account.balance : null;
      break;
    case 'HBD':
      color = '#005C09';
      value = account ? account.hbd_balance : null;
      logo = <Hbd />;
      break;
    default:
      color = '#AC4F00';
      value = account ? account.vesting_shares : null;
      logo = <Hp />;
      break;
  }
  return {currency, color, value, logo};
};
