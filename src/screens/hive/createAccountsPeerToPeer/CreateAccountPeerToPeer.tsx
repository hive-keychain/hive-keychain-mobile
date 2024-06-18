import {Account} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
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
        <View style={styles.topContent}>
          <Text style={styles.text}>
            {translate('components.createAccountPeerToPeer.text1')}
          </Text>
          <Text style={styles.text}>
            {translate('components.createAccountPeerToPeer.text2')}
          </Text>
          <Text style={styles.text}>
            {translate('components.createAccountPeerToPeer.text3')}
          </Text>
          <Text style={[styles.text, styles.textBold]}>
            {translate('components.createAccountPeerToPeer.text4')}
          </Text>
          <Text style={styles.text}>
            {translate('components.createAccountPeerToPeer.text5')}
          </Text>
          <View style={styles.inputContainer}>
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
          </View>
        </View>
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
      justifyContent: 'space-between',
      width: '100%',
    },
    input: {
      width: '100%',
    },
    buttonContainer: {
      marginBottom: 20,
      width: '100%',
    },
    topContent: {
      marginTop: 30,
    },
    textBold: {
      fontFamily: FontPoppinsName.BOLD,
    },
    text: {
      color: getColors(theme).secondaryText,
      marginHorizontal: 16,
      ...title_primary_title_1,
      alignSelf: 'stretch',
      opacity: 0.7,
      fontSize: getFontSizeSmallDevices(width, title_primary_title_1.fontSize),
    },
    inputContainer: {
      marginTop: 20,
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountPeerToPeer);
