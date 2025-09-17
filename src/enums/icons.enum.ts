export enum Icons {
  ACCOUNT = 'ACCOUNT',
  AUTOMATED_TASKS = 'AUTOMATED_TASKS',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',

  EXPORT = 'EXPORT',
  SUPPORT = 'SUPPORT',
  HELP = 'HELP',
  TUTORIAL = 'TUTORIAL',

  TRANSFER = 'TRANSFER',
  RECURRENT_TRANSFER = 'RECURRENT_TRANSFER',
  FILL_RECURRENT_TRANSFER = 'FILL_RECURRENT_TRANSFER',

  SAVINGS = 'SAVINGS',

  POWER_UP_DOWN = 'POWER_UP_DOWN',
  POWER_DOWN = 'POWER_DOWN',

  CLAIM_REWARD_BALANCE = 'CLAIM_REWARD_BALANCE',
  INTEREST = 'INTEREST',

  DELEGATE_TOKEN = 'DELEGATE_VESTING_SHARES',
  ACCOUNT_CREATE = 'ACCOUNT_CREATE',
  CONVERT = 'CONVERT',
  EXPAND_MORE = 'EXPAND_MORE',
  EXPAND_LESS = 'EXPAND_LESS',
  ADD_CIRCLE_OUTLINE = 'ADD_CIRCLE_OUTLINE',
  SETTINGS = 'SETTINGS',
  ACCOUNTS = 'ACCOUNTS',
  GOVERNANCE = 'GOVERNANCE',
  THEME = 'THEME',
  INFO = 'INFO',
  LOGOUT = 'LOGOUT',
  SEARCH = 'SEARCH',
  SETTINGS_WHEEL = 'SETTINGS_WHEEL',
  FILTERS = 'FILTERS',
  HISTORY = 'HISTORY',
  ARROW_UP = 'ARROW_UP',
  CARET_UP = 'CARET_UP',
  DELEGATE = 'DELEGATE',

  ARROW_LEFT = 'ARROW_LEFT',
  ARROW_RIGHT = 'ARROW_RIGHT',
  ADD_BROWSER = 'ADD_BROWSER',
  ROTATE_RIGHT_BROWSER = 'ROTATE_RIGHT_BROWSER',
  AT = 'AT',
  ENCRYPT = 'ENCRYPT',
  DECRYPT = 'DECRYPT',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  REMOVE = 'REMOVE',
  EDIT = 'EDIT',
  EXPAND = 'EXPAND',
  CHECK = 'CHECK',
  CLOSE_CIRCLE = 'CLOSE_CIRCLE',
  SCANNER = 'SCANNER',
  EYE = 'EYE',
  EYE_CROSSED = 'EYE_CROSSED',
  SETTINGS_OPERATIONS = 'SETTINGS_OPERATIONS',
  SETTINGS_RPC = 'SETTINGS_RPC',
  SAVE_RPC = 'SAVE_RPC',
  OPEN = 'OPEN',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  DHF_AMOUNT = 'DHF_AMOUNT',
  CLOCK = 'CLOCK',
  LOGO_HAS = 'LOGO_HAS',
  VOTING_MANA = 'VOTING_MANA',
  RC = 'RC',
  HIVE = 'HIVE',
  HBD = 'HBD',
  POWER_ICON = 'POWER_ICON',
  POWER_UP = 'POWER_UP',
  EMPTY_WALLET = 'EMPTY_WALLET',
  ADD_TAB = 'ADD_TAB',
  BROWSER = 'BROWSER',
  SWAP = 'SWAP',
  SHARE = 'SHARE',
  COPY = 'COPY',
  EXCHANGE_ARROW = 'EXCHANGE_ARROW',
  EXCHANGE_ARROW_CIRCLED = 'EXCHANGE_ARROW_CIRCLED',
  HOME_BROWSER = 'HOME_BROWSER',
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  SETTINGS_MULTISIG = 'SETTINGS_MULTISIG',
  SETTINGS_NOTIFICATIONS = 'SETTINGS_NOTIFICATIONS',
  CALENDAR = 'CALENDAR',

  //Browser Swipe
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT',
  SWIPE_DOWN = 'SWIPE_DOWN',
  DRAG = 'DRAG',
  TWO_FINGERS_TAP = 'TWO_FINGERS_TAP',
}

// Central mapping of Icons to their SVG components to avoid large switch statements
// Consumers can render by selecting the component for a given enum.
import React from 'react';
import {SvgProps} from 'react-native-svg';

