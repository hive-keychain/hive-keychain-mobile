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
import {Dimensions} from 'utils/common.types';
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
  addAccount,
}: PropsFromRedux & CreateAccountFromWalletNavigationProps) => {
  const styles = getDimensionedStyles({...useWindowDimensions()});

  useLockedPortrait(navigation);

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

  const wrapInHorizontalScrollView = (text: string) => {
    return (
      <ScrollView horizontal>
        <Text style={styles.whiteText}>{text}</Text>
      </ScrollView>
    );
  };

  const renderKeys = () => {
    return (
      <View style={styles.marginHorizontal}>
        <Text style={styles.whiteText}>Account name: @{accountName}</Text>
        <Text
          style={[
            styles.whiteText,
            styles.textCentered,
          ]}>{`----- Master password: ----- `}</Text>
        {wrapInHorizontalScrollView(`${masterKey}`)}
        <Text
          style={[
            styles.whiteText,
            styles.textCentered,
          ]}>{`------------ Owner Key:---------`}</Text>
        {wrapInHorizontalScrollView(`Private: ${generatedKeys.owner.private}`)}
        {wrapInHorizontalScrollView(`Public: ${generatedKeys.owner.public}`)}
        <Text
          style={[
            styles.whiteText,
            styles.textCentered,
          ]}>{`------------ Active Key:--------- `}</Text>
        {wrapInHorizontalScrollView(`Private: ${generatedKeys.active.private}`)}
        {wrapInHorizontalScrollView(`Public: ${generatedKeys.active.public}`)}
        <Text
          style={[
            styles.whiteText,
            styles.textCentered,
          ]}>{`------------ Posting Key:--------`}</Text>
        {wrapInHorizontalScrollView(
          `Private: ${generatedKeys.posting.private}`,
        )}
        {wrapInHorizontalScrollView(`Public: ${generatedKeys.posting.public}`)}
        <Text
          style={[
            styles.whiteText,
            styles.textCentered,
          ]}>{`------------ Memo Key:---------`}</Text>
        {wrapInHorizontalScrollView(`Private: ${generatedKeys.memo.private}`)}
        {wrapInHorizontalScrollView(`Public: ${generatedKeys.memo.public}`)}
      </View>
    );
  };

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
            <View style={styles.container}>
              <ScrollView style={styles.keysContainer}>
                {renderKeys()}
              </ScrollView>
              <View style={styles.checkboxesContainer}>
                <CheckBox
                  checked={paymentUnderstanding}
                  onPress={() => setPaymentUnderstanding(!paymentUnderstanding)}
                  title={getPaymentCheckboxLabel()}
                  containerStyle={styles.checkbox}
                  textStyle={styles.whiteText}
                  checkedColor="white"
                />
                <CheckBox
                  checked={safelyCopied}
                  onPress={() => setSafelyCopied(!safelyCopied)}
                  title={translate(
                    'components.create_account.safely_copied_keys',
                  )}
                  containerStyle={styles.checkbox}
                  textStyle={styles.whiteText}
                  checkedColor="white"
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
                  containerStyle={styles.checkbox}
                  textStyle={styles.whiteText}
                  checkedColor="white"
                />
              </View>
              <OperationButton
                style={[styles.button, styles.buttonMarginTop]}
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
                style={[
                  safelyCopied &&
                  notPrimaryStorageUnderstanding &&
                  paymentUnderstanding
                    ? styles.button
                    : styles.buttonDisabled,
                  styles.buttonMarginTop,
                ]}
                title={translate('components.create_account.create_account')}
                onPress={() => createAccount()}
              />
            </View>
          )}
        </>
      </Background>
    </WalletPage>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      marginHorizontal: width * 0.06,
      flex: 1,
    },
    button: {
      width: '100%',
      marginHorizontal: 0,
    },
    buttonDisabled: {
      backgroundColor: 'gray',
      width: '100%',
      marginHorizontal: 0,
    },
    keysContainer: {
      maxHeight: 250,
      backgroundColor: 'rgba(0, 0, 0, 0.34)',
      overflow: 'hidden',
      marginTop: 20,
    },
    keysText: {
      borderColor: 'white',
      borderWidth: 1,
    },
    checkboxesContainer: {
      marginVertical: 10,
    },
    whiteText: {
      color: 'white',
    },
    textCentered: {textAlign: 'center'},
    buttonMarginTop: {
      marginTop: 20,
    },
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      width: '95%',
      padding: 0,
      borderColor: 'rgba(0,0,0,0)',
    },
    marginHorizontal: {marginHorizontal: 10},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {addAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepTwo);
