import Information from 'assets/addAccount/icon_info.svg';
import React, {useRef} from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AddCircleOutlineIcon from 'src/assets/icons/svgs/add_circle_outline.svg';
import PowerDownIcon from 'src/assets/icons/svgs/arrow_downward.svg';
import {
  default as ArrowUpwardIcon,
  default as PowerUpIcon,
} from 'src/assets/icons/svgs/arrow_upward.svg';
import CancelIcon from 'src/assets/icons/svgs/cancel.svg';
import CheckedIcon from 'src/assets/icons/svgs/check_circle.svg';
import ServerUnavailable from 'src/assets/icons/svgs/cloud_off.svg';
import ContentCopyIcon from 'src/assets/icons/svgs/content_copy.svg';
import {
  default as ConvertIcon,
  default as CurrencyExchangeIcon,
} from 'src/assets/icons/svgs/currency_exchange.svg';
import DeleteIcon from 'src/assets/icons/svgs/delete_black.svg';
import Engineering from 'src/assets/icons/svgs/engineering.svg';
import ErrorIcon from 'src/assets/icons/svgs/error.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import HistoryIcon from 'src/assets/icons/svgs/history.svg';
import InboxIcon from 'src/assets/icons/svgs/inbox.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import PendingIcon from 'src/assets/icons/svgs/pending.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import RefreshIcon from 'src/assets/icons/svgs/refresh.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
import SettingsIcon from 'src/assets/icons/svgs/settings.svg';
import DelegateIcon from 'src/assets/icons/svgs/swap_horiz.svg';
import SwapIcon from 'src/assets/icons/svgs/swap_vert.svg';

const getIconFilePath = (
  name: string,
  subType: string,
  style: any,
  marginRight?: boolean,
  fill?: string,
  width?: number,
  height?: number,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;
  const props = {fill, width, height};

  switch (name) {
    case 'transfer':
    case 'recurrent_transfer':
    case 'fill_recurrent_transfer':
      return <TransferIcon style={finalStyleOnIcon} {...props} />;
    case 'savings':
      return <SavingsIcon style={finalStyleOnIcon} {...props} />;
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return <PowerUpIcon style={finalStyleOnIcon} {...props} />;
        case 'withdraw_vesting':
          return <PowerDownIcon style={finalStyleOnIcon} {...props} />;
      }
    case 'claim_reward_balance':
    case 'interest':
      return <ClaimIcon style={finalStyleOnIcon} {...props} />;
    case 'delegate_vesting_shares':
      return <DelegateIcon style={finalStyleOnIcon} {...props} />;
    case 'claim_account':
    case 'account_create':
    case 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} {...props} />;
    case 'convert':
      return <ConvertIcon style={finalStyleOnIcon} {...props} />;
    case 'expand_more':
      return <ExpandMoreIcon style={finalStyleOnIcon} {...props} />;
    case 'expand_less':
      return <ExpandLessIcon style={finalStyleOnIcon} {...props} />;
    case 'arrow_upward':
      return <ArrowUpwardIcon style={finalStyleOnIcon} {...props} />;
    case 'add_circle_outline':
      return <AddCircleOutlineIcon style={finalStyleOnIcon} {...props} />;
    case 'delete' || 'remove':
      return <DeleteIcon style={styles.defaultIconContainer} />;
    case 'settings':
      return <SettingsIcon style={finalStyleOnIcon} />;
    case 'cloud_off':
      return <ServerUnavailable style={finalStyleOnIcon} {...props} />;
    case 'engineering':
      return <Engineering style={finalStyleOnIcon} {...props} />;
    case 'history':
      return <HistoryIcon style={finalStyleOnIcon} {...props} />;
    case 'swap_vert':
      return <SwapIcon style={finalStyleOnIcon} {...props} />;
    case 'refresh':
      return <RefreshIcon style={finalStyleOnIcon} {...props} />;
    case 'currency_exchange':
      return <CurrencyExchangeIcon style={finalStyleOnIcon} {...props} />;
    case 'inbox':
      return <InboxIcon style={finalStyleOnIcon} {...props} />;
    case 'pending':
      return <PendingIcon style={finalStyleOnIcon} {...props} />;
    case 'check_circle':
      return <CheckedIcon style={finalStyleOnIcon} {...props} />;
    case 'error':
      return <ErrorIcon style={finalStyleOnIcon} {...props} />;
    case 'cancel':
      return <CancelIcon style={finalStyleOnIcon} {...props} />;
    case 'content_copy':
      return <ContentCopyIcon style={finalStyleOnIcon} {...props} />;
    case 'info':
      return <Information style={finalStyleOnIcon} {...props} />;
    default:
      return <TransferIcon style={finalStyleOnIcon} {...props} />;
  }
};

interface IconProps {
  onClick?: (params: any) => void;
  name: string;
  subType?: string;
  marginRight?: boolean;
  fillIconColor?: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  rotate?: boolean;
}

const Icon = (props: IconProps) => {
  const iconComponentTemp = getIconFilePath(
    props.name,
    props.subType,
    props.style ?? styles.defaultIcon,
    props.marginRight,
    props.fillIconColor ?? 'black',
    props.width ?? 30,
    props.height ?? 30,
  );

  let iconComponent = iconComponentTemp;
  if (props.rotate) {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const spin = () => {
      Animated.timing(spinAnim, {
        toValue: 360,
        duration: 10000,
        useNativeDriver: true,
      }).start();
    };
    spin();
    iconComponent = (
      <Animated.View
        style={{
          transform: [{rotate: spinAnim}],
        }}>
        {iconComponent}
      </Animated.View>
    );
  }

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
