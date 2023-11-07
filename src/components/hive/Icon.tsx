import Cube3dRotate from 'assets/new_UI/3d-rotate.svg';
import Cube3dScanIcon from 'assets/new_UI/3d_cube_scan.svg';
import ArrowLeftIcon from 'assets/new_UI/arrow-left.svg';
import ArrowUpIcon from 'assets/new_UI/arrow-up.svg';
import AtIcon from 'assets/new_UI/at.svg';
import BackTimeIcon from 'assets/new_UI/back_time.svg';
import BankIcon from 'assets/new_UI/bank.svg';
import CandleIcon from 'assets/new_UI/candle.svg';
import CategoryIcon from 'assets/new_UI/category.svg';
import DecryptIcon from 'assets/new_UI/decrypt.svg';
import DoubleArrowIcon from 'assets/new_UI/double-arrow.svg';
import EncryptIcon from 'assets/new_UI/encrypt.svg';
import ExpandThinIcon from 'assets/new_UI/expand-thin.svg';
import EyeSlashIcon from 'assets/new_UI/eye-slash.svg';
import GiftDeleteIcon from 'assets/new_UI/gift-delete.svg';
import HBDCurrencyLogo from 'assets/new_UI/hbd-currency-logo.svg';
import HiveCurrencyLogo from 'assets/new_UI/hive-currency-logo.svg';
import HiveAlternative from 'assets/new_UI/hive_alternative.svg';
import ImportIcon from 'assets/new_UI/import.svg';
import InfoCircleIcon from 'assets/new_UI/info-circle.svg';
import ClockIcon from 'assets/new_UI/linear_clock.svg';
import CloseCircleIcon from 'assets/new_UI/linear_close-circle.svg';
import CpuIcon from 'assets/new_UI/linear_cpu-setting.svg';
import MoneyIcon from 'assets/new_UI/linear_dollar-circle.svg';
import EditIcon from 'assets/new_UI/linear_edit-2.svg';
import ExternalLinkIcon from 'assets/new_UI/linear_export.svg';
import NotSeeIcon from 'assets/new_UI/linear_eye-slash.svg';
import SeeIcon from 'assets/new_UI/linear_eye.svg';
import RPCNodeIcon from 'assets/new_UI/linear_hierarchy-square-3.svg';
import RamIcon from 'assets/new_UI/linear_ram.svg';
import ScannerIcon from 'assets/new_UI/linear_scanner.svg';
import SendSquareIcon from 'assets/new_UI/linear_send-square.svg';
import CheckIcon from 'assets/new_UI/linear_tick-circle.svg';
import HASIcon from 'assets/new_UI/logo_HAS.svg';
import LogoutIcon from 'assets/new_UI/logout.svg';
import PolygonDown from 'assets/new_UI/polygon_down.svg';
import PowerIcon from 'assets/new_UI/power-icon.svg';
import PowerUpDownIcon from 'assets/new_UI/power-up-down.svg';
import PowerUpIcon from 'assets/new_UI/power-up.svg';
import AccountsMenuIcon from 'assets/new_UI/profile.svg';
import SearchIcon from 'assets/new_UI/search.svg';
import Settings2Icon from 'assets/new_UI/setting-2.svg';
import Settings4Icon from 'assets/new_UI/setting-4.svg';
import SpeedometerIcon from 'assets/new_UI/speedometer.svg';
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

const smallerIconSizeNameList = [
  'transfer',
  'recurrent_transfer',
  'fill_recurrent_transfer',
  'convert',
];

