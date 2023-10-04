import GovernanceMenuIconDark from 'assets/new_UI/bank-dark.svg';
import GovernanceMenuIconLight from 'assets/new_UI/bank-light.svg';
import UserPrefMenuIconDark from 'assets/new_UI/candle-dark.svg';
import UserPrefMenuIconLight from 'assets/new_UI/candle-light.svg';
import ThemeMenuIconDark from 'assets/new_UI/category-dark.svg';
import ThemeMenuIconLight from 'assets/new_UI/category-light.svg';
import TokensMenuIconDark from 'assets/new_UI/hive_red_alternative_logo-dark.svg';
import TokensMenuIconLight from 'assets/new_UI/hive_red_alternative_logo-light.svg';
import AboutMenuIconDark from 'assets/new_UI/info-circle-dark.svg';
import AboutMenuIconLight from 'assets/new_UI/info-circle-light.svg';
import LogoutMenuIconDark from 'assets/new_UI/logout-dark.svg';
import LogoutMenuIconLight from 'assets/new_UI/logout-light.svg';
import AccountsMenuIconDark from 'assets/new_UI/profile-dark.svg';
import AccountsMenuIconLight from 'assets/new_UI/profile-light.svg';
import SearchIconDark from 'assets/new_UI/search_dark.svg';
import SearchIconLight from 'assets/new_UI/search_light.svg';
import SettingsIconDark from 'assets/new_UI/setting-dark.svg';
import SettingsIconLight from 'assets/new_UI/setting-light.svg';
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
import ExpandMoreIcon from 'src/assets/icons/svgs/expand_more.svg';
import LinkIcon from 'src/assets/icons/svgs/link.svg';
import ClaimIcon from 'src/assets/icons/svgs/redeem.svg';
import SavingsIcon from 'src/assets/icons/svgs/savings.svg';
import TransferIcon from 'src/assets/icons/svgs/send.svg';
import DelegateIcon from 'src/assets/icons/svgs/swap_horiz.svg';
import {Theme} from 'src/context/theme.context';

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

  const usingThemeOrNull = (
    lightIcon: JSX.Element,
    darkIcon: JSX.Element,
    theme?: Theme,
  ) => {
    return theme
      ? theme === Theme.LIGHT
        ? {...lightIcon, ...style.finalStyleOnIcon}
        : {...darkIcon, ...style.finalStyleOnIcon}
      : null;
  };

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
    case 'delete' || 'remove':
      return <DeleteIcon style={style.defaultIconContainer} />;
    case 'candle':
      return usingThemeOrNull(
        <UserPrefMenuIconLight />,
        <UserPrefMenuIconDark />,
        theme,
      );
    case 'accounts' || 'accounts_icon':
      return usingThemeOrNull(
        <AccountsMenuIconLight />,
        <AccountsMenuIconDark />,
        theme,
      );
    case 'tokens':
      return usingThemeOrNull(
        <TokensMenuIconLight />,
        <TokensMenuIconDark />,
        theme,
      );
    case 'governance':
      return usingThemeOrNull(
        <GovernanceMenuIconLight />,
        <GovernanceMenuIconDark />,
        theme,
      );
    //TODO research about how to handle || in a switch case, seems not to take the or option.
    case 'theme' || 'category':
      return usingThemeOrNull(
        <ThemeMenuIconLight />,
        <ThemeMenuIconDark />,
        theme,
      );
    case 'info' || 'about':
      return usingThemeOrNull(
        <AboutMenuIconLight />,
        <AboutMenuIconDark />,
        theme,
      );
    case 'logout' || 'exit':
      return usingThemeOrNull(
        <LogoutMenuIconLight />,
        <LogoutMenuIconDark />,
        theme,
      );
    case 'search':
      return usingThemeOrNull(<SearchIconLight />, <SearchIconDark />, theme);
    case 'settings':
      return usingThemeOrNull(
        <SettingsIconLight />,
        <SettingsIconDark />,
        theme,
      );
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
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  const iconComponent = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
    props.marginRight,
    props.theme,
  );
  const styleProps = {
    style: [styles.defaultIconContainer, props.additionalContainerStyle],
  };
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
    marginRight: 5,
  },
  defaultIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default Icon;
