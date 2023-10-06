import ArrowUpIcon from 'assets/new_UI/arrow-up.svg';
import BackTimeIcon from 'assets/new_UI/back_time.svg';
import BankIcon from 'assets/new_UI/bank.svg';
import CandleIcon from 'assets/new_UI/candle.svg';
import CategoryIcon from 'assets/new_UI/category.svg';
import HiveAlternative from 'assets/new_UI/hive_alternative.svg';
import ImportIcon from 'assets/new_UI/import.svg';
import InfoCircleIcon from 'assets/new_UI/info-circle.svg';
import LogoutIcon from 'assets/new_UI/logout.svg';
import AccountsMenuIcon from 'assets/new_UI/profile.svg';
import SearchIcon from 'assets/new_UI/search.svg';
import Settings2Icon from 'assets/new_UI/setting-2.svg';
import Settings4Icon from 'assets/new_UI/setting-4.svg';
import React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import AddCircleOutlineIcon from 'src/assets/icons/svgs/add_circle_outline.svg';
import PowerDownIcon from 'src/assets/icons/svgs/arrow_downward.svg';
import {
  default as ArrowUpwardIcon,
  default as PowerUpIcon,
} from 'src/assets/icons/svgs/arrow_upward.svg';
import ConvertIcon from 'src/assets/icons/svgs/currency_exchange.svg';
import DeleteIcon from 'src/assets/icons/svgs/delete_black.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
import ExpandMoreIcon from 'src/assets/new_UI/expand_more.svg';
import ReceiveSquareIcon from 'src/assets/new_UI/receive_square.svg';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

//TODO after refactoring check unused svgs/icons & delete.

//TODO add icons as enum & type.

const getIconFilePath = (
  name: string,
  subType: string,
  style: any,
  marginRight?: boolean,
  //TODO after refactoring make fix bellow
  theme?: Theme,
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
      return (
        <ReceiveSquareIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'claim_account':
    case 'account_create':
    case 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} />;
    case 'convert':
      return <ConvertIcon style={finalStyleOnIcon} />;
    case 'expand_more':
      return (
        <ExpandMoreIcon
          style={[finalStyleOnIcon, {color: getColors(theme).iconBW}]}
        />
      );
    case 'expand_less':
      return <ExpandLessIcon style={styles.defaultIconContainer} />;
    case 'arrow_upward':
      return <ArrowUpwardIcon style={styles.defaultIconContainer} />;
    case 'add_circle_outline':
      return <AddCircleOutlineIcon style={styles.defaultIconContainer} />;
    case 'delete':
      return <DeleteIcon style={style.defaultIconContainer} />;
    case 'candle':
      return (
        <CandleIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'accounts':
      return (
        <AccountsMenuIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'tokens':
      return (
        <HiveAlternative
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'governance':
      return (
        <BankIcon style={[finalStyleOnIcon, {color: getColors(theme).icon}]} />
      );
    case 'theme':
      return (
        <CategoryIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'info':
      return (
        <InfoCircleIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'logout':
      return (
        <LogoutIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'search':
      return (
        <SearchIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'settings-2':
      return (
        <Settings2Icon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'settings-4':
      return (
        <Settings4Icon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'import':
      return (
        <ImportIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'back_time':
      return (
        <BackTimeIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case 'arrow_up':
      return <ArrowUpIcon style={[finalStyleOnIcon, {color: '#FFF'}]} />;
    default:
      return <TransferIcon style={finalStyleOnIcon} />;
  }
};

interface IconProps {
  onClick?: () => void;
  name: string;
  subType?: string;
  marginRight?: boolean;
  //TODO after refactoring make fix bellow
  theme?: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPressedStyle?: StyleProp<ViewStyle>;
  bgImage?: JSX.Element;
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  let iconComponent: JSX.Element = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
    props.marginRight,
    props.theme,
  );
  const styleProps = {
    style: [styles.defaultIconContainer, props.additionalContainerStyle],
  };

  if (props.bgImage) {
    iconComponent = (
      <>
        <View style={styles.bgIcon}>{props.bgImage}</View>
        {iconComponent}
      </>
    );
  }

  return props.onClick ? (
    <Pressable
      style={({pressed}) => [
        styleProps.style,
        pressed ? props.additionalPressedStyle : null,
      ]}
      onPress={() => props.onClick()}>
      {iconComponent}
    </Pressable>
  ) : (
    <View {...styleProps}>{iconComponent}</View>
  );
};

const styles = StyleSheet.create({
  defaultIcon: {
    // marginRight: 5,
  },
  defaultIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  bgIcon: {
    position: 'absolute',
  },
});

export default Icon;