const getIconFilePath = (
  name: string,
  subType: string,
  style: any,
  marginRight?: boolean,
  //TODO after refactoring make fix bellow
  theme?: Theme,
  width: number = 20,
  height: number = 20,
  color?: string,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;
  let dimensionsProps = {
    width,
    height,
  };
  if (smallerIconSizeNameList.includes(name)) {
    dimensionsProps = {width: width * 1.5, height: height * 1.5};
  }
  switch (true) {
    case name === 'transfer' ||
      name === 'recurrent_transfer' ||
      name === 'fill_recurrent_transfer':
      return (
        <TransferIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'savings':
      return (
        <SavingsIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'power_up_down':
      switch (true) {
        case subType === 'transfer_to_vesting':
          return (
            <PowerUpDownIcon
              style={[
                finalStyleOnIcon,
                {color: color ?? getColors(theme).icon},
              ]}
              {...dimensionsProps}
            />
          );
        case subType === 'withdraw_vesting':
          return (
            <PowerUpDownIcon
              style={[
                finalStyleOnIcon,
                {color: color ?? getColors(theme).icon},
                styles.rotationUpDown,
              ]}
              {...dimensionsProps}
            />
          );
      }
    case name === 'claim_reward_balance':
    case name === 'interest':
      return (
        <ClaimIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'delegate_vesting_shares':
      return (
        <ReceiveSquareIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'claim_account' ||
      name === 'account_create' ||
      name === 'create_claimed_account':
      return <LinkIcon style={finalStyleOnIcon} />;
    case name === 'convert':
      return (
        <ConvertIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'expand_more':
      return (
        <ExpandMoreIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).iconBW}]}
          {...dimensionsProps}
        />
      );
    case name === 'expand_less':
      return (
        <ExpandLessIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
        />
      );
    case name === 'arrow_upward':
      return (
        <ArrowUpwardIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
        />
      );
    case name === 'add_circle_outline':
      return (
        <AddCircleOutlineIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
        />
      );
    case name === 'delete':
      return (
        <DeleteIcon style={style.defaultIconContainer} {...dimensionsProps} />
      );
    case name === 'candle':
      return (
        <CandleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'accounts':
      return (
        <AccountsMenuIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'tokens':
      return (
        <HiveAlternative
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'governance':
      return (
        <BankIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'theme':
      return (
        <CategoryIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'info':
      return (
        <InfoCircleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).iconBW}]}
          {...dimensionsProps}
        />
      );
    case name === 'logout':
      return (
        <LogoutIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'search':
      return (
        <SearchIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'settings-2':
      return (
        <Settings2Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'settings-4':
      return (
        <Settings4Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'import':
      return (
        <ImportIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'back_time':
      return (
        <BackTimeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'arrow_up':
      return (
        <ArrowUpIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'polygon_down':
      return (
        <PolygonDown
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secondaryCardBgColor},
          ]}
          {...dimensionsProps}
        />
      );
    case name === 'double-arrow' || name === 'delegate':
      return (
        <DoubleArrowIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'arrow_left' || name === 'back':
      return (
        <ArrowLeftIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === 'at':
      return (
        <AtIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === 'encrypt':
      return (
        <EncryptIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === 'decrypt':
      return (
        <DecryptIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === '3d_cube':
      return (
        <Cube3dScanIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === '3d_cube_rotate':
      return (
        <Cube3dRotate
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'gift_delete' || name === 'remove':
      return (
        <GiftDeleteIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'edit' || name === 'pencil':
      return (
        <EditIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'expand_thin':
      return (
        <ExpandThinIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'check':
      return (
        <CheckIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'close_circle':
      return (
        <CloseCircleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'scanner':
      return (
        <ScannerIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'see':
      return (
        <SeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'not_see':
      return (
        <NotSeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'cpu':
      return (
        <CpuIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'rpc':
      return (
        <RPCNodeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'ram':
      return (
        <RamIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'open' || name === 'external_link':
      return (
        <ExternalLinkIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'money' || name === 'dollar':
      return (
        <MoneyIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'clock':
      return (
        <ClockIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'logo_has':
      return <HASIcon style={[finalStyleOnIcon]} {...dimensionsProps} />;
    case name === 'send_square':
      return (
        <SendSquareIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'speedometer':
      return (
        <SpeedometerIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === 'hive_currency_logo':
      return (
        <HiveCurrencyLogo style={[finalStyleOnIcon]} {...dimensionsProps} />
      );
    case name === 'hbd_currency_logo':
      return (
        <HBDCurrencyLogo style={[finalStyleOnIcon]} {...dimensionsProps} />
      );
    case name === 'power_icon':
      return <PowerIcon style={[finalStyleOnIcon]} {...dimensionsProps} />;
    case name === 'power_up':
      return (
        <PowerUpIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    default:
      return (
        <EyeSlashIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
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
  width?: number;
  height?: number;
  color?: string;
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  let iconComponent: JSX.Element = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
    props.marginRight,
    props.theme,
    props.width,
    props.height,
    props.color,
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
