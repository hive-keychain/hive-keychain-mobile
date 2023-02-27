import {Account} from 'actions/interfaces';
import CustomInput from 'components/form/CustomInput';
import CustomPicker from 'components/form/CustomPicker';
import OperationButton from 'components/form/EllipticButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {GovernanceNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
} from 'utils/account-creation.utils';
import AccountUtils from 'utils/account.utils';
import {Width} from 'utils/common.types';
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

  const styles = getDimensionedStyles(useWindowDimensions());

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
    setSelectedAccount(user.name!);
    //TODO same code to later on stablish CreationType
    //for now just by buying.
    setCreationType(AccountCreationType.BUYING);
  }, [user]);

  const initAccountOptions = async () => {
    const options = [];
    for (const account of accounts as Account[]) {
      options.push({
        label: `@${account.name!}`,
        value: account.name!,
      });
    }
    setAccountOptions(options);
  };

  const onSelected = (value: any) => {
    setSelectedAccount(value);
  };

  const getPriceLabel = () => {
    // switch (creationType) {
    //   case AccountCreationType.BUYING:
    //TODO get from locales
    return `${price} HIVE`;
    //   case AccountCreationType.USING_TICKET:
    //     return chrome.i18n.getMessage('html_popup_ticket', ['1']);
    // }
  };

  const validateAccountName = async () => {
    //TODO add bellow to locales or find them
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
    console.log({validateAccountName: await validateAccountName()});
    if (await validateAccountName()) {
      const account = await AccountUtils.getAccount(selectedAccount);
      const balance = parseFloat(account[0].balance.split(' ')[0]);
      console.log({balance}); //TODO to remove
      if (
        creationType === AccountCreationType.USING_TICKET ||
        (creationType === AccountCreationType.BUYING && balance >= 3)
      ) {
        console.log('It will go to page 2!'); //TODO to remove
        //TODO add proper types????
        navigate('CreateAccountFromWalletScreenPageTwo', {
          usedAccount: accounts.find(
            (localAccount: any) => localAccount.name === selectedAccount,
          ),
          newUsername: accountName,
          creationType: creationType,
          price: price,
        });
        // navigateToWithParams(Screen.CREATE_ACCOUNT_PAGE_STEP_TWO, {
        //   usedAccount: accounts.find(
        //     (localAccount: LocalAccount) =>
        //       localAccount.name === selectedAccount?.value,
        //   ),
        //   newUsername: accountName,
        //   creationType: creationType,
        //   price: price,
        // });
      } else {
        Toast.show(translate('toast.account_creation_not_enough_found'));
      }
    }
  };

  return (
    <WalletPage>
      <>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
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
        {selectedAccount.length > 0 && accountOptions && (
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
          onPress={() => goToNextPage()}
        />
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
    user: state.activeAccount,
    accounts: state.accounts,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountStepOne);
