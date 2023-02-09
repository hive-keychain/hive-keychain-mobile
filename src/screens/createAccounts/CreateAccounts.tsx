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
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {getAccountPrice} from 'utils/hiveUtils';

interface SelectOption {
  label: string;
  value: string;
}

const CreateAccounts = ({
  user,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: GovernanceNavigation}) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>();
  const [price, setPrice] = useState(3);
  const [accountName, setAccountName] = useState('');

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
    // setSelectedAccount({
    //   label: `@${user.name!}`,
    //   value: user.name!,
    // });
    setSelectedAccount(user.name!);
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
      setErrorMessage('html_popup_create_account_username_too_short');
      return false;
    }
    if (!AccountCreationUtils.validateUsername(accountName)) {
      setErrorMessage('html_popup_create_account_account_name_not_valid');
      return false;
    }
    if (await AccountCreationUtils.checkAccountNameAvailable(accountName)) {
      return true;
    } else {
      setErrorMessage('html_popup_create_account_username_already_used');
      return false;
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
          onPress={() => {}}
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

export default connector(CreateAccounts);
