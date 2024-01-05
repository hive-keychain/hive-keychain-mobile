import {PrivateKey} from '@hiveio/dhive';
import {addAccount} from 'actions/accounts';
import {Account} from 'actions/interfaces';
import OperationButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import {KeychainKeyTypes} from 'hive-keychain-commons';
import React, {useContext, useEffect, useState} from 'react';
import {
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {BACKGROUNDDARKBLUE, getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_small,
  fields_primary_text_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
  GeneratedKeys,
} from 'utils/account-creation.utils';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';

const DEFAULT_EMPTY_KEYS = {
  owner: {public: '', private: ''},
  active: {public: '', private: ''},
  posting: {public: '', private: ''},
  memo: {public: '', private: ''},
} as GeneratedKeys;

interface Props {
  selectedAccount: Account;
  accountName: string;
  creationType: AccountCreationType;
  price: number;
}

const StepTwo = ({
  user,
  addAccount,
  selectedAccount,
  accountName,
  creationType,
  price,
}: PropsFromRedux & Props) => {
  const [masterKey, setMasterKey] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState(DEFAULT_EMPTY_KEYS);
  const [keysTextVersion, setKeysTextVersion] = useState('');
  const [loadingMasterKey, setLoadingMasterKey] = useState(true);
  const [paymentUnderstanding, setPaymentUnderstanding] = useState(false);
  const [safelyCopied, setSafelyCopied] = useState(false);
  const [
    notPrimaryStorageUnderstanding,
    setNotPrimaryStorageUnderstanding,
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles({...useWindowDimensions()}, theme);

  useEffect(() => {
    const masterKey = AccountCreationUtils.generateMasterKey();
    setMasterKey(masterKey);
  }, []);

  useEffect(() => {
    if (masterKey !== '') {
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
      setLoadingMasterKey(false);
    }
  }, [masterKey]);

  useEffect(() => {
    if (
      generatedKeys.owner.public.length > 0 &&
      generatedKeys.active.public.length > 0
    ) {
      if (masterKey.length) {
        setKeysTextVersion(generateKeysTextVersion());
      } else {
        setKeysTextVersion('');
      }
      setNotPrimaryStorageUnderstanding(false);
      setSafelyCopied(false);
      setPaymentUnderstanding(false);
    }
  }, [generatedKeys]);

  const wrapInHorizontalScrollView = (text: string) => {
    return (
      <ScrollView horizontal>
        <Text style={[styles.text, styles.opacity]}>{text}</Text>
      </ScrollView>
    );
  };

  const addExtraInfoToClipboard = (account: string) =>
    `\n    Account creation date: ${new Date().toISOString()}\n    Created using account: @${account}`;

  const renderKeys = () => {
    return (
      <View style={styles.marginHorizontal}>
        <View style={styles.cardKey}>
          <Text style={styles.title}>
            {translate('common.account_name')}:{' '}
            <Text style={[styles.text, styles.opacity]}>{accountName}</Text>
          </Text>
          <Text style={styles.title}>{translate('keys.master_password')}</Text>
          {wrapInHorizontalScrollView(`${masterKey}`)}
        </View>
        <View style={styles.cardKey}>
          <Text style={styles.title}>{translate('keys.owner_key')}</Text>
          <Text style={styles.title}>{translate('keys.private')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.owner.private}`)}
          <Text style={styles.title}>{translate('keys.public')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.owner.public}`)}
        </View>
        <View style={styles.cardKey}>
          <Text style={styles.title}>{translate('keys.active_key')}</Text>
          <Text style={styles.title}>{translate('keys.private')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.active.private}`)}
          <Text style={styles.title}>{translate('keys.public')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.active.public}`)}
        </View>
        <View style={styles.cardKey}>
          <Text style={styles.title}>{translate('keys.posting_key')}</Text>
          <Text style={styles.title}>{translate('keys.private')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.posting.private}`)}
          <Text style={styles.title}>{translate('keys.public')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.posting.public}`)}
        </View>
        <View style={styles.cardKey}>
          <Text style={styles.title}>{translate('keys.memo_key')}</Text>
          <Text style={styles.title}>{translate('keys.private')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.memo.private}`)}
          <Text style={styles.title}>{translate('keys.public')}</Text>
          {wrapInHorizontalScrollView(`${generatedKeys.memo.public}`)}
        </View>
      </View>
    );
  };

  const generateKeysTextVersion = () => {
    return `    
    ${translate('common.account_name')}: @${accountName}
      ---------${translate('common.title_master_key')} ${translate(
      'common.password',
    )}:--------- 
      ${masterKey}
      ---------${translate('common.title_owner_key')} ${translate(
      'common.key',
    )}:--------- 
      ${translate('common.private')}: ${generatedKeys.owner.private}
      ${translate('common.public')}: ${generatedKeys.owner.public}
      ---------${translate('common.title_active_key')} ${translate(
      'common.key',
    )}:--------- 
      ${translate('common.private')}: ${generatedKeys.active.private}
      ${translate('common.public')}: ${generatedKeys.active.public}
      ---------${translate('common.title_posting_key')} ${translate(
      'common.key',
    )}:---------
      ${translate('common.private')}: ${generatedKeys.posting.private}
      ${translate('common.public')}: ${generatedKeys.posting.public}
      ---------${translate('common.title_memo_key')} ${translate(
      'common.key',
    )}:---------
      ${translate('common.private')}: ${generatedKeys.memo.private}
      ${translate('common.public')}: ${generatedKeys.memo.public}
      -------------------------------`;
  };

  const copyAllKeys = () => {
    Clipboard.setString(
      generateKeysTextVersion() + addExtraInfoToClipboard(selectedAccount.name),
    );
    SimpleToast.show(translate('toast.copied_text'));
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
          creationType as AccountCreationType,
          accountName,
          selectedAccount.name!,
          selectedAccount.keys.active!,
          AccountCreationUtils.generateAccountAuthorities(generatedKeys),
          price,
          generatedKeys,
        );
        if (result) {
          SimpleToast.show(
            translate('components.create_account.create_account_successful'),
          );
          addAccount(result.name, result.keys, true, false);
          resetStackAndNavigate('WALLET');
        } else {
          SimpleToast.show(
            translate('components.create_account.create_account_failed'),
          );
        }
      } catch (err) {
        SimpleToast.show(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      SimpleToast.show(
        translate('components.create_account.need_accept_terms_condition'),
      );
      return;
    }
  };

  return (
    <Background theme={theme}>
      <>
        <FocusAwareStatusBar />
        {keysTextVersion.length > 0 && !loadingMasterKey && (
          <View style={styles.container}>
            <ScrollView style={styles.keysContainer}>{renderKeys()}</ScrollView>
            <View style={styles.checkboxesContainer}>
              <CheckBox
                checked={paymentUnderstanding}
                onPress={() => setPaymentUnderstanding(!paymentUnderstanding)}
                title={getPaymentCheckboxLabel()}
                containerStyle={styles.checkbox}
                textStyle={styles.text}
                checkedColor={getColors(theme).icon}
              />
              <CheckBox
                checked={safelyCopied}
                onPress={() => setSafelyCopied(!safelyCopied)}
                title={translate(
                  'components.create_account.safely_copied_keys',
                )}
                containerStyle={styles.checkbox}
                textStyle={styles.text}
                checkedColor={getColors(theme).icon}
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
                textStyle={styles.text}
                checkedColor={getColors(theme).icon}
              />
            </View>
            <View style={[styles.buttonsContainer, styles.buttonMarginTop]}>
              <OperationButton
                style={[styles.button, styles.whiteBackground]}
                title={translate('components.create_account.copy')}
                onPress={() => copyAllKeys()}
                additionalTextStyle={[styles.buttonText, styles.darkText]}
              />
              <OperationButton
                isLoading={loading}
                disabled={
                  !safelyCopied &&
                  !notPrimaryStorageUnderstanding &&
                  !paymentUnderstanding
                }
                style={[
                  styles.button,
                  safelyCopied &&
                  notPrimaryStorageUnderstanding &&
                  paymentUnderstanding
                    ? getButtonStyle(theme).warningStyleButton
                    : styles.buttonDisabled,
                ]}
                title={translate('components.create_account.create_account')}
                onPress={createAccount}
                additionalTextStyle={[styles.buttonText, styles.whiteText]}
              />
            </View>
          </View>
        )}
        {loadingMasterKey && (
          <View style={styles.loadingContainer}>
            <Loader animating size={'small'} />
          </View>
        )}
      </>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: width * 0.06,
      flex: 1,
    },
    button: {
      width: '45%',
      marginHorizontal: 0,
    },
    buttonDisabled: {
      backgroundColor: 'gray',
      marginHorizontal: 0,
    },
    keysContainer: {
      maxHeight: 250,
      overflow: 'hidden',
      marginTop: 20,
    },
    checkboxesContainer: {
      marginVertical: 10,
    },
    whiteText: {
      color: 'white',
    },
    buttonMarginTop: {
      marginTop: 20,
    },
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      width: '95%',
      padding: 18,
      borderColor: getColors(theme).senaryCardBorderColor,
      borderRadius: 20,
    },
    marginHorizontal: {marginHorizontal: 10},
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      padding: 10,
      marginBottom: 8,
    },
    title: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_2,
    },
    opacity: {
      opacity: 0.7,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    buttonText: {
      ...button_link_primary_small,
    },
    whiteBackground: {
      backgroundColor: '#fff',
    },
    darkText: {
      color: BACKGROUNDDARKBLUE,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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

export default connector(StepTwo);
