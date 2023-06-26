import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AddCircleOutlineIcon from 'src/assets/icons/svgs/add_circle_outline.svg';
import PowerDownIcon from 'src/assets/icons/svgs/arrow_downward.svg';
import {
  default as ArrowUpwardIcon,
  default as PowerUpIcon,
} from 'src/assets/icons/svgs/arrow_upward.svg';
import ServerUnavailable from 'src/assets/icons/svgs/cloud_off.svg';
import ConvertIcon from 'src/assets/icons/svgs/currency_exchange.svg';
import DeleteIcon from 'src/assets/icons/svgs/delete_black.svg';
import Engineering from 'src/assets/icons/svgs/engineering.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import HistoryIcon from 'src/assets/icons/svgs/history.svg';
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
  fill?: string,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;

  switch (name) {
    case 'transfer':
    case 'recurrent_transfer':
    case 'fill_recurrent_transfer':
      return <TransferIcon style={finalStyleOnIcon} fill={fill} />;
    case 'savings':
      return <SavingsIcon style={finalStyleOnIcon} fill={fill} />;
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return <PowerUpIcon style={finalStyleOnIcon} fill={fill} />;
        case 'withdraw_vesting':
          return <PowerDownIcon style={finalStyleOnIcon} fill={fill} />;
      }
    case 'claim_reward_balance':
    case 'interest':
      return <ClaimIcon style={finalStyleOnIcon} fill={fill} />;
    case 'delegate_vesting_shares':
      return <DelegateIcon style={finalStyleOnIcon} fill={fill} />;
    case 'claim_account':
    case 'account_create':
    case 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} fill={fill} />;
    case 'convert':
      return <ConvertIcon style={finalStyleOnIcon} fill={fill} />;
    case 'expand_more':
      return <ExpandMoreIcon style={styles.defaultIconContainer} fill={fill} />;
    case 'expand_less':
      return <ExpandLessIcon style={styles.defaultIconContainer} fill={fill} />;
    case 'arrow_upward':
      return (
        <ArrowUpwardIcon style={styles.defaultIconContainer} fill={fill} />
      );
    case 'add_circle_outline':
      return (
        <AddCircleOutlineIcon style={styles.defaultIconContainer} fill={fill} />
      );
    case 'delete' || 'remove':
      return <DeleteIcon style={style.defaultIconContainer} fill={fill} />;
    case 'cloud_off':
      return (
        <ServerUnavailable style={style.defaultIconContainer} fill={fill} />
      );
    case 'engineering':
      return <Engineering style={style.defaultIconContainer} fill={fill} />;
    case 'history':
      return <HistoryIcon style={style.defaultIconContainer} fill={fill} />;
    default:
      return <TransferIcon style={finalStyleOnIcon} fill={fill} />;
  }
};

interface IconProps {
  onClick?: (params: any) => void;
  name: string;
  subType?: string;
  marginRight?: boolean;
  fillIconColor?: string;
}

const Icon = (props: IconProps) => {
  const iconComponent = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
    props.marginRight,
    props.fillIconColor,
  );

  if (props.onClick) {
    return (
      <TouchableOpacity onPress={props.onClick}>
        {iconComponent}
      </TouchableOpacity>
    );
  } else {
    return <View style={styles.defaultIconContainer}>{iconComponent}</View>;
  }
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
