import React from 'react';
import {StyleSheet, View} from 'react-native';
import PowerDownIcon from 'src/assets/icons/svgs/arrow_downward.svg';
import PowerUpIcon from 'src/assets/icons/svgs/arrow_upward.svg';
import ConvertIcon from 'src/assets/icons/svgs/currency_exchange.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import ClaimAccount from 'src/assets/icons/svgs/person_add.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
import DelegateIcon from 'src/assets/icons/svgs/swap_horiz.svg';

const getIconFilePath = (name: string, subType: string, style: any) => {
  switch (name) {
    case 'transfer' || 'recurrent_transfer' || 'fill_recurrent_transfer':
      return <TransferIcon style={style} />;
    case 'savings':
      return <SavingsIcon style={style} />;
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return <PowerUpIcon style={style} />;
        case 'withdraw_vesting':
          return <PowerDownIcon style={style} />;
      }
    case 'claim_reward_balance' || 'interest':
      return <ClaimIcon style={style} />;
    case 'delegate_vesting_shares':
      return <DelegateIcon style={style} />;
    case 'claim_account' || 'account_create' || 'create_claimed_account':
      return <ClaimAccount style={style} />;
    case 'convert':
      return <ConvertIcon style={style} />;
    case 'expand_more':
      return <ExpandMoreIcon style={style} />;
    case 'expand_less':
      return <ExpandLessIcon style={style} />;
    default:
      return <TransferIcon style={style} />;
  }
};

interface IconProps {
  onClick?: (params: any) => void;
  name: string;
  subType?: string;
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  //   if (props.onClick) {
  //     return (
  //       <TouchableOpacity onPress={props.onClick}>
  //         {renderImage()}
  //       </TouchableOpacity>
  //     );
  //   } else {
  const iconComponent = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
  );
  return <View>{iconComponent}</View>;
  //   }
};

const styles = StyleSheet.create({
  defaultIcon: {
    marginRight: 5,
  },
});

export default Icon;
