import {Account} from 'actions/interfaces';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import WalletPage from 'components/ui/WalletPage';
import {CreateAccountFromWalletNavigationProps} from 'navigators/mainDrawerStacks/CreateAccount.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {
  AccountCreationUtils,
  GeneratedKeys,
} from 'utils/account-creation.utils';
import {Width} from 'utils/common.types';

const DEFAULT_EMPTY_KEYS = {
  owner: {public: '', private: ''},
  active: {public: '', private: ''},
  posting: {public: '', private: ''},
  memo: {public: '', private: ''},
} as GeneratedKeys;

const CreateAccountStepTwo = ({
  user,
  navigation,
  route,
  accounts,
}: PropsFromRedux & CreateAccountFromWalletNavigationProps) => {
  const [focus, setFocus] = useState(Math.random());
  const styles = getDimensionedStyles(useWindowDimensions());

  //TODO fix this
  //   useLockedPortrait(navigation);
  //   useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', () => {
  //       setFocus(Math.random());
  //     });
  //     return unsubscribe;
  //   }, []);

  //TODO to fill from here...

  const navigationParams = route.params;

  const [masterKey, setMasterKey] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState(DEFAULT_EMPTY_KEYS);
  const [keysTextVersion, setKeysTextVersion] = useState('');

  const accountName = navigationParams.newUsername;
  const price = navigationParams.price;
  const creationType = navigationParams.creationType;
  const selectedAccount = navigationParams.usedAccount as Account;

  const [paymentUnderstanding, setPaymentUnderstanding] = useState(false);
  const [safelyCopied, setSafelyCopied] = useState(false);
  const [
    notPrimaryStorageUnderstanding,
    setNotPrimaryStorageUnderstanding,
  ] = useState(false);

  useEffect(() => {
    const masterKeys = AccountCreationUtils.generateMasterKey();
    console.log({masterKeys});
  }, []);

  return (
    <WalletPage>
      <>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
        <Text>Hi 2dn step!</Text>
        {/* <ScreenToggle
            style={styles.toggle}
            menu={[
              translate(`governance.menu.witnesses`),
              translate(`governance.menu.proxy`),
              translate(`governance.menu.proposals`),
            ]}
            toUpperCase
            components={[
              <Witness user={user} focus={focus} />,
              <Proxy user={user} />,
              <Proposal user={user} />,
            ]}
          /> */}
        {/* {selectedAccount.length > 0 && accountOptions && (
          <CustomPicker
            list={accountOptions.map((account) => account.value)}
            prefix={'@'}
            selectedValue={selectedAccount}
            onSelected={onSelected}
            prompt={'prompt'}
          />
        )}
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 10,
          }}>
          {getPriceLabel()}
        </Text>
        <CustomInput
          autoCapitalize="none"
          //TODO add to locales
          placeholder={'New Account username'}
          // leftIcon={<UserLogo />}
          value={accountName}
          onChangeText={setAccountName}
        />
        <OperationButton
          style={styles.button}
          //TODO add to locales or find it
          title={'NEXT'}
          // isLoading={loading}
          onPress={() => {}}
        /> */}
      </>
    </WalletPage>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    button: {marginTop: 40},
  });

const connector = connect((state: RootState) => {
  return {
    testState: state, //TODO to remove
    user: state.activeAccount,
    accounts: state.accounts,
    // navParams: state.navigation.params,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepTwo);
