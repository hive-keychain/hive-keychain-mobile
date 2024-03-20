import Cube3dRotate from 'assets/new_UI/3d-rotate.svg';
import Cube3dScanIcon from 'assets/new_UI/3d_cube_scan.svg';
import AddAccountIcon from 'assets/new_UI/add_account.svg';
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
import HeartIcon from 'assets/new_UI/heart.svg';
import HiveCurrencyLogo from 'assets/new_UI/hive-currency-logo.svg';
import HiveAlternative from 'assets/new_UI/hive_alternative.svg';
import ImportIcon from 'assets/new_UI/import.svg';
import InfoCircleIcon from 'assets/new_UI/info-circle.svg';
import AddBrowser from 'assets/new_UI/linear_add-browser.svg';
import ArrowLeftBrowser from 'assets/new_UI/linear_arrow-left-browser.svg';
import ArrowRightBrowser from 'assets/new_UI/linear_arrow-right-browser.svg';
import ClockIcon from 'assets/new_UI/linear_clock.svg';
import CloseCircleIcon from 'assets/new_UI/linear_close-circle.svg';
import CopyIcon from 'assets/new_UI/linear_copy.svg';
import CpuIcon from 'assets/new_UI/linear_cpu-setting.svg';
import MoneyIcon from 'assets/new_UI/linear_dollar-circle.svg';
import EditIcon from 'assets/new_UI/linear_edit-2.svg';
import EmptyWalletIcon from 'assets/new_UI/linear_empty-wallet.svg';
import ExternalLinkIcon from 'assets/new_UI/linear_export.svg';
import NotSeeIcon from 'assets/new_UI/linear_eye-slash.svg';
import SeeIcon from 'assets/new_UI/linear_eye.svg';
import GlobalIcon from 'assets/new_UI/linear_global.svg';
import RPCNodeIcon from 'assets/new_UI/linear_hierarchy-square-3.svg';
import HomeBrowserIcon from 'assets/new_UI/linear_home-2.svg';
import RamIcon from 'assets/new_UI/linear_ram.svg';
import RepeatCircleIcon from 'assets/new_UI/linear_repeat-circle.svg';
import RepeatIcon from 'assets/new_UI/linear_repeat.svg';
import RepeatMusicIcon from 'assets/new_UI/linear_repeate-music.svg';
import RotateRightBrowserIcon from 'assets/new_UI/linear_rotate-right-browser.svg';
import ScannerIcon from 'assets/new_UI/linear_scanner.svg';
import SendSquareIcon from 'assets/new_UI/linear_send-square.svg';
import ShareIcon from 'assets/new_UI/linear_share.svg';
import CheckIcon from 'assets/new_UI/linear_tick-circle.svg';
import WalletAddIcon from 'assets/new_UI/linear_wallet-add.svg';
import HASIcon from 'assets/new_UI/logo_HAS.svg';
import LogoutIcon from 'assets/new_UI/logout.svg';
import PolygonDown from 'assets/new_UI/polygon_down.svg';
import PowerDownLight from 'assets/new_UI/power-down-light.svg';
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
import DelegateTokenIcon from 'src/assets/new_UI/delegate-token.svg';
import ExpandMoreIcon from 'src/assets/new_UI/expand_more.svg';
import ClaimIcon from 'src/assets/new_UI/gift.svg';
import SavingsIcon from 'src/assets/new_UI/savings.svg';
import TransferIcon from 'src/assets/new_UI/send.svg';
import AutomatedTasks from 'src/assets/settings/automated-tasks.svg';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';

const smallerIconSizeNameList = [
  Icons.TRANSFER,
  Icons.RECURRENT_TRANSFER,
  Icons.FILL_RECURRENT_TRANSFER,
  Icons.CONVERT,
];

