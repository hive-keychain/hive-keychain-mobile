import {Asset} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import DropdownModal from 'components/form/DropdownModal';
import OperationButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {MARGINPADDING} from 'src/styles/spacing';
import {
  FontPoppinsName,
  body_primary_body_1,
  button_link_primary_medium,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
} from 'utils/account-creation.utils';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {getAccountPrice} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import StepTwo from '../create-account-step-two/StepTwo';

interface SelectOption {
  label: string;
  value: string;
  icon: JSX.Element;
}

const CreateAccountStepOne = ({
  user,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: GovernanceNavigation}) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>();
  const [price, setPrice] = useState(3);
  const [accountName, setAccountName] = useState('');
  const [creationType, setCreationType] = useState<AccountCreationType>();
  const [isAvailableAccountName, setIsAvailableAccountName] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);

  useLockedPortrait(navigation);

  useEffect(() => {
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
    onSelectedAccountChange(selectedAccount);
  }, [selectedAccount]);

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
    setSelectedAccount(user.name!);
  };

  const onSelected = (value: any) => {
    setSelectedAccount(value);
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

  const goToNextPage = async () => {
    if (await validateAccountName()) {
      const account = await AccountUtils.getAccount(selectedAccount);
      const balance = Asset.fromString(account[0].balance.toString());
      if (
        creationType === AccountCreationType.USING_TICKET ||
        (creationType === AccountCreationType.BUYING && balance.amount >= 3)
      ) {
        const usedAccount = accounts.find(
          (localAccount: Account) => localAccount.name === selectedAccount,
        );
        navigate('TemplateStack', {
          titleScreen: 'Create Account Step 2',
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
  };

  return (
    <Background theme={theme}>
      <>
        <FocusAwareStatusBar />
        <View style={styles.container}>
          <View style={styles.content}>
            {selectedAccount.length > 0 && accountOptions && (
              <>
                <DropdownModal
                  list={accountOptions}
                  selected={accountOptions.find(
                    (item) => item.label === selectedAccount,
                  )}
                  onSelected={(selectedAccount) =>
                    onSelected(selectedAccount.value)
                  }
                  additionalDropdowContainerStyle={styles.dropdown}
                  additionalOverlayStyle={styles.paddingHorizontal}
                  dropdownIconScaledSize={styles.icon}
                />
              </>
            )}
            <Separator height={15} />
            {selectedAccount.length > 0 && accountOptions && !loadingData && (
              <Text style={[styles.text, styles.centeredText, styles.opacity]}>
                {translate('components.create_account.cost', {
                  price: getPriceLabel(),
                  account: selectedAccount,
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
              labelInput={translate('common.username')}
              placeholder={translate(
                'components.create_account.new_account_username',
              )}
              value={accountName}
              onChangeText={setAccountName}
              inputStyle={[styles.text, styles.smallerText]}
              leftIcon={<Icon name={Icons.AT} theme={theme} />}
              rightIcon={
                isAvailableAccountName ? (
                  <Icon name={Icons.CHECK} theme={theme} />
                ) : null
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <OperationButton
              title={translate('common.next')}
              onPress={() => goToNextPage()}
              style={[getButtonStyle(theme).warningStyleButton]}
              additionalTextStyle={{...button_link_primary_medium}}
            />
          </View>
        </View>
      </>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
      width: '100%',
      marginTop: 30,
    },
    button: {
      width: '100%',
      height: height * 0.08,
    },
    buttonContainer: {
      marginBottom: 25,
      width: '100%',
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
    dropdown: {
      width: '100%',
    },
    paddingHorizontal: {
      paddingHorizontal: MARGINPADDING,
    },
    icon: {
      width: 18,
      height: 18,
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
    accounts: state.accounts,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepOne);
