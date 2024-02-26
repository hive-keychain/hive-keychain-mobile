import {addKey, forgetAccount, forgetKey, loadAccount} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import Key from 'components/hive/Key';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {MARGINPADDING} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AccountManagement = ({
  account,
  forgetKey,
  forgetAccount,
  addKey,
  navigation,
  accounts,
  loadAccount,
}: PropsFromRedux & {navigation: MainNavigation}) => {
  const [username, setUsername] = useState(account.name);
  useLockedPortrait(navigation);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUsername(account.name);
    });
    return unsubscribe;
  }, [navigation, account.name]);
  if (!username) return null;

  const getItemDropDownSelected = (username: string): DropdownModalItem => {
    const selected = accounts.filter((acc) => acc.name === username)[0];
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownModalItem;
    });

  return (
    <Background theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />
        <ScrollView>
          <DropdownModal
            list={getListFromAccount()}
            selected={getItemDropDownSelected(username)}
            onSelected={(selectedAccount) => {
              loadAccount(selectedAccount.value);
              setUsername(selectedAccount.value);
            }}
            dropdownIconScaledSize={{width: 15, height: 15}}
            additionalDropdowContainerStyle={styles.dropdownContainer}
            additionalOverlayStyle={styles.dropdownOverlay}
            showSelectedIcon={
              <Icon
                name={Icons.CHECK}
                theme={theme}
                width={15}
                height={15}
                strokeWidth={2}
                color={PRIMARY_RED_COLOR}
              />
            }
            copyButtonValue
          />
          <Separator height={10} />
          <Key
            type={KeyTypes.posting}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
            theme={theme}
          />
          <Key
            type={KeyTypes.active}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
            theme={theme}
          />
          <Key
            type={KeyTypes.memo}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
            theme={theme}
          />
          <Separator height={20} />
          <EllipticButton
            style={getButtonStyle(theme).warningStyleButton}
            title={translate('common.forget_account')}
            onPress={() => {
              if (username) {
                forgetAccount(username);
                navigate('WALLET');
              }
            }}
            additionalTextStyle={styles.operationButtonText}
          />
          <Separator height={25} />
        </ScrollView>
      </SafeArea>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    safeArea: {paddingHorizontal: 16},
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    },
    avatar: {width: 30, height: 30, borderRadius: 50},
    operationButtonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        height,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    dropdownContainer: {
      width: '100%',
      padding: 0,
      borderRadius: 20,
      marginBottom: 0,
    },
    dropdownOverlay: {
      paddingHorizontal: MARGINPADDING,
    },
  });

const mapStateToProps = (state: RootState) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});
const connector = connect(mapStateToProps, {
  forgetAccount,
  addKey,
  forgetKey,
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AccountManagement);
