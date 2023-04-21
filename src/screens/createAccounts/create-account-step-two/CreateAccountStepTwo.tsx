import {PrivateKey} from '@hiveio/dhive';
import Clipboard from '@react-native-community/clipboard';
import {addAccount} from 'actions/accounts';
import {Account} from 'actions/interfaces';
import OperationButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {CreateAccountFromWalletNavigationProps} from 'navigators/mainDrawerStacks/CreateAccount.types';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
  GeneratedKeys,
} from 'utils/account-creation.utils';
import {Height} from 'utils/common.types';
import {KeychainKeyTypes} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';

const DEFAULT_EMPTY_KEYS = {
  owner: {public: '', private: ''},
  active: {public: '', private: ''},
  posting: {public: '', private: ''},
  memo: {public: '', private: ''},
} as GeneratedKeys;

const DEFAULT_EXTRA_INFO_CLIPBOARD = (account: string) =>
  `\n    Account creation date: ${new Date().toISOString()}\n    Created using account: ${account}`;

const CreateAccountStepTwo = ({
  user,
  navigation,
  route,
  accounts,
  addAccount,
}: PropsFromRedux & CreateAccountFromWalletNavigationProps) => {
  const [focus, setFocus] = useState(Math.random());
  const styles = getDimensionedStyles({...useWindowDimensions()});

  useLockedPortrait(navigation);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocus(Math.random());
    });
    return unsubscribe;
  }, []);

  const navigationParams = route.params;

  const [masterKey, setMasterKey] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState(DEFAULT_EMPTY_KEYS);
  const [keysTextVersion, setKeysTextVersion] = useState('');

  const accountName = navigationParams.newUsername;
  const price = navigationParams.price;
  const creationType = navigationParams.creationType as AccountCreationType;
  const selectedAccount = navigationParams.usedAccount as Account;

  const [paymentUnderstanding, setPaymentUnderstanding] = useState(false);
  const [safelyCopied, setSafelyCopied] = useState(false);
  const [
    notPrimaryStorageUnderstanding,
    setNotPrimaryStorageUnderstanding,
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const masterKey = AccountCreationUtils.generateMasterKey();
    setMasterKey(masterKey);
  }, []);

  useEffect(() => {
    if (masterKey === '') {
      setGeneratedKeys(DEFAULT_EMPTY_KEYS);
      return;
    }
    const posting = PrivateKey.fromLogin(accountName, masterKey, 'posting');
    const active = PrivateKey.fromLogin(accountName, masterKey, 'active');
    const memo = PrivateKey.fromLogin(accountName, masterKey, 'memo');
    const owner = PrivateKey.fromLogin(accountName, masterKey, 'owner');

    setGeneratedKeys({
      owner: {
        private: owner.toString(),
        public: owner.createPublic().toString(),
      },
      active: {
        private: active.toString(),
        public: active.createPublic().toString(),
      },
      posting: {
        private: posting.toString(),
        public: posting.createPublic().toString(),
      },
      memo: {
        private: memo.toString(),
        public: memo.createPublic().toString(),
      },
    });
  }, [masterKey]);

  useEffect(() => {
    if (masterKey.length) {
      setKeysTextVersion(generateKeysTextVersion());
    } else {
      setKeysTextVersion('');
    }
    setNotPrimaryStorageUnderstanding(false);
    setSafelyCopied(false);
    setPaymentUnderstanding(false);
  }, [generatedKeys]);

  const generateKeysTextVersion = () => {
    return `    
    Account name: @${accountName}
    ---------Master password:--------- 
    ${masterKey}
    ---------Owner Key:--------- 
    Private: ${generatedKeys.owner.private}
    Public: ${generatedKeys.owner.public}
    ---------Active Key:--------- 
    Private: ${generatedKeys.active.private}
    Public: ${generatedKeys.active.public}
    ---------Posting Key:---------
    Private: ${generatedKeys.posting.private}
    Public: ${generatedKeys.posting.public}
    ---------Memo Key:---------
    Private: ${generatedKeys.memo.private}
    Public: ${generatedKeys.memo.public}
    -------------------------------`;
  };

  const copyAllKeys = () => {
    Clipboard.setString(
      generateKeysTextVersion() + DEFAULT_EXTRA_INFO_CLIPBOARD(user.name!),
    );
    Toast.show(translate('toast.copied_text'));
  };

  const getPaymentCheckboxLabel = () => {
    switch (creationType) {
      case AccountCreationType.BUYING:
        return translate('components.create_account.buy_method_message', {
          price: price.toString(),
          account: selectedAccount.name,
        });
      case AccountCreationType.USING_TICKET:
        return translate(
          'components.create_account.claim_account_method_message',
          {account: selectedAccount.name},
        );
    }
  };

  const createAccount = async () => {
    if (
      paymentUnderstanding &&
      safelyCopied &&
      notPrimaryStorageUnderstanding
    ) {
      setLoading(true);
      try {
        if (!selectedAccount.keys.active)
          throw new Error(
            translate('common.missing_key', {key: KeychainKeyTypes.active}),
          );
        const result = await AccountCreationUtils.createAccount(
          creationType,
          accountName,
          selectedAccount.name!,
          selectedAccount.keys.active!,
          AccountCreationUtils.generateAccountAuthorities(generatedKeys),
          price,
          generatedKeys,
        );
        if (result) {
          Toast.show(
            translate('components.create_account.create_account_successful'),
          );
          addAccount(result.name, result.keys, true, false);
          resetStackAndNavigate('WALLET');
        } else {
          Toast.show(
            translate('components.create_account.create_account_failed'),
          );
        }
      } catch (err) {
        Toast.show(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show('components.create_account.need_accept_terms_condition');
      return;
    }
  };

  return (
    <WalletPage>
      <Background>
        <>
          <FocusAwareStatusBar
            barStyle="light-content"
            backgroundColor="black"
          />
          {keysTextVersion.length > 0 && (
            <>
              <ScrollView style={styles.keysContainer}>
                <Text style={[styles.keysText, styles.whiteText]}>
                  {keysTextVersion}
                </Text>
              </ScrollView>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={paymentUnderstanding}
                  onPress={() => setPaymentUnderstanding(!paymentUnderstanding)}
                  title={getPaymentCheckboxLabel()}
                  containerStyle={styles.transparentColor}
                  textStyle={styles.whiteText}
                />
                <CheckBox
                  checked={safelyCopied}
                  onPress={() => setSafelyCopied(!safelyCopied)}
                  title={translate(
                    'components.create_account.safely_copied_keys',
                  )}
                  containerStyle={styles.transparentColor}
                  textStyle={styles.whiteText}
                />
                <CheckBox
                  checked={notPrimaryStorageUnderstanding}
                  onPress={() =>
                    setNotPrimaryStorageUnderstanding(
                      !notPrimaryStorageUnderstanding,
                    )
                  }
                  title={translate(
                    'components.create_account.storage_understanding',
                  )}
                  containerStyle={styles.transparentColor}
                  textStyle={styles.whiteText}
                />
              </View>
              <OperationButton
                style={styles.button}
                title={translate('components.create_account.copy')}
                onPress={() => copyAllKeys()}
              />
              <OperationButton
                isLoading={loading}
                disabled={
                  !safelyCopied &&
                  !notPrimaryStorageUnderstanding &&
                  !paymentUnderstanding
                }
                style={
                  safelyCopied &&
                  notPrimaryStorageUnderstanding &&
                  paymentUnderstanding
                    ? styles.button
                    : styles.buttonDisabled
                }
                title={translate('components.create_account.create_account')}
                onPress={() => createAccount()}
              />
            </>
          )}
        </>
      </Background>
    </WalletPage>
  );
};

const getDimensionedStyles = ({height}: Height) =>
  StyleSheet.create({
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    button: {marginTop: 20},
    buttonDisabled: {
      backgroundColor: 'gray',
      marginTop: 20,
    },
    keysContainer: {
      maxHeight: 300,
      backgroundColor: 'rgba(0, 0, 0, 0.34)',
    },
    keysText: {
      marginHorizontal: 4,
      marginTop: 5,
      borderColor: 'white',
      borderWidth: 1,
      padding: 3,
    },
    checkboxContainer: {
      flexDirection: 'column',
    },
    checkbox: {
      alignSelf: 'center',
    },
    whiteText: {
      color: 'white',
    },
    transparentColor: {backgroundColor: 'rgba(0,0,0,0)', borderWidth: 0},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      accounts: state.accounts,
    };
  },
  {addAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepTwo);
