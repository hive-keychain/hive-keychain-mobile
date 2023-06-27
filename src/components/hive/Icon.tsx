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
import ServerUnavailable from 'src/assets/icons/svgs/cloud_off.svg';
import ConvertIcon from 'src/assets/icons/svgs/currency_exchange.svg';
import DeleteIcon from 'src/assets/icons/svgs/delete_black.svg';
import Engineering from 'src/assets/icons/svgs/engineering.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import HistoryIcon from 'src/assets/icons/svgs/history.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import RefreshIcon from 'src/assets/icons/svgs/refresh.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
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

  switch (name) {
    case 'transfer':
    case 'recurrent_transfer':
    case 'fill_recurrent_transfer':
      return (
        <TransferIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'savings':
      return (
        <SavingsIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return (
            <PowerUpIcon
              style={finalStyleOnIcon}
              fill={fill}
              width={width}
              height={height}
            />
          );
        case 'withdraw_vesting':
          return (
            <PowerDownIcon
              style={finalStyleOnIcon}
              fill={fill}
              width={width}
              height={height}
            />
          );
      }
    case 'claim_reward_balance':
    case 'interest':
      return (
        <ClaimIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'delegate_vesting_shares':
      return (
        <DelegateIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'claim_account':
    case 'account_create':
    case 'create_claimed_account':
      return (
        <LinkIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'convert':
      return (
        <ConvertIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'expand_more':
      return (
        <ExpandMoreIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'expand_less':
      return (
        <ExpandLessIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'arrow_upward':
      return (
        <ArrowUpwardIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'add_circle_outline':
      return (
        <AddCircleOutlineIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'delete' || 'remove':
      return (
        <DeleteIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'cloud_off':
      return (
        <ServerUnavailable
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'engineering':
      return (
        <Engineering
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'history':
      return (
        <HistoryIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'swap_vert':
      return (
        <SwapIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    case 'refresh':
      return (
        <RefreshIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
    default:
      return (
        <TransferIcon
          style={finalStyleOnIcon}
          fill={fill}
          width={width}
          height={height}
        />
      );
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
    props.fillIconColor,
    props.width ?? 40,
    props.height ?? 40,
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
