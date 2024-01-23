import {Account} from 'actions/interfaces';
import {DropdownItem} from 'components/form/CustomDropdown';
import {PickerItemInterface} from 'components/form/PickerItem';
import UserDropdown from 'components/form/UserDropdown';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
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
      <UserDropdown
        list={getListFromAccount()}
        selected={getItemDropDownSelected(account)}
        onSelected={(selectedAccount) => setAccount(selectedAccount)}
        additionalContainerStyle={styles.dropdownContainer}
        additionalDropdowContainerStyle={styles.dropdownListContainer}
        dropdownIconScaledSize={{width: 10, height: 10}}
        additionalTextStyle={styles.text}
      />
    </View>
  );
};

const getDimensionedStyles = ({width}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {width: '100%', marginTop: -30, marginBottom: 10},
    avatar: {width: 25, height: 25, borderRadius: 50},
    dropdownContainer: {
      width: 'auto',
      height: 70,
      padding: 0,
    },
    dropdownListContainer: {
      borderRadius: 10,
      height: '100%',
    },
    text: {
      fontSize: 13,
    },
  });
