import {Asset} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import UserLogo from 'assets/addAccount/icon_username.svg';
import CustomInput from 'components/form/CustomInput';
import CustomPicker from 'components/form/CustomPicker';
import OperationButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
} from 'utils/account-creation.utils';
import AccountUtils from 'utils/account.utils';
import {Height} from 'utils/common.types';
import {getCurrency} from 'utils/hive';
import {getAccountPrice} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

interface SelectOption {
  label: string;
  value: string;
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

  const [focus, setFocus] = useState(Math.random());

  const styles = getDimensionedStyles({...useWindowDimensions()});

  useLockedPortrait(navigation);

  useEffect(() => {
    initPrice();
  }, []);

  const initPrice = async () => {
    setPrice(await getAccountPrice());
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocus(Math.random());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    initAccountOptions();
  }, [accounts]);

  useEffect(() => {
    onSelectedAccountChange(selectedAccount);
  }, [selectedAccount]);

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
  };

  const initAccountOptions = async () => {
    const options = [];
    for (const account of accounts as Account[]) {
      options.push({
        label: `@${account.name!}`,
        value: account.name!,
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
        navigate('CreateAccountFromWalletScreenPageTwo', {
          usedAccount: accounts.find(
            (localAccount: Account) => localAccount.name === selectedAccount,
          ),
          newUsername: accountName,
          creationType: creationType,
          price: price,
        });
      } else {
        Toast.show(translate('toast.account_creation_not_enough_found'));
      }
    }
  };

  return (
    <Background>
      <>
        <StatusBar backgroundColor="black" />
        <View style={styles.container}>
          <Text style={[styles.text, styles.marginText]}>
            {translate('components.create_account.disclaimer', {
              amount: '3',
              currency: getCurrency('HIVE'),
            })}
          </Text>
          <Text style={styles.text}>Created by @</Text>
          {selectedAccount.length > 0 && accountOptions && (
            <CustomPicker
              list={accountOptions.map((account) => account.value)}
              prefix={'@'}
              selectedValue={selectedAccount}
              onSelected={onSelected}
              prompt={translate('components.picker.prompt_user')}
              style={styles.text}
              dropdownIconColor="white"
            />
          )}
          <Text style={[styles.text, styles.biggerFontSize, styles.marginText]}>
            {translate('components.create_account.cost')}: {getPriceLabel()}
          </Text>
          <CustomInput
            autoCapitalize="none"
            placeholder={translate(
              'components.create_account.new_account_username',
            )}
            leftIcon={<UserLogo />}
            value={accountName}
            onChangeText={setAccountName}
          />
          <OperationButton
            style={styles.button}
            title={translate('common.next')}
            onPress={() => goToNextPage()}
          />
        </View>
      </>
    </Background>
  );
};

const getDimensionedStyles = ({height}: Height) =>
  StyleSheet.create({
    container: {
      height: height,
    },
    toggle: {
      display: 'flex',
      flexDirection: 'row',
    },
    button: {marginTop: 40},
    marginText: {
      marginTop: 10,
      marginBottom: 10,
    },
    text: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    biggerFontSize: {
      fontSize: 20,
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
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
