import ArrowUpIcon from 'assets/new_UI/arrow-up.svg';
import BackTimeIcon from 'assets/new_UI/back_time.svg';
import BankIcon from 'assets/new_UI/bank.svg';
import CandleIcon from 'assets/new_UI/candle.svg';
import CategoryIcon from 'assets/new_UI/category.svg';
import DoubleArrowIcon from 'assets/new_UI/double-arrow.svg';
import EyeSlashIcon from 'assets/new_UI/eye-slash.svg';
import HiveAlternative from 'assets/new_UI/hive_alternative.svg';
import ImportIcon from 'assets/new_UI/import.svg';
import InfoCircleIcon from 'assets/new_UI/info-circle.svg';
import LogoutIcon from 'assets/new_UI/logout.svg';
import PolygonDown from 'assets/new_UI/polygon_down.svg';
import PowerUpDownIcon from 'assets/new_UI/power-up-down.svg';
import AccountsMenuIcon from 'assets/new_UI/profile.svg';
import SearchIcon from 'assets/new_UI/search.svg';
import Settings2Icon from 'assets/new_UI/setting-2.svg';
import Settings4Icon from 'assets/new_UI/setting-4.svg';
import React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import AddCircleOutlineIcon from 'src/assets/icons/svgs/add_circle_outline.svg';
import {default as ArrowUpwardIcon} from 'src/assets/icons/svgs/arrow_upward.svg';
import DeleteIcon from 'src/assets/icons/svgs/delete_black.svg';
import ExpandLessIcon from 'src/assets/icons/svgs/expand_less.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import ConvertIcon from 'src/assets/new_UI/convert.svg';
import ExpandMoreIcon from 'src/assets/new_UI/expand_more.svg';
import ClaimIcon from 'src/assets/new_UI/gift.svg';
import ReceiveSquareIcon from 'src/assets/new_UI/receive_square.svg';
import SavingsIcon from 'src/assets/new_UI/savings.svg';
import TransferIcon from 'src/assets/new_UI/send.svg';
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
  console.log({name}); //TODO remove line
  switch (true) {
    case name === 'transfer' ||
      name === 'recurrent_transfer' ||
      name === 'fill_recurrent_transfer':
      return (
        <TransferIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
          width={30}
          height={30}
        />
      );
    case name === 'savings':
      return (
        <SavingsIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'power_up_down':
      switch (true) {
        case subType === 'transfer_to_vesting':
          return (
            <PowerUpDownIcon
              style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
            />
          );
        case subType === 'withdraw_vesting':
          return (
            <PowerUpDownIcon
              style={[
                finalStyleOnIcon,
                {color: getColors(theme).icon},
                styles.rotationUpDown,
              ]}
            />
          );
      }
    case name === 'claim_reward_balance':
    case name === 'interest':
      return (
        <ClaimIcon style={[finalStyleOnIcon, {color: getColors(theme).icon}]} />
      );
    case name === 'delegate_vesting_shares':
      return (
        <ReceiveSquareIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'claim_account' ||
      name === 'account_create' ||
      name === 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} />;
    case name === 'convert':
      return (
        <ConvertIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
          width={40}
          height={40}
        />
      );
    case name === 'expand_more':
      return (
        <ExpandMoreIcon
          style={[finalStyleOnIcon, {color: getColors(theme).iconBW}]}
        />
      );
    case name === 'expand_less':
      return <ExpandLessIcon style={styles.defaultIconContainer} />;
    case name === 'arrow_upward':
      return <ArrowUpwardIcon style={styles.defaultIconContainer} />;
    case name === 'add_circle_outline':
      return <AddCircleOutlineIcon style={styles.defaultIconContainer} />;
    case name === 'delete':
      return <DeleteIcon style={style.defaultIconContainer} />;
    case name === 'candle':
      return (
        <CandleIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'accounts':
      return (
        <AccountsMenuIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'tokens':
      return (
        <HiveAlternative
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'governance':
      return (
        <BankIcon style={[finalStyleOnIcon, {color: getColors(theme).icon}]} />
      );
    case name === 'theme':
      return (
        <CategoryIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'info':
      return (
        <InfoCircleIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'logout':
      return (
        <LogoutIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'search':
      return (
        <SearchIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'settings-2':
      return (
        <Settings2Icon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'settings-4':
      return (
        <Settings4Icon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'import':
      return (
        <ImportIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'back_time':
      return (
        <BackTimeIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    case name === 'arrow_up':
      return <ArrowUpIcon style={[finalStyleOnIcon, {color: '#FFF'}]} />;
    case name === 'polygon_down':
      return (
        <PolygonDown
          style={[
            finalStyleOnIcon,
            {color: getColors(theme).secondaryCardBgColor},
          ]}
        />
      );
    case name === 'double-arrow' || name === 'delegate':
      return (
        <DoubleArrowIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
        />
      );
    default:
      return (
        <EyeSlashIcon
          style={[finalStyleOnIcon, {color: getColors(theme).icon}]}
          width={20}
          height={20}
        />
      );
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
  rotationUpDown: {
    transform: [{rotateX: '180deg'}],
  },
});

export default Icon;
