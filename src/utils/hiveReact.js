import React from 'react';
import Hive from 'assets/wallet/icon_hive.svg';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hp from 'assets/wallet/icon_hp.svg';

export const getCurrencyProperties = (currency, account) => {
  let color, value, logo;
  switch (currency) {
    case 'HIVE':
      color = '#A3112A';
      logo = <Hive />;
      value = account ? account.balance : null;
      break;
    case 'HBD':
      color = '#005C09';
      value = account ? account.sbd_balance : null;
      logo = <Hbd />;
      break;
    case 'HP':
      color = '#AC4F00';
      value = account ? account.vesting_shares : null;
      logo = <Hp />;
      break;
  }
  return {currency, color, value, logo};
};
