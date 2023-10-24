import {addKey, forgetAccount, forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import ItemDropdown from 'components/form/ItemDropdown';
import Key from 'components/hive/Key';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {RootState} from 'store';
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

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Background using_new_ui theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />

        <ScrollView>
          <ItemDropdown
            theme={theme}
            itemDropdownList={accounts.map((acc) => {
              return {
                label: acc.name,
                value: acc.name,
                icon: (
                  <UserProfilePicture
                    username={acc.name}
                    style={styles.avatar}
                  />
                ),
              };
            })}
            additionalContainerStyle={[styles.cardKey, styles.zIndexBase]}
            additionalContainerListStyle={[
              styles.itemListContainer,
              styles.zIndexLower,
            ]}
            onSelectedItem={(item) => setUsername(item.value)}
          />
          <Separator height={20} />
          <Key
            type={KeyTypes.posting}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
          />
          <Key
            type={KeyTypes.active}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
          />
          <Key
            type={KeyTypes.memo}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={forgetKey}
            navigation={navigation}
          />
          <Separator height={20} />
          <EllipticButton
            style={styles.button}
            title="FORGET ACCOUNT"
            onPress={() => {
              if (username) {
                forgetAccount(username);
                navigate('WALLET');
              }
            }}
          />
          <Separator height={50} />
        </ScrollView>
      </SafeArea>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    disclaimer: {color: '#404950', marginVertical: 2, paddingHorizontal: 20},
    important: {
      color: '#A3112A',
      fontWeight: 'bold',
      marginVertical: 2,
      paddingHorizontal: 20,
    },
    button: {backgroundColor: '#B9122F'},
    keyOdd: {backgroundColor: '#E5EEF7', padding: 20},
    keyEven: {backgroundColor: '#FFFFFF', padding: 20},
    safeArea: {paddingHorizontal: 16},
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      padding: 10,
      marginBottom: 8,
    },
    itemListContainer: {
      top: 20,
      paddingTop: 50,
      paddingBottom: 30,
      width: '99%',
      left: 1,
      paddingHorizontal: 10,
    },
    zIndexBase: {
      zIndex: 10,
    },
    zIndexLower: {
      zIndex: 9,
    },
    avatar: {width: 30, height: 30, borderRadius: 50},
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
