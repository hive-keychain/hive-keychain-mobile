import {PrivateKey} from '@hiveio/dhive';
import {addAccount} from 'actions/accounts';
import {Account, KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import {
  default as EllipticButton,
  default as OperationButton,
} from 'components/form/EllipticButton';
import TwoFaModal from 'components/modals/TwoFaModal';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import React, {useEffect, useState} from 'react';
import {
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import QRCode from 'react-qr-code';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonStyle} from 'src/styles/button';
import {BACKGROUNDDARKBLUE, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_2,
  button_link_primary_small,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
  GeneratedKeys,
} from 'utils/account-creation.utils';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate, resetStackAndNavigate} from 'utils/navigation';

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
  showModal,
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
  const [qrData, setQrData] = useState<string | undefined>();

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);
  const [isMultisig, twoFABots] = useCheckForMultisig(KeyTypes.active, user);

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
      setPaymentUnderstanding(
        creationType === AccountCreationType.PEER_TO_PEER,
      );
    }
  }, [generatedKeys]);

  const wrapInHorizontalScrollView = (text: string) => {
    return (
      <ScrollView horizontal>
        <Text style={[styles.text, styles.dynamicTextSize, styles.opacity]}>
          {text}
        </Text>
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
            <Text style={[styles.text, styles.dynamicTextSize, styles.opacity]}>
              {accountName}
            </Text>
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
      generateKeysTextVersion() +
        addExtraInfoToClipboard(
          creationType === AccountCreationType.PEER_TO_PEER
            ? 'peer_to_peer'
            : selectedAccount.name,
        ),
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
        if (creationType !== AccountCreationType.PEER_TO_PEER) {
          if (!selectedAccount.keys.active)
            throw new Error(
              translate('common.missing_key', {
                key: translate('keys.active').toLowerCase(),
              }),
            );
          const handleSubmit = async (options: TransactionOptions) => {
            const result = await AccountCreationUtils.createAccount(
              creationType as AccountCreationType,
              accountName,
              selectedAccount.name!,
              selectedAccount.keys.active!,
              AccountCreationUtils.generateAccountAuthorities(generatedKeys),
              price,
              generatedKeys,
              options,
            );
            if (result && (result as Account).keys) {
              SimpleToast.show(
                translate(
                  'components.create_account.create_account_successful',
                ),
              );
              addAccount(
                (result as Account).name,
                (result as Account).keys,
                true,
                false,
              );
              resetStackAndNavigate('WALLET');
            } else {
              if (!isMultisig)
                SimpleToast.show(
                  translate('components.create_account.create_account_failed'),
                );
            }
          };
          if (Object.entries(twoFABots).length > 0) {
            navigate('ModalScreen', {
              name: `2FA`,
              modalContent: (
                <TwoFaModal twoFABots={twoFABots} onSubmit={handleSubmit} />
              ),
            });
          } else {
            await handleSubmit({
              multisig: isMultisig,
              fromWallet: true,
            });
          }
        } else {
          const encodedDataAsString = Buffer.from(
            JSON.stringify({
              n: accountName,
              o: generatedKeys.owner.public,
              a: generatedKeys.active.public,
              p: generatedKeys.posting.public,
              m: generatedKeys.memo.public,
            }),
          ).toString('base64');
          const fullData = 'keychain://create_account=' + encodedDataAsString;
          setQrData(fullData);
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

  const renderButton = () =>
    creationType === AccountCreationType.PEER_TO_PEER ? (
      <EllipticButton
        title={translate('common.generate_qr')}
        onPress={createAccount}
        isWarningButton
        additionalTextStyle={[
          styles.buttonText,
          styles.dynamicTextSize,
          styles.whiteText,
        ]}
        style={styles.button}
      />
    ) : (
      <ActiveOperationButton
        isLoading={loading}
        style={[styles.button, getButtonStyle(theme).warningStyleButton]}
        onPress={createAccount}
        title={translate('components.create_account.create_account')}
        additionalTextStyle={[
          styles.buttonText,
          styles.dynamicTextSize,
          styles.whiteText,
        ]}
      />
    );

  const handleLoadNewAccount = () => {
    addAccount(
      accountName,
      {
        posting: generatedKeys.posting.private,
        postingPubkey: generatedKeys.posting.public,
        active: generatedKeys.active.private,
        activePubkey: generatedKeys.active.public,
        memo: generatedKeys.memo.private,
        memoPubkey: generatedKeys.memo.public,
      },
      true,
      false,
    );
    showModal(
      'wallet.operations.create_account.peer_to_peer.account_sucessfully_created',
      MessageModalType.SUCCESS,
      {
        accountName,
      },
    );
    navigate('WALLET');
  };

  useEffect(() => {
    if (qrData) {
      const interval = setInterval(async () => {
        if (await AccountUtils.doesAccountExist(accountName)) {
          handleLoadNewAccount();
          return;
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [qrData]);

  return (
    <Background theme={theme}>
      <View style={styles.containerQrPage}>
        <FocusAwareStatusBar />
        {creationType === AccountCreationType.PEER_TO_PEER && qrData ? (
          <View style={styles.qrContainer}>
            <View style={{paddingHorizontal: 18, marginBottom: 8}}>
              <Caption text="components.create_account.peer_to_peer_waiting_text" />
            </View>
            <View style={styles.qrCodeImg}>
              <QRCode
                size={240}
                style={{backgroundColor: 'white'}}
                value={qrData}
              />
            </View>
          </View>
        ) : (
          <>
            {keysTextVersion.length > 0 && !loadingMasterKey && (
              <View style={styles.container}>
                <ScrollView style={styles.keysContainer}>
                  {renderKeys()}
                </ScrollView>
                <View style={[styles.checkboxesContainer]}>
                  {creationType !== AccountCreationType.PEER_TO_PEER && (
                    <CheckBoxPanel
                      checked={paymentUnderstanding}
                      onPress={() =>
                        setPaymentUnderstanding(!paymentUnderstanding)
                      }
                      title={getPaymentCheckboxLabel()}
                      skipTranslation
                      smallText
                      containerStyle={styles.checkboxContainer}
                    />
                  )}
                  <CheckBoxPanel
                    checked={safelyCopied}
                    onPress={() => setSafelyCopied(!safelyCopied)}
                    title="components.create_account.safely_copied_keys"
                    smallText
                    containerStyle={styles.checkboxContainer}
                  />
                  <CheckBoxPanel
                    checked={notPrimaryStorageUnderstanding}
                    onPress={() =>
                      setNotPrimaryStorageUnderstanding(
                        !notPrimaryStorageUnderstanding,
                      )
                    }
                    title="components.create_account.storage_understanding"
                    smallText
                    containerStyle={styles.checkboxContainer}
                  />
                </View>
                <View style={[styles.buttonsContainer, styles.spacing]}>
                  <OperationButton
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          theme === Theme.DARK
                            ? getColors(theme).cardBgColor
                            : 'white',
                      },
                    ]}
                    title={translate('components.create_account.copy')}
                    onPress={() => copyAllKeys()}
                    additionalTextStyle={[
                      styles.buttonText,
                      styles.dynamicTextSize,
                      styles.copyButtonText,
                    ]}
                  />
                  {renderButton()}
                </View>
              </View>
            )}
            {loadingMasterKey && (
              <View style={styles.loadingContainer}>
                <Loader animating size={'small'} />
              </View>
            )}
          </>
        )}
      </View>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    checkboxContainer: {
      paddingVertical: 0,
      height: 60,
      flexGrow: 1,
    },
    containerQrPage: {
      display: 'flex',
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    container: {
      marginHorizontal: 16,
      flex: 1,
      justifyContent: 'space-between',
    },
    qrCodeImg: {
      backgroundColor: 'white',
      width: 'auto',
      height: 'auto',
      padding: 30,
      borderRadius: 12,
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
      maxHeight:
        height * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.3 : 0.5),
      flexGrow: 1,
      overflow: 'hidden',
      marginTop: 20,
    },
    checkboxesContainer: {
      marginTop: 16,
      flexGrow: 1,
      justifyContent: 'center',
    },
    whiteText: {
      color: 'white',
    },
    spacing: {
      marginTop: 20,
      paddingBottom: 10,
    },
    checkbox: {
      backgroundColor: getColors(theme).cardBgColor,
      width: '100%',
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
      fontSize: getFontSizeSmallDevices(width, body_primary_body_2.fontSize),
    },
    text: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    dynamicTextSize: {
      fontSize: getFontSizeSmallDevices(
        width,
        button_link_primary_small.fontSize,
      ),
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
      ...title_primary_body_2,
      color: 'white',
    },
    copyButtonText: {
      color: theme === Theme.LIGHT ? 'black' : 'white',
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
    qrContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {addAccount, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StepTwo);
