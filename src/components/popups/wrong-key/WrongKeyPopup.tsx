import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadAccount} from 'actions/index';
import {Account} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {KeyUtils} from 'utils/key.utils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';

export interface WrongKeysOnUser {
  [key: string]: string[];
}
interface Props {}

const WrongKeyPopup = ({
  loadAccount,
  accounts,
}: Props & PropsFromRedux): null => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const [displayWrongKeyPopup, setDisplayWrongKeyPopup] = useState<
    WrongKeysOnUser | undefined
  >();
  const accountFound = displayWrongKeyPopup
    ? Object.keys(displayWrongKeyPopup)[0]
    : '';
  const wrongKeysFound = displayWrongKeyPopup
    ? Object.values(displayWrongKeyPopup)[0]
    : [];
  useEffect(() => {
    initCheckKeysOnAccounts(accounts);
  }, [accounts.length]);
  const initCheckKeysOnAccounts = async (localAccounts: Account[]) => {
    try {
      const accountNames = localAccounts.map((acc) => acc.name!);
      const extendedAccountsList = await AccountUtils.getAccounts(accountNames);
      let noKeyCheck: WrongKeysOnUser = JSON.parse(
        await AsyncStorage.getItem(KeychainStorageKeyEnum.NO_KEY_CHECK),
      );
      if (!noKeyCheck) {
        noKeyCheck = {[localAccounts[0].name!]: []};
      }
      for (let i = 0; i < extendedAccountsList.length; i++) {
        const account = localAccounts[i];
        const extendedAccount = extendedAccountsList[i];
        const foundWrongKey = KeyUtils.checkKeysOnAccount(
          account,
          extendedAccount,
          noKeyCheck,
        );

        if (foundWrongKey[account.name!]?.length > 0) {
          setDisplayWrongKeyPopup(foundWrongKey);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (displayWrongKeyPopup) {
      navigate('ModalScreen', {
        name: 'WrongKeyPopup',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
        modalContainerStyle: [
          getModalBaseStyle(theme).roundedTop,
          styles.modal,
        ],
        fixedHeight: 0.4,
      } as ModalScreenProps);
    }
  }, [displayWrongKeyPopup, accountFound]);

  const skipKeyCheckOnAccount = async () => {
    let prevNoKeyCheck = JSON.parse(
      await AsyncStorage.getItem(KeychainStorageKeyEnum.NO_KEY_CHECK),
    );
    if (prevNoKeyCheck) {
      prevNoKeyCheck = {...displayWrongKeyPopup, ...prevNoKeyCheck};
    }
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.NO_KEY_CHECK,
      JSON.stringify(prevNoKeyCheck ?? displayWrongKeyPopup),
    );
    handleClose();
  };

  const loadAccountGotoManage = async () => {
    let actualNoKeyCheck = JSON.parse(
      await AsyncStorage.getItem(KeychainStorageKeyEnum.NO_KEY_CHECK),
    );
    if (actualNoKeyCheck && actualNoKeyCheck[accountFound!]) {
      delete actualNoKeyCheck[accountFound!];
    }
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.NO_KEY_CHECK,
      JSON.stringify(actualNoKeyCheck),
    );
    loadAccount(
      accounts.find((account: Account) => account.name === accountFound!).name!,
    );
    navigate('AccountManagementScreen');
  };

  const handleClose = () => {
    setDisplayWrongKeyPopup(undefined);
    goBack();
  };

  const renderContent = () => {
    return (
      <Operation
        title={translate('popup.wrong_key.title', {
          plural: wrongKeysFound.length > 1 ? 's' : '',
        })}
        additionalHeaderTitleStyle={styles.operationTitle}
        onClose={handleClose}
        additionalContentStyle={styles.operationContentContainer}>
        <View style={[styles.rootContainer]}>
          <Text style={[styles.text]}>
            {translate(
              `popup.wrong_key.intro${
                wrongKeysFound.length > 1 ? '_plural' : ''
              }`,
              {
                account: accountFound,
                keyNames:
                  wrongKeysFound.length > 1
                    ? wrongKeysFound.slice(0, -1).join(', ')
                    : wrongKeysFound[0],
                lastKeyName: wrongKeysFound[wrongKeysFound.length - 1],
              },
            )}
          </Text>
          <Text style={styles.baseText}>
            {translate('popup.vesting_routes.warning_message')}
            <Text
              style={[styles.baseText, styles.highlight]}
              onPress={() => {
                Linking.openURL('https://discord.gg/UpXnBQtJw7');
              }}>
              {translate('common.discord_server')}
            </Text>
            .
          </Text>

          <Separator height={30} />
          <View style={styles.buttonsContainer}>
            <EllipticButton
              title={translate('popup.wrong_key.button_action.do_nothing')}
              onPress={skipKeyCheckOnAccount}
              style={styles.button}
            />
            <EllipticButton
              title={translate('popup.wrong_key.button_action.replace')}
              isWarningButton
              onPress={loadAccountGotoManage}
              style={styles.button}
            />
          </View>
        </View>
      </Operation>
    );
  };
  return null;
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    baseText: {
      color: getColors(theme).secondaryText,
    },
    highlight: {
      color: PRIMARY_RED_COLOR,
    },
    title: {
      textAlign: 'center',
      color: getColors(theme).primaryText,
      fontWeight: 'bold',
      marginBottom: 10,
      fontSize: getFontSizeSmallDevices(width, 16),
    },
    text: {
      fontSize: getFontSizeSmallDevices(width, 14),
      marginBottom: 10,
      color: getColors(theme).primaryText,
    },
    marginTop: {
      marginTop: 18,
    },
    marginVertical: {
      marginVertical: 10,
    },
    button: {
      width: '45%',
      marginHorizontal: 0,
    },
    modal: {
      padding: 16,
      paddingBottom: 0,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignContent: 'center',
      flex: 1,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    operationContentContainer: {flex: 1, justifyContent: 'center'},
    operationTitle: {
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    accounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {loadAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WrongKeyPopup);
