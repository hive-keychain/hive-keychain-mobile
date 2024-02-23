import {Account} from 'actions/interfaces';
import {DropdownItem} from 'components/form/CustomDropdown';
import DropdownModal from 'components/form/DropdownModal';
import {PickerItemInterface} from 'components/form/PickerItem';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {SMALLEST_SCREEN_HEIGHT_SUPPORTED} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import RequestItem from './RequestItem';

type Props = {
  username: string;
  accounts: Account[];
  account: string;
  setAccount: (account: string) => void;
};
export default ({username, accounts, account, setAccount}: Props) => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownItem;
    });

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0]!;
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  return username ? (
    <RequestItem
      title={translate('request.item.username')}
      content={`@${username}`}
    />
  ) : (
    <View style={styles.container}>
      <DropdownModal
        list={getListFromAccount()}
        selected={getItemDropDownSelected(account)}
        onSelected={(selectedAccount) => setAccount(selectedAccount.value)}
      />
      <Separator />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {width: '100%', marginTop: -30, marginBottom: 10, height: 60},
    avatar: {width: 25, height: 25, borderRadius: 50},
    dropdownContainer: {
      width: 'auto',
      padding: 0,
      height: height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? 45 : 50,
      borderRadius: 10,
    },
    dropdownListContainer: {
      borderRadius: 10,
      height: '100%',
    },
    text: {
      fontSize: 13,
    },
  });
