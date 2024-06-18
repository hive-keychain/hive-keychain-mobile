import {Asset} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import {showModal} from 'actions/message';
import OperationButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import {ConfirmationPageProps} from 'components/operations/Confirmation';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import OptionsToggle from 'components/ui/OptionsToggle';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import {KeychainKeyTypes} from 'hive-keychain-commons';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {TemplateStackProps} from 'navigators/Root.types';
import {CreateAccountFromWalletNavigationProps} from 'navigators/mainDrawerStacks/CreateAccount.types';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  default as SimpleToast,
  default as Toast,
} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {CreateDataAccountOnBoarding} from 'src/interfaces/create-accounts.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {
  FontPoppinsName,
  body_primary_body_1,
  button_link_primary_medium,
  getFormFontStyle,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
  GeneratedKey,
} from 'utils/account-creation.utils';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {capitalize, fromHP, getCleanAmountValue, toHP} from 'utils/format';
import {delegate, getCurrency} from 'utils/hive';
import {
  getAccountPrice,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';
import StepTwo from './CreateAccountConfirmation';

interface SelectOption {
  label: string;
  value: string;
  icon: JSX.Element;
}

const CreateAccountStepOne = ({
  user,
  navigation,
  route,
  accounts,
  properties,
  showModal,
}: PropsFromRedux & CreateAccountFromWalletNavigationProps) => {
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>();
  const [price, setPrice] = useState(3);
  const [accountName, setAccountName] = useState('');
  const [creationType, setCreationType] = useState<AccountCreationType>();
  const [isAvailableAccountName, setIsAvailableAccountName] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [onBoardingUserData, setOnBoardingUserData] = useState<
    CreateDataAccountOnBoarding
  >();
  const [onBoardingDelegations, setOnBoardingDelegations] = useState<{
    hpAmount: string;
    rcAmount: string;
  }>({hpAmount: '0', rcAmount: '0'});
  const [delegateHP, setDelegateHP] = useState(false);
  const [delegateRC, setDelegateRC] = useState(false);
  const [availableHP, setAvailableHP] = useState('0');
  const [availableGRC, setAvailableGRC] = useState('0');

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);

  useLockedPortrait(navigation);

  useEffect(() => {
    const {params} = route;
    if (params && params.newPeerToPeerData) {
      const {name, publicKeys} = params.newPeerToPeerData;
      setAccountName(name);
      setOnBoardingUserData({name, publicKeys});
      const totalHp = toHP(
        user.account.vesting_shares as string,
        properties.globals,
      );
      const totalOutgoing = toHP(
        user.account.delegated_vesting_shares as string,
        properties.globals,
      );
      const tempAvailableHP = Math.max(totalHp - totalOutgoing - 5, 0).toFixed(
        3,
      );
      const tempAvailableGRC = (user.rc.max_rc * user.rc.percentage) / 100;
      setAvailableGRC(RcDelegationsUtils.rcToGigaRc(tempAvailableGRC));
      setAvailableHP(tempAvailableHP);
    }
    initPrice();
  }, []);

  const initPrice = async () => {
    setPrice(await getAccountPrice());
  };

  useEffect(() => {
    initAccountOptions();
  }, [accounts]);

  useEffect(() => {
    setLoadingData(true);
    onSelectedAccountChange(user.name);
  }, [user.name]);

  useEffect(() => {
    if (accountName.trim().length > 3) {
      checkAccountName();
    }
  }, [accountName]);

  const checkAccountName = async () => {
    const isAvailable = await AccountCreationUtils.checkAccountNameAvailable(
      accountName,
    );
    setIsAvailableAccountName(isAvailable);
  };

  const onSelectedAccountChange = async (username: string) => {
    const account = (await AccountUtils.getAccount(username)) as any;
    if (
      account[0] &&
      account[0].pending_claimed_accounts &&
      account[0].pending_claimed_accounts > 0
    ) {
      setPrice(0);
      setCreationType(AccountCreationType.USING_TICKET);
    } else {
      setPrice(3);
      setCreationType(AccountCreationType.BUYING);
    }
    setLoadingData(false);
  };

  const initAccountOptions = async () => {
    const options = [];
    for (const account of accounts as Account[]) {
      options.push({
        label: `${account.name!}`,
        value: account.name!,
        icon: (
          <UserProfilePicture
            style={styles.profilePicture}
            username={account.name!}
          />
        ),
      });
    }
    setAccountOptions(options);
  };

  const getPriceLabel = () => {
    switch (creationType) {
      case AccountCreationType.BUYING:
        return `${price} HIVE`;
      case AccountCreationType.USING_TICKET:
        return translate('components.create_account.create_account_ticket', {
          tickets: 1,
        });
    }
  };

  const validateAccountName = async () => {
    if (accountName.length < 3) {
      Toast.show(translate('toast.username_too_short'));
      return false;
    }
    if (!AccountCreationUtils.validateUsername(accountName)) {
      Toast.show(translate('toast.account_name_not_valid'));
      return false;
    }
    if (await AccountCreationUtils.checkAccountNameAvailable(accountName)) {
      return true;
    } else {
      Toast.show(translate('toast.account_username_already_used'));
      return false;
    }
  };

  const onConfirm = async () => {
    if (!user.keys.active) {
      SimpleToast.show(
        translate('common.missing_key', {key: KeychainKeyTypes.active}),
        SimpleToast.LONG,
      );
      return;
    }
    if (+onBoardingDelegations.rcAmount > 0) {
      if (!user.keys.posting) {
        SimpleToast.show(
          translate('common.missing_key', {key: KeychainKeyTypes.posting}),
          SimpleToast.LONG,
        );
        return;
      }
    }
    const result = await AccountCreationUtils.createAccount(
      creationType as AccountCreationType,
      onBoardingUserData.name,
      user.name!,
      user.keys.active!,
      AccountCreationUtils.generateAccountAuthorities({
        owner: {public: onBoardingUserData.publicKeys.owner} as GeneratedKey,
        active: {public: onBoardingUserData.publicKeys.active} as GeneratedKey,
        posting: {
          public: onBoardingUserData.publicKeys.posting,
        } as GeneratedKey,
        memo: {public: onBoardingUserData.publicKeys.memo} as GeneratedKey,
      }),
      price,
    );
    if (result) {
      if (await AccountUtils.doesAccountExist(onBoardingUserData.name)) {
        let delegationFlag = false;
        if (+onBoardingDelegations.hpAmount > 0) {
          delegationFlag = true;
          const hpDelegationResult = await delegate(user.keys.active, {
            vesting_shares: sanitizeAmount(
              fromHP(
                sanitizeAmount(onBoardingDelegations.hpAmount),
                properties.globals,
              ).toString(),
              'VESTS',
              6,
            ),
            delegatee: sanitizeUsername(onBoardingUserData.name),
            delegator: user.account.name,
          });
        }
        if (+onBoardingDelegations.rcAmount > 0) {
          delegationFlag = true;
          const rcDelegationResult = await RcDelegationsUtils.sendDelegation(
            RcDelegationsUtils.gigaRcToRc(
              parseFloat(onBoardingDelegations.rcAmount),
            ),
            onBoardingUserData.name,
            user.name!,
            user.keys.posting!,
          );
        }
        const successKey = delegationFlag
          ? 'components.create_account.create_account_on_boarding_with_delegations_successful'
          : 'components.create_account.create_account_on_boarding_successful';
        showModal(successKey, MessageModalType.SUCCESS, {
          accountName: onBoardingUserData.name,
        });
      }
    } else {
      SimpleToast.show(
        translate('components.create_account.create_account_failed'),
      );
    }
    return;
  };

  const reduceStringKey = (pubKey: string) => {
    return `${pubKey.slice(0, 6)}...${pubKey.slice(
      pubKey.length - 6,
      pubKey.length,
    )}`;
  };

  const goToNextPage = async () => {
    if (onBoardingUserData) {
      if (
        +onBoardingDelegations.rcAmount >
        +getCleanAmountValue(availableGRC as string)
      ) {
        return Toast.show(
          translate('common.overdraw_balance_error', {
            currency: 'RC',
          }),
        );
      }
      if (+onBoardingDelegations.hpAmount > +getCleanAmountValue(availableHP)) {
        return Toast.show(
          translate('common.overdraw_balance_error', {
            currency: getCurrency('HP'),
          }),
        );
      }
      const account = user.account;
      const balance = Asset.fromString(account.balance.toString());
      if (
        creationType === AccountCreationType.USING_TICKET ||
        (creationType === AccountCreationType.BUYING && balance.amount >= 3)
      ) {
        const confirmationData: ConfirmationPageProps = {
          title: 'wallet.operations.create_account.peer_to_peer.info',
          onSend: () => {},
          skipWarningTranslation: true,
          data: [
            {
              title:
                'wallet.operations.create_account.peer_to_peer.account_creator',
              value: `@${user.name!}`,
            },
            {
              title: 'intro.createAccount',
              value: `@${onBoardingUserData.name}`,
            },
            {
              title:
                'wallet.operations.create_account.peer_to_peer.creation_method',
              value: creationType,
            },
            {
              title: `keys.owner`,
              value: `${reduceStringKey(onBoardingUserData.publicKeys.owner)}`,
            },
            {
              title: `keys.active`,
              value: `${reduceStringKey(onBoardingUserData.publicKeys.active)}`,
            },
            {
              title: `keys.posting`,
              value: `${reduceStringKey(
                onBoardingUserData.publicKeys.posting,
              )}`,
            },
            {
              title: `keys.memo`,
              value: `${reduceStringKey(onBoardingUserData.publicKeys.memo)}`,
            },
          ],
          onConfirm: onConfirm,
        };
        if (+onBoardingDelegations.hpAmount > 0) {
          confirmationData.data.push({
            title:
              'wallet.operations.create_account.peer_to_peer.delegating_title',
            value: translate(
              'wallet.operations.create_account.peer_to_peer.delegating_amount',
              {
                amount: onBoardingDelegations.hpAmount,
                currency: getCurrency('HP'),
              },
            ),
          });
        }
        if (+onBoardingDelegations.rcAmount > 0) {
          confirmationData.data.push({
            title:
              'wallet.operations.create_account.peer_to_peer.delegating_title',
            value: translate(
              'wallet.operations.create_account.peer_to_peer.delegating_amount',
              {amount: onBoardingDelegations.rcAmount, currency: 'GRC'},
            ),
          });
        }
        navigate('Operation', {
          screen: 'ConfirmationPage',
          params: confirmationData,
        });
      } else {
        Toast.show(translate('toast.account_creation_not_enough_found'));
      }
    } else {
      if (await validateAccountName()) {
        const account = user.account;
        const balance = Asset.fromString(account.balance.toString());
        if (
          creationType === AccountCreationType.USING_TICKET ||
          (creationType === AccountCreationType.BUYING && balance.amount >= 3)
        ) {
          const usedAccount = accounts.find(
            (localAccount: Account) => localAccount.name === user.name,
          );
          navigate('TemplateStack', {
            titleScreen: translate('navigation.create_account'),
            component: (
              <StepTwo
                selectedAccount={usedAccount}
                accountName={accountName}
                creationType={creationType}
                price={price}
              />
            ),
          } as TemplateStackProps);
        } else {
          Toast.show(translate('toast.account_creation_not_enough_found'));
        }
      }
    }
  };

  const renderCustomPanel = (
    caption: string,
    delegating: 'hpAmount' | 'rcAmount',
    currency: 'HP' | 'GRC',
    available: string,
  ) => {
    //TODO add tr to caption if accepted
    const value =
      delegating === 'hpAmount'
        ? onBoardingDelegations.hpAmount
        : onBoardingDelegations.rcAmount;

    const handleSetAmount = (textValue: string) => {
      setOnBoardingDelegations({
        ...onBoardingDelegations,
        [delegating]: textValue,
      });
    };

    return (
      <View>
        <Text style={[styles.text, styles.paddingHorizontal]}>{caption}</Text>
        <Text
          style={[
            styles.text,
            styles.paddingHorizontal,
            styles.textMarginTop,
          ]}>{`${translate(
          'common.available',
        )} ${currency}: ${available}`}</Text>
        <View style={[styles.flexRowBetween, styles.textMarginTop]}>
          <OperationInput
            labelInput={translate('common.currency')}
            placeholder={currency}
            value={currency}
            editable={false}
            additionalOuterContainerStyle={{
              width: '40%',
            }}
          />
          <OperationInput
            labelInput={capitalize(translate('common.amount'))}
            placeholder={'0'}
            keyboardType="decimal-pad"
            textAlign="right"
            value={value}
            onChangeText={handleSetAmount}
            additionalOuterContainerStyle={{
              width: '54%',
            }}
            rightIcon={
              <View style={styles.flexRowCenter}>
                <Separator
                  drawLine
                  additionalLineStyle={getHorizontalLineStyle(theme, 1, 35, 16)}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    handleSetAmount(getCleanAmountValue(available))
                  }>
                  <Text
                    style={[
                      getFormFontStyle(height, theme, PRIMARY_RED_COLOR).input,
                    ]}>
                    {translate('common.max').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    );
  };

  return (
    <Background theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        <FocusAwareStatusBar />
        <View style={styles.content}>
          {user.name && accountOptions && (
            <>
              <UserDropdown />
            </>
          )}
          <Separator height={15} />
          {user.name && accountOptions && !loadingData && (
            <Text style={[styles.text, styles.centeredText, styles.opacity]}>
              {translate('components.create_account.cost', {
                price: getPriceLabel(),
                account: user.name,
              })}
            </Text>
          )}
          {loadingData && (
            <View style={styles.flexCentered}>
              <Loader animating size={'small'} />
            </View>
          )}
          <Separator height={25} />
          <OperationInput
            disabled={!!onBoardingUserData}
            labelInput={translate('common.username')}
            placeholder={translate(
              'components.create_account.new_account_username',
            )}
            value={accountName}
            onChangeText={setAccountName}
            leftIcon={<Icon name={Icons.AT} theme={theme} />}
            rightIcon={
              isAvailableAccountName ? (
                <Icon name={Icons.CHECK} theme={theme} />
              ) : null
            }
          />
          {!loadingData && onBoardingUserData && (
            <View style={styles.marginVertical}>
              <Text
                style={[styles.text, styles.paddingHorizontal, styles.opacity]}>
                {translate(
                  'components.create_account.create_account_onboarding_message',
                  {name: onBoardingUserData.name},
                )}
              </Text>
              <OptionsToggle
                theme={theme}
                title={`${translate('common.delegate')} ${getCurrency('HP')}`}
                toggled={delegateHP}
                additionalTitleStyle={getFormFontStyle(height, theme).title}
                callback={(toggled) => {
                  setDelegateHP(toggled);
                }}>
                {renderCustomPanel(
                  'You may delegate HP for this new user.',
                  'hpAmount',
                  'HP',
                  availableHP,
                )}
              </OptionsToggle>
              <OptionsToggle
                theme={theme}
                title={`${translate('common.delegate')} RC`}
                toggled={delegateRC}
                additionalTitleStyle={getFormFontStyle(height, theme).title}
                callback={(toggled) => {
                  setDelegateRC(toggled);
                }}>
                {renderCustomPanel(
                  'You may delegate RC for this new user.',
                  'rcAmount',
                  'GRC',
                  availableGRC,
                )}
              </OptionsToggle>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <OperationButton
            title={translate('common.next')}
            onPress={() => goToNextPage()}
            isWarningButton
            additionalTextStyle={{...button_link_primary_medium}}
          />
        </View>
      </ScrollView>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      flexGrow: 1,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      height: 'auto',
      marginTop: 30,
    },
    button: {
      width: '100%',
      height: height * 0.08,
    },
    buttonContainer: {
      marginBottom: 25,
      width: '100%',
      height: 'auto',
    },
    text: {color: getColors(theme).secondaryText, ...body_primary_body_1},
    centeredText: {textAlign: 'center'},
    additionalPickerStyle: {
      color: getColors(theme).secondaryText,
      fontFamily: FontPoppinsName.ITALIC,
    },
    marginVertical: {
      marginVertical: height / 30,
    },
    uniqueFontSize: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    opacity: {
      opacity: 0.7,
    },
    smallerText: {
      fontSize: 13,
    },
    profilePicture: {
      width: 30,
      height: 30,
      borderRadius: 50,
    },
    flexCentered: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    dropdown: {
      width: '100%',
    },
    paddingHorizontal: {
      paddingHorizontal: MARGIN_PADDING,
    },
    icon: {
      width: 18,
      height: 18,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textMarginTop: {
      marginTop: 8,
    },
  });

const connector = connect(
  (state: RootState) => ({
    user: state.activeAccount,
    accounts: state.accounts,
    properties: state.properties,
  }),
  {
    showModal,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepOne);
