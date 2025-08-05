import {loadAccount, reorderAccounts} from 'actions/index';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {ComponentProps, useEffect, useState} from 'react';
import {ConnectedProps, connect} from 'react-redux';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {RootState} from 'store';
import DropdownModal, {DropdownModalItem} from './DropdownModal';

type Props = Partial<ComponentProps<typeof DropdownModal>> &
  PropsFromRedux & {
    canBeReordered?: boolean;
  };

const UserDropdown = ({
  loadAccount,
  reorderAccounts,
  activeAccount,
  accounts,
  canBeReordered,
  ...props
}: Props) => {
  const [list, setList] = useState<DropdownModalItem[]>([]);
  const getItemDropDownSelected = (username: string): DropdownModalItem => {
    const selected = accounts.filter((acc) => acc.name === username)[0];
    return {
      label: selected?.name,
      value: selected?.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownModalItem;
    });

  useEffect(() => {
    setList(getListFromAccount());
  }, [accounts.length]);

  return (
    <DropdownModal
      hideLabel
      list={list}
      selected={getItemDropDownSelected(activeAccount.name!)}
      onSelected={(selectedAccount) => loadAccount(selectedAccount.value, true)}
      additionalDropdowContainerStyle={styles.dropdownContainer}
      additionalOverlayStyle={styles.dropdownOverlay}
      dropdownIconScaledSize={{width: 15, height: 15}}
      dropdownTitle="common.accounts"
      showSelectedIcon
      canBeReordered={canBeReordered}
      onReorder={(data) => {
        const orderMap = new Map(
          data.map((item, index) => [item.value, index]),
        );
        const reordered = [...accounts].sort(
          (a, b) => orderMap.get(a.name) - orderMap.get(b.name),
        );
        reorderAccounts(reordered);
      }}
      {...props}
    />
  );
};
const styles = {
  avatar: {width: 30, height: 30, borderRadius: 50},
  dropdownContainer: {
    width: '100%',
    padding: 0,
    borderRadius: 30,
  },
  dropdownOverlay: {
    paddingHorizontal: MARGIN_PADDING,
  },
};

const connector = connect(
  (state: RootState) => {
    return {
      activeAccount: state.activeAccount,
      accounts: state.accounts,
    };
  },
  {loadAccount, reorderAccounts},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UserDropdown);
