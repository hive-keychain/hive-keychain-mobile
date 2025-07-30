import {loadAccount} from 'actions/index';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {ComponentProps} from 'react';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {RootState} from 'store';
import DropdownModal, {DropdownModalItem} from './DropdownModal';

type Props = Partial<ComponentProps<typeof DropdownModal>> & PropsFromRedux;

const UserDropdown = ({
  loadAccount,
  activeAccount,
  accounts,
  ...props
}: Props) => {
  const {theme} = useThemeContext();
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

  return (
    <DropdownModal
      hideLabel
      list={getListFromAccount()}
      selected={getItemDropDownSelected(activeAccount.name!)}
      onSelected={(selectedAccount) => loadAccount(selectedAccount.value, true)}
      additionalDropdowContainerStyle={styles.dropdownContainer}
      additionalOverlayStyle={styles.dropdownOverlay}
      dropdownIconScaledSize={{width: 15, height: 15}}
      dropdownTitle="common.accounts"
      showSelectedIcon
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
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UserDropdown);
