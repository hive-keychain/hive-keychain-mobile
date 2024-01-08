import {addKey, forgetAccount, forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {DropdownItem} from 'components/form/CustomDropdown';
import EllipticButton from 'components/form/EllipticButton';
import {PickerItemInterface} from 'components/form/PickerItem';
import UserDropdown from 'components/form/UserDropdown';
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
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AccountManagement = ({
  account,
  forgetKey,
  forgetAccount,
  addKey,
  navigation,
  accounts,
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

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0];
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions().height);

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownItem;
    });

  return (
    <Background theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />

        <ScrollView>
          <UserDropdown
            list={getListFromAccount()}
            selected={getItemDropDownSelected(username)}
            onSelected={(selectedAccount) => setUsername(selectedAccount)}
            additionalContainerStyle={styles.dropdownContainer}
            additionalDropdowContainerStyle={styles.dropdownListContainer}
            dropdownIconScaledSize={{width: 15, height: 15}}
            iconStyle={styles.avatar}
            copyButtonValue
          />
          <Separator height={20} />
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

const getStyles = (theme: Theme, height: number) =>
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
    itemListContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      width: 200,
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    zIndexBase: {
      zIndex: 10,
    },
    zIndexLower: {
      zIndex: 9,
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
      height: 70,
      padding: 0,
    },
    dropdownListContainer: {
      borderRadius: 10,
      height: '100%',
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
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AccountManagement);
