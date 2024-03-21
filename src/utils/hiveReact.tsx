import {ExtendedAccount} from '@hiveio/dhive';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import React from 'react';
import {withCommas} from './format';
//TODO after refactoring UI check if needed at all & remove component.
export const getCurrencyProperties = (
  currency: string,
  account?: ExtendedAccount,
) => {
  let color, value, logo;
  switch (currency) {
    case 'HIVE':
      color = '#A3112A';
      logo = <Hive />;
      value = account
        ? withCommas((account.balance as string).split(' ')[0]) +
          ' ' +
          (account.balance as string).split(' ')[1]
        : null;
      break;
    case 'HBD':
      color = '#005C09';
      value = account
        ? withCommas((account.hbd_balance as string).split(' ')[0]) +
          ' ' +
          (account.hbd_balance as string).split(' ')[1]
        : null;
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
