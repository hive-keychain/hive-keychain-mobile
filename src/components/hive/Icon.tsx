import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddCircleOutlineIcon from 'src/assets/icons/svgs/add_circle_outline.svg';
import PowerDownIcon from 'src/assets/icons/svgs/arrow_downward.svg';
import {
  default as ArrowUpwardIcon,
  default as PowerUpIcon,
} from 'src/assets/icons/svgs/arrow_upward.svg';
import ConvertIcon from 'src/assets/icons/svgs/currency_exchange.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
import DelegateIcon from 'src/assets/icons/svgs/swap_horiz.svg';

const getIconFilePath = (
  name: string,
  subType: string,
  style: any,
  marginRight?: boolean,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;
  switch (name) {
    case 'transfer':
    case 'recurrent_transfer':
    case 'fill_recurrent_transfer':
      return <TransferIcon style={finalStyleOnIcon} />;
    case 'savings':
      return <SavingsIcon style={finalStyleOnIcon} />;
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return <PowerUpIcon style={finalStyleOnIcon} />;
        case 'withdraw_vesting':
          return <PowerDownIcon style={finalStyleOnIcon} />;
      }
    case 'claim_reward_balance':
    case 'interest':
      return <ClaimIcon style={finalStyleOnIcon} />;
    case 'delegate_vesting_shares':
      return <DelegateIcon style={finalStyleOnIcon} />;
    case 'claim_account':
    case 'account_create':
    case 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} />;
    case 'convert':
      return <ConvertIcon style={finalStyleOnIcon} />;
    case 'expand_more':
      return <ExpandMoreIcon style={styles.defaultIconContainer} />;
    case 'expand_less':
      return <ExpandLessIcon style={styles.defaultIconContainer} />;
    case 'arrow_upward':
      return <ArrowUpwardIcon style={styles.defaultIconContainer} />;
    case 'add_circle_outline':
      return <AddCircleOutlineIcon style={styles.defaultIconContainer} />;
    default:
      return <TransferIcon style={finalStyleOnIcon} />;
  }
};

interface IconProps {
  onClick?: (params: any) => void;
  name: string;
  subType?: string;
  marginRight?: boolean;
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  //TODO finish when needed.
  //  to: open a link in browser.

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
    props.marginRight,
  );
  return <View style={styles.defaultIconContainer}>{iconComponent}</View>;
  //   }
};

const styles = StyleSheet.create({
  defaultIcon: {
    marginRight: 5,
  },
  defaultIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default Icon;