// Common UI
import AddCircleOutline from 'assets/images/common-ui/add-circle-outline.svg';
import ArrowLeft from 'assets/images/common-ui/arrow-left.svg';
import ArrowRight from 'assets/images/common-ui/arrow-right.svg';
import ArrowUp from 'assets/images/common-ui/arrow-up.svg';
import At from 'assets/images/common-ui/at.svg';
import Calendar from 'assets/images/common-ui/calendar.svg';
import CaretUp from 'assets/images/common-ui/caret-up.svg';
import Check from 'assets/images/common-ui/check.svg';
import Clock from 'assets/images/common-ui/clock.svg';
import CloseCircle from 'assets/images/common-ui/close-circle.svg';
import Copy from 'assets/images/common-ui/copy.svg';
import Edit from 'assets/images/common-ui/edit.svg';
import ErrorSvg from 'assets/images/common-ui/error.svg';
import ExpandLess from 'assets/images/common-ui/expand-less.svg';
import ExpandMore from 'assets/images/common-ui/expand-more.svg';
import Expand from 'assets/images/common-ui/expand.svg';
import ExternalLink from 'assets/images/common-ui/external-link.svg';
import EyeCrossed from 'assets/images/common-ui/eye-crossed.svg';
import Eye from 'assets/images/common-ui/eye.svg';
import Filters from 'assets/images/common-ui/filters.svg';
import Info from 'assets/images/common-ui/info.svg';
import Remove from 'assets/images/common-ui/remove.svg';
import SaveRpc from 'assets/images/common-ui/save-rpc.svg';
import Scanner from 'assets/images/common-ui/scanner.svg';
import Search from 'assets/images/common-ui/search.svg';
import Share from 'assets/images/common-ui/share.svg';
import Success from 'assets/images/common-ui/success.svg';

// Browser
import Browser from 'assets/images/bottom-bar/browser.svg';
import AddBrowser from 'assets/images/browser/add-browser.svg';
import AddTab from 'assets/images/browser/add-tab.svg';
import Desktop from 'assets/images/browser/desktop.svg';
import Drag from 'assets/images/browser/drag.svg';
import HomeBrowser from 'assets/images/browser/home-browser.svg';
import Mobile from 'assets/images/browser/mobile.svg';
import RotateRightBrowser from 'assets/images/browser/rotate-right-browser.svg';
import SwipeDown from 'assets/images/browser/swipe-down.svg';
import SwipeLeft from 'assets/images/browser/swipe-left.svg';
import SwipeRight from 'assets/images/browser/swipe-right.svg';
import TwoFingersTap from 'assets/images/browser/two-fingers-tap.svg';

// Menus & Settings
import Help from 'assets/images/drawer/help.svg';
import Accounts from 'assets/images/menus/accounts.svg';
import AccountCreate from 'assets/images/menus/accounts/account-create.svg';
import Governance from 'assets/images/menus/governance.svg';
import Support from 'assets/images/menus/help/support.svg';
import Tutorial from 'assets/images/menus/help/tutorial.svg';
import Logout from 'assets/images/menus/logout.svg';
import Settings from 'assets/images/menus/settings.svg';
import AutomatedTasks from 'assets/images/menus/settings/automated-tasks.svg';
import Export from 'assets/images/menus/settings/export.svg';
import SettingsMultisig from 'assets/images/menus/settings/settings-multisig.svg';
import SettingsNotifications from 'assets/images/menus/settings/settings-notifications.svg';
import SettingsOperations from 'assets/images/menus/settings/settings-operations.svg';
import SettingsRpc from 'assets/images/menus/settings/settings-rpc.svg';
import SettingsWheel from 'assets/images/menus/settings/settings-wheel.svg';
import Theme from 'assets/images/menus/theme.svg';

// Wallet & Hive assets
import Convert from 'assets/images/wallet/convert.svg';
import Decrypt from 'assets/images/wallet/decrypt.svg';
import DelegateToken from 'assets/images/wallet/delegate-token.svg';
import Delegate from 'assets/images/wallet/delegate.svg';
import EmptyWallet from 'assets/images/wallet/empty-wallet.svg';
import Encrypt from 'assets/images/wallet/encrypt.svg';
import Gift from 'assets/images/wallet/gift.svg';
import History from 'assets/images/wallet/history.svg';
import PowerDown from 'assets/images/wallet/power-down.svg';
import PowerIcon from 'assets/images/wallet/power-icon.svg';
import PowerUpDown from 'assets/images/wallet/power-up-down.svg';
import PowerUp from 'assets/images/wallet/power-up.svg';
import Rc from 'assets/images/wallet/rc.svg';
import Savings from 'assets/images/wallet/savings.svg';
import Stake from 'assets/images/wallet/stake.svg';
import Swap from 'assets/images/wallet/swap.svg';
import ExchangeArrowCircled from 'assets/images/wallet/swap/exchange-arrow-circled.svg';
import ExchangeArrow from 'assets/images/wallet/swap/exchange-arrow.svg';
import Transfer from 'assets/images/wallet/transfer.svg';
import Unstake from 'assets/images/wallet/unstake.svg';
import VotingMana from 'assets/images/wallet/voting-mana.svg';

// Hive / HAS / Logos
import LogoHas from 'assets/images/has/logo-has.svg';
import Hbd from 'assets/images/hive/hbd.svg';
import Hive from 'assets/images/hive/hive.svg';

