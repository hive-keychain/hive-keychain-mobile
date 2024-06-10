import {Account} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {
  AccountCreationType,
  AccountCreationUtils,
} from 'utils/account-creation.utils';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import StepTwoAccountCreation from '../createAccounts/CreateAccountConfirmation';

const CreateAccountPeerToPeer = ({user}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);
  const [accountName, setAccountName] = useState('');
  const [isAvailableAccountName, setIsAvailableAccountName] = useState(false);

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

  //TODO move to a util bellow?
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
      navigate('TemplateStackScreen', {
        titleScreen: translate('navigation.create_account'),
        component: (
          <StepTwoAccountCreation
            selectedAccount={{} as Account}
            accountName={accountName}
            creationType={AccountCreationType.PEER_TO_PEER}
            price={0}
          />
        ),
        hideCloseButton: true,
      } as TemplateStackProps);
    }
  };

  return (
    <Background theme={theme} containerStyle={styles.container}>
      <View style={styles.content}>
        <OperationInput
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
            ) : (
              <Icon name={Icons.CLOSE_CIRCLE} theme={theme} />
            )
          }
          additionalInputContainerStyle={styles.input}
        />
        <View style={styles.buttonContainer}>
          <EllipticButton
            title={translate('common.next')}
            onPress={goToNextPage}
            isWarningButton
            additionalTextStyle={{...button_link_primary_medium}}
          />
        </View>
      </View>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 16,
    },
    content: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
    },
    input: {
      width: '100%',
    },
    buttonContainer: {
      marginVertical: 25,
      width: '100%',
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountPeerToPeer);