const getIconFilePath = (
  name: Icons,
  subType: string,
  style: any,
  marginRight?: boolean,
  theme?: Theme,
  width: number = 20,
  height: number = 20,
  color?: string,
  fill?: string,
  strokeWidth?: number,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;
  let dimensionsProps = {
    width,
    height,
  };
  if (smallerIconSizeNameList.includes(name)) {
    dimensionsProps = {width: width * 1.2, height: height * 1.2};
  }
  switch (true) {
    case name === Icons.TRANSFER ||
      name === Icons.RECURRENT_TRANSFER ||
      name === Icons.FILL_RECURRENT_TRANSFER:
      return (
        <TransferIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SAVINGS:
      return (
        <SavingsIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.POWER_UP_DOWN:
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
    case name === Icons.CLAIM_REWARD_BALANCE:
    case name === Icons.INTEREST:
      return (
        <ClaimIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DELEGATE_TOKEN:
      return (
        <DelegateTokenIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CLAIM_ACCOUNT:
      return <LinkIcon style={finalStyleOnIcon} />;
    case name === Icons.ACCOUNT_CREATE || name === Icons.CREATE_CLAIMED_ACCOUNT:
      return (
        <AddAccountIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CONVERT:
      return (
        <ConvertIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXPAND_MORE:
      return (
        <ExpandMoreIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).iconBW}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXPAND_LESS:
      return (
        <ExpandLessIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_UPWARD:
      return (
        <ArrowUpwardIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
        />
      );
    case name === Icons.ADD_CIRCLE_OUTLINE:
      return (
        <AddCircleOutlineIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
          fill={getColors(theme).iconBW}
        />
      );
    case name === Icons.DELETE:
      return (
        <DeleteIcon style={style.defaultIconContainer} {...dimensionsProps} />
      );
    case name === Icons.CANDLE:
      return (
        <CandleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ACCOUNTS:
      return (
        <AccountsMenuIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.TOKENS:
      return (
        <HiveAlternative
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.GOVERNANCE:
      return (
        <BankIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.THEME:
      return (
        <CategoryIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.INFO:
      return (
        <InfoCircleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.LOGOUT:
      return (
        <LogoutIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SEARCH:
      return (
        <SearchIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_2:
      return (
        <Settings2Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_4:
      return (
        <Settings4Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.IMPORT:
      return (
        <ImportIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.BACK_TIME:
      return (
        <BackTimeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_UP:
      return (
        <ArrowUpIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.POLYGON_DOWN:
      return (
        <PolygonDown
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secondaryCardBgColor},
          ]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DOUBLE_ARROW || name === Icons.DELEGATE:
      return (
        <DoubleArrowIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_LEFT || name === Icons.BACK:
      return (
        <ArrowLeftIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_LEFT_BROWSER:
      return (
        <ArrowLeftBrowser
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_RIGHT_BROWSER:
      return (
        <ArrowRightBrowser
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ADD_BROWSER:
      return (
        <AddBrowser
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ROTATE_RIGHT_BROWSER:
      return (
        <RotateRightBrowserIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.AT:
      return (
        <AtIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ENCRYPT:
      return (
        <EncryptIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DECRYPT:
      return (
        <DecryptIcon
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secodaryIconBW},
          ]}
          {...dimensionsProps}
        />
      );
    case name === Icons.STAKE:
      return (
        <Cube3dScanIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.UNSTAKE:
      return (
        <Cube3dRotate
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.GIFT_DELETE || name === Icons.REMOVE:
      return (
        <GiftDeleteIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EDIT || name === Icons.PENCIL:
      return (
        <EditIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXPAND_THIN:
      return (
        <ExpandThinIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CHECK:
      return (
        <CheckIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
          strokeWidth={strokeWidth}
        />
      );
    case name === Icons.CLOSE_CIRCLE:
      return (
        <CloseCircleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SCANNER:
      return (
        <ScannerIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SEE:
      return (
        <SeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.NOT_SEE:
      return (
        <NotSeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CPU:
      return (
        <CpuIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.RPC:
      return (
        <RPCNodeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.RAM:
      return (
        <RamIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.OPEN || name === Icons.EXTERNAL_LINK:
      return (
        <ExternalLinkIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.MONEY || name === Icons.DOLLAR:
      return (
        <MoneyIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CLOCK:
      return (
        <ClockIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.LOGO_HAS:
      return <HASIcon style={[finalStyleOnIcon]} {...dimensionsProps} />;
    case name === Icons.SEND_SQUARE:
      return (
        <SendSquareIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SPEEDOMETER:
      return (
        <SpeedometerIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.HIVE_CURRENCY_LOGO:
      return (
        <HiveCurrencyLogo style={[finalStyleOnIcon]} {...dimensionsProps} />
      );
    case name === Icons.HBD_CURRENCY_LOGO:
      return (
        <HBDCurrencyLogo style={[finalStyleOnIcon]} {...dimensionsProps} />
      );
    case name === Icons.POWER_ICON:
      return <PowerIcon style={[finalStyleOnIcon]} {...dimensionsProps} />;
    case name === Icons.POWER_UP:
      return (
        <PowerUpIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.POWER_DOWN:
      return (
        <PowerDownLight
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EMPTY_WALLET:
      return (
        <EmptyWalletIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.WALLET_ADD:
      return (
        <WalletAddIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.GLOBAL:
      return (
        <GlobalIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.REPEATE_MUSIC || name === Icons.SWAP:
      return (
        <RepeatMusicIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SHARE:
      return (
        <ShareIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.COPY:
      return (
        <CopyIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
          strokeWidth={strokeWidth}
        />
      );
    case name === Icons.HEART || name === Icons.FAVORITE:
      return (
        <HeartIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          fill={fill ?? undefined}
          {...dimensionsProps}
        />
      );
    case name === Icons.REPEAT:
      return (
        <RepeatIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.REPEAT_CIRCLE:
      return (
        <RepeatCircleIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.HOME_BROWSER:
      return (
        <HomeBrowserIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.AUTOMATED_TASKS:
      return (
        <AutomatedTasks
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
  onPress?: () => void;
  onLongPress?: () => void;
  name: Icons;
  subType?: string;
  marginRight?: boolean;
  theme?: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPressedStyle?: StyleProp<ViewStyle>;
  bgImage?: JSX.Element;
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
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
    props.fill,
    props.strokeWidth,
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

  return props.onPress ? (
    <Pressable
      style={({pressed}) => [
        styleProps.style,
        pressed ? props.additionalPressedStyle : null,
      ]}
      onPress={() => props.onPress()}
      onLongPress={props.onLongPress ? () => props.onLongPress() : null}>
      {iconComponent}
    </Pressable>
  ) : (
    <View {...styleProps}>{iconComponent}</View>
  );
};

const styles = StyleSheet.create({
  defaultIcon: {},
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
