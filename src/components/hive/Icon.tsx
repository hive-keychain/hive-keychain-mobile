import GlobalIcon from 'assets/images/bottom-bar/browser.svg';
import AddBrowser from 'assets/images/browser/add-browser.svg';
import WalletAddIcon from 'assets/images/browser/add-tab.svg';
import HomeBrowserIcon from 'assets/images/browser/home-browser.svg';
import RotateRightBrowserIcon from 'assets/images/browser/rotate-right-browser.svg';
import ArrowLeftIcon from 'assets/images/common-ui/arrow-left.svg';
import ArrowRightBrowser from 'assets/images/common-ui/arrow-right.svg';
import ArrowUpIcon from 'assets/images/common-ui/arrow-up.svg';
import AtIcon from 'assets/images/common-ui/at.svg';
import PolygonDown from 'assets/images/common-ui/caret-up.svg';
import CheckIcon from 'assets/images/common-ui/check.svg';
import ClockIcon from 'assets/images/common-ui/clock.svg';
import CloseCircleIcon from 'assets/images/common-ui/close-circle.svg';
import CopyIcon from 'assets/images/common-ui/copy.svg';
import EditIcon from 'assets/images/common-ui/edit.svg';
import ExpandThinIcon from 'assets/images/common-ui/expand.svg';
import ExternalLinkIcon from 'assets/images/common-ui/external-link.svg';
import NotSeeIcon from 'assets/images/common-ui/eye-crossed.svg';
import EyeSlashIcon from 'assets/images/common-ui/eye-slash.svg';
import SeeIcon from 'assets/images/common-ui/eye.svg';
import Settings4Icon from 'assets/images/common-ui/filters.svg';
import InfoCircleIcon from 'assets/images/common-ui/info.svg';
import GiftDeleteIcon from 'assets/images/common-ui/remove.svg';
import RamIcon from 'assets/images/common-ui/save-rpc.svg';
import ScannerIcon from 'assets/images/common-ui/scanner.svg';
import SearchIcon from 'assets/images/common-ui/search.svg';
import ShareIcon from 'assets/images/common-ui/share.svg';
import HelpIcon from 'assets/images/drawer/help.svg';
import HASIcon from 'assets/images/has/logo-has.svg';
import HBDCurrencyLogo from 'assets/images/hive/hbd.svg';
import HiveCurrencyLogo from 'assets/images/hive/hive.svg';
import AccountsMenuIcon from 'assets/images/menus/accounts.svg';
import AddAccountIcon from 'assets/images/menus/accounts/account-create.svg';
import BankIcon from 'assets/images/menus/governance.svg';
import SupportIcon from 'assets/images/menus/help/support.svg';
import TutorialIcon from 'assets/images/menus/help/tutorial.svg';
import LogoutIcon from 'assets/images/menus/logout.svg';
import CandleIcon from 'assets/images/menus/settings.svg';
import ExportIcon from 'assets/images/menus/settings/export.svg';
import MultiSigIcon from 'assets/images/menus/settings/settings-multisig.svg';
import NotificationsIcon from 'assets/images/menus/settings/settings-notifications.svg';
import CpuIcon from 'assets/images/menus/settings/settings-operations.svg';
import RPCNodeIcon from 'assets/images/menus/settings/settings-rpc.svg';
import Settings2Icon from 'assets/images/menus/settings/settings-wheel.svg';
import CategoryIcon from 'assets/images/menus/theme.svg';
import DecryptIcon from 'assets/images/wallet/decrypt.svg';
import DoubleArrowIcon from 'assets/images/wallet/delegate.svg';
import EmptyWalletIcon from 'assets/images/wallet/empty-wallet.svg';
import EncryptIcon from 'assets/images/wallet/encrypt.svg';
import BackTimeIcon from 'assets/images/wallet/history.svg';
import PowerDownLight from 'assets/images/wallet/power-down.svg';
import PowerIcon from 'assets/images/wallet/power-icon.svg';
import PowerUpDownIcon from 'assets/images/wallet/power-up-down.svg';
import PowerUpIcon from 'assets/images/wallet/power-up.svg';
import SpeedometerIcon from 'assets/images/wallet/rc.svg';
import Cube3dScanIcon from 'assets/images/wallet/stake.svg';
import RepeatMusicIcon from 'assets/images/wallet/swap.svg';
import RepeatCircleIcon from 'assets/images/wallet/swap/exchange-arrow-circled.svg';
import RepeatIcon from 'assets/images/wallet/swap/exchange-arrow.svg';
import Cube3dRotate from 'assets/images/wallet/unstake.svg';
import SendSquareIcon from 'assets/images/wallet/voting-mana.svg';
import React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Desktop from 'src/assets/images/browser/desktop.svg';
import DragIcon from 'src/assets/images/browser/drag.svg';
import Mobile from 'src/assets/images/browser/mobile.svg';
import SwipeDownIcon from 'src/assets/images/browser/swipe-down.svg';
import SwipeLeftIcon from 'src/assets/images/browser/swipe-left.svg';
import SwipeRightIcon from 'src/assets/images/browser/swipe-right.svg';
import TwoFingersTapIcon from 'src/assets/images/browser/two-fingers-tap.svg';
import AddCircleOutlineIcon from 'src/assets/images/common-ui/add-circle-outline.svg';
import CalendarIcon from 'src/assets/images/common-ui/calendar.svg';
import ErrorSVG from 'src/assets/images/common-ui/error.svg';
import ExpandLessIcon from 'src/assets/images/common-ui/expand-less.svg';
import ExpandMoreIcon from 'src/assets/images/common-ui/expand-more.svg';
import Success from 'src/assets/images/common-ui/success.svg';
import AutomatedTasks from 'src/assets/images/menus/settings/automated-tasks.svg';
import ConvertIcon from 'src/assets/images/wallet/convert.svg';
import DelegateTokenIcon from 'src/assets/images/wallet/delegate-token.svg';
import ClaimIcon from 'src/assets/images/wallet/gift.svg';
import SavingsIcon from 'src/assets/images/wallet/icon_savings.svg';
import TransferIcon from 'src/assets/images/wallet/transfer.svg';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
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

    case name === Icons.ACCOUNT_CREATE:
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
    case name === Icons.ADD_CIRCLE_OUTLINE:
      return (
        <AddCircleOutlineIcon
          style={styles.defaultIconContainer}
          {...dimensionsProps}
          fill={getColors(theme).iconBW}
        />
      );

    case name === Icons.SETTINGS:
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
    case name === Icons.SETTINGS_WHEEL:
      return (
        <Settings2Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.FILTERS:
      return (
        <Settings4Icon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.HISTORY:
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
    case name === Icons.CARET_UP:
      return (
        <PolygonDown
          style={[
            finalStyleOnIcon,
            {color: color ?? getColors(theme).secondaryCardBgColor},
          ]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DELEGATE:
      return (
        <DoubleArrowIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ARROW_LEFT:
      return (
        <ArrowLeftIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );

    case name === Icons.ARROW_RIGHT:
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
    case name === Icons.REMOVE:
      return (
        <GiftDeleteIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EDIT:
      return (
        <EditIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXPAND:
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
    case name === Icons.EYE:
      return (
        <SeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EYE_CROSSED:
      return (
        <NotSeeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_OPERATIONS:
      return (
        <CpuIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_RPC:
      return (
        <RPCNodeIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SAVE_RPC:
      return (
        <RamIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXTERNAL_LINK:
      return (
        <ExternalLinkIcon
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
    case name === Icons.VOTING_MANA:
      return (
        <SendSquareIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.RC:
      return (
        <SpeedometerIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.HIVE:
      return (
        <HiveCurrencyLogo style={[finalStyleOnIcon]} {...dimensionsProps} />
      );
    case name === Icons.HBD:
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
    case name === Icons.ADD_TAB:
      return (
        <WalletAddIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.BROWSER:
      return (
        <GlobalIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SWAP:
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

    case name === Icons.EXCHANGE_ARROW:
      return (
        <RepeatIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXCHANGE_ARROW_CIRCLED:
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
    case name === Icons.SUCCESS:
      return (
        <Success
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.ERROR:
      return (
        <ErrorSVG
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.MOBILE:
      return (
        <Mobile
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DESKTOP:
      return (
        <Desktop
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.HELP:
      return (
        <HelpIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.TUTORIAL:
      return (
        <TutorialIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SUPPORT:
      return (
        <SupportIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_MULTISIG:
      return (
        <MultiSigIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.DRAG:
      return (
        <DragIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SETTINGS_NOTIFICATIONS:
      return (
        <NotificationsIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.CALENDAR:
      return (
        <CalendarIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.EXPORT:
      return (
        <ExportIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SWIPE_LEFT:
      return (
        <SwipeLeftIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SWIPE_RIGHT:
      return (
        <SwipeRightIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.TWO_FINGERS_TAP:
      return (
        <TwoFingersTapIcon
          style={[finalStyleOnIcon, {color: color ?? getColors(theme).icon}]}
          {...dimensionsProps}
        />
      );
    case name === Icons.SWIPE_DOWN:
      return (
        <SwipeDownIcon
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
  bgImage?: React.JSX.Element;
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

const Icon = (props: IconProps) => {
  let iconComponent: React.JSX.Element = getIconFilePath(
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
