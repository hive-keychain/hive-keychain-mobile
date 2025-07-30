import {Account} from 'actions/interfaces';
import DropdownModal from 'components/form/DropdownModal';
import Separator from 'components/ui/Separator';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';
import {store} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

type Props = {
  accounts: Account[];
  account: string;
  setAccount: (account: string) => void;
  enforce: boolean;
};

export default ({setAccount, enforce, accounts, account}: Props) => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const activeAccountName = store.getState().activeAccount.name;
  const {width} = useWindowDimensions();
  const [selectedAccount, setSelectedAccount] = React.useState(() => {
    // If account is not in accounts and is same as activeAccountName, find next account
    if (
      !accounts.find((acc) => acc.name === account) &&
      account === activeAccountName
    ) {
      const nextAccount = accounts.find(
        (acc) => acc.name !== activeAccountName,
      );
      return nextAccount?.name || account;
    }
    // Otherwise use the account if it exists in accounts, or fallback to activeAccountName
    return (
      accounts.find((acc) => acc.name === account)?.name || activeAccountName
    );
  });
  console.log('account', account);

  useEffect(() => {
    setSelectedAccount(account);
  }, [account]);

  const toDropdownFormat = (account: string) => {
    return {
      value: account,
      label: account,
      icon: <UserProfilePicture username={account} style={styles.avatar} />,
    };
  };

  return account && accounts.length === 1 && enforce ? (
    <View
      style={[
        styles.container,
        {flexDirection: 'row', justifyContent: 'space-between'},
      ]}>
      <Text
        style={[
          getFormFontStyle(width, theme).title,
          {fontWeight: 'bold', paddingRight: 4},
        ]}>
        {translate('request.item.username')}
      </Text>
      <UsernameWithAvatar username={account} />
    </View>
  ) : (
    <View style={styles.container}>
      <DropdownModal
        list={accounts.map((e) => toDropdownFormat(e.name))}
        dropdownTitle="common.accounts"
        hideLabel
        selected={toDropdownFormat(selectedAccount)}
        onSelected={(selectedAccount) => {
          console.log('selectedAccount', selectedAccount);
          setSelectedAccount(selectedAccount.value);
          setAccount(selectedAccount.value);
        }}
      />
      <Separator />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1},
    avatar: {width: 30, height: 30, borderRadius: 50},
    content: {color: getColors(theme).secondaryText, flexWrap: 'wrap'},
  });
