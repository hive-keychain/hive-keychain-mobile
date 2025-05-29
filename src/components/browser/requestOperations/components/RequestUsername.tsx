import {Account} from 'actions/interfaces';
import DropdownModal from 'components/form/DropdownModal';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {useEffect} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getFontSizeSmallDevices} from 'src/styles/typography';
import {store} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import RequestItem from './RequestItem';

type Props = {
  username: string;
  accounts: Account[];
  account: string;
  setAccount: (account: string) => void;
  enforce: boolean;
};

export default ({username, setAccount, enforce, accounts, account}: Props) => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const activeAccountName = store.getState().activeAccount.name;
  const [selectedAccount, setSelectedAccount] = React.useState(
    username ||
      accounts.find((acc) => acc.name === activeAccountName)?.name ||
      account,
  );

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

  return username && enforce ? (
    <RequestItem
      title={translate('request.item.username')}
      content={`@${username}`}
    />
  ) : (
    <View style={styles.container}>
      <DropdownModal
        list={accounts.map((e) => toDropdownFormat(e.name))}
        dropdownTitle="common.accounts"
        hideLabel
        selected={toDropdownFormat(selectedAccount)}
        onSelected={(selectedAccount) => {
          setAccount(selectedAccount.value);
          setSelectedAccount(selectedAccount.value);
        }}
      />
      <Separator />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {width: '100%', marginBottom: 10, height: 60},
    avatar: {width: 30, height: 30, borderRadius: 50},
    text: {
      fontSize: getFontSizeSmallDevices(width, 13),
    },
  });