export const ICON_COMPONENTS: Record<Icons, React.FC<SvgProps>> = {
  [Icons.ACCOUNT]: LogoHas,
  [Icons.AUTOMATED_TASKS]: AutomatedTasks,
  [Icons.ERROR]: ErrorSvg,
  [Icons.SUCCESS]: Success,

  [Icons.EXPORT]: Export,
  [Icons.SUPPORT]: Support,
  [Icons.HELP]: Help,
  [Icons.TUTORIAL]: Tutorial,

  [Icons.TRANSFER]: Transfer,
  [Icons.RECURRENT_TRANSFER]: Transfer,
  [Icons.FILL_RECURRENT_TRANSFER]: Transfer,

  [Icons.SAVINGS]: Savings,

  [Icons.POWER_UP_DOWN]: PowerUpDown,
  [Icons.POWER_DOWN]: PowerDown,

  [Icons.CLAIM_REWARD_BALANCE]: Gift,
  [Icons.INTEREST]: Gift,

  [Icons.DELEGATE_TOKEN]: DelegateToken,
  [Icons.ACCOUNT_CREATE]: AccountCreate,
  [Icons.CONVERT]: Convert,
  [Icons.EXPAND_MORE]: ExpandMore,
  [Icons.EXPAND_LESS]: ExpandLess,
  [Icons.ADD_CIRCLE_OUTLINE]: AddCircleOutline,
  [Icons.SETTINGS]: Settings,
  [Icons.ACCOUNTS]: Accounts,
  [Icons.GOVERNANCE]: Governance,
  [Icons.THEME]: Theme,
  [Icons.INFO]: Info,
  [Icons.LOGOUT]: Logout,
  [Icons.SEARCH]: Search,
  [Icons.SETTINGS_WHEEL]: SettingsWheel,
  [Icons.FILTERS]: Filters,
  [Icons.HISTORY]: History,
  [Icons.ARROW_UP]: ArrowUp,
  [Icons.CARET_UP]: CaretUp,
  [Icons.DELEGATE]: Delegate,

  [Icons.ARROW_LEFT]: ArrowLeft,
  [Icons.ARROW_RIGHT]: ArrowRight,
  [Icons.ADD_BROWSER]: AddBrowser,
  [Icons.ROTATE_RIGHT_BROWSER]: RotateRightBrowser,
  [Icons.AT]: At,
  [Icons.ENCRYPT]: Encrypt,
  [Icons.DECRYPT]: Decrypt,
  [Icons.STAKE]: Stake,
  [Icons.UNSTAKE]: Unstake,
  [Icons.REMOVE]: Remove,
  [Icons.EDIT]: Edit,
  [Icons.EXPAND]: Expand,
  [Icons.CHECK]: Check,
  [Icons.CLOSE_CIRCLE]: CloseCircle,
  [Icons.SCANNER]: Scanner,
  [Icons.EYE]: Eye,
  [Icons.EYE_CROSSED]: EyeCrossed,
  [Icons.SETTINGS_OPERATIONS]: SettingsOperations,
  [Icons.SETTINGS_RPC]: SettingsRpc,
  [Icons.SAVE_RPC]: SaveRpc,
  [Icons.OPEN]: ExternalLink,
  [Icons.EXTERNAL_LINK]: ExternalLink,
  [Icons.DHF_AMOUNT]: Gift,
  [Icons.CLOCK]: Clock,
  [Icons.LOGO_HAS]: LogoHas,
  [Icons.VOTING_MANA]: VotingMana,
  [Icons.RC]: Rc,
  [Icons.HIVE]: Hive,
  [Icons.HBD]: Hbd,
  [Icons.POWER_ICON]: PowerIcon,
  [Icons.POWER_UP]: PowerUp,
  [Icons.EMPTY_WALLET]: EmptyWallet,
  [Icons.ADD_TAB]: AddTab,
  [Icons.BROWSER]: Browser,
  [Icons.SWAP]: Swap,
  [Icons.SHARE]: Share,
  [Icons.COPY]: Copy,
  [Icons.EXCHANGE_ARROW]: ExchangeArrow,
  [Icons.EXCHANGE_ARROW_CIRCLED]: ExchangeArrowCircled,
  [Icons.HOME_BROWSER]: HomeBrowser,
  [Icons.DESKTOP]: Desktop,
  [Icons.MOBILE]: Mobile,
  [Icons.SETTINGS_MULTISIG]: SettingsMultisig,
  [Icons.SETTINGS_NOTIFICATIONS]: SettingsNotifications,
  [Icons.CALENDAR]: Calendar,

  [Icons.SWIPE_LEFT]: SwipeLeft,
  [Icons.SWIPE_RIGHT]: SwipeRight,
  [Icons.SWIPE_DOWN]: SwipeDown,
  [Icons.DRAG]: Drag,
  [Icons.TWO_FINGERS_TAP]: TwoFingersTap,
};
