import {addKey, forgetAccount, forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import UserDropdown from 'components/form/UserDropdown';
import Key from 'components/hive/Key';
import RemoveKey from 'components/modals/RemoveKey';
import {WrongKeysOnUser} from 'components/popups/wrong-key/WrongKeyPopup';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import SlidingOverlay from 'components/ui/SlidingOverlay';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation, ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import QRCode from 'react-qr-code';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {KeyUtils} from 'utils/key.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AccountManagement = ({
  account,
  forgetKey,
  forgetAccount,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: MainNavigation}) => {
  const [wrongKeysFound, setWrongKeysFound] = useState<
    WrongKeysOnUser | undefined
  >();

  useLockedPortrait(navigation);

  const username = account.name;
  if (!username) return null;

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    initCheckKeysOnAccount(account.name);
  }, [account, username]);

  const initCheckKeysOnAccount = async (username: string) => {
    if (username) {
      const selectedLocalAccount = accounts.find(
        (localAccount) => localAccount.name === username,
      );
      const foundWrongKey = KeyUtils.checkKeysOnAccount(
        selectedLocalAccount,
        account.account,
        {[selectedLocalAccount.name]: []},
      );
      if (foundWrongKey[username].length > 0) {
        setWrongKeysFound(foundWrongKey);
      } else {
        setWrongKeysFound(undefined);
      }
    }
  };

  const handleGotoConfirmationAccountRemoval = () => {
    if (username) {
      const confirmationData = {
        title: 'common.confirm_account_remove',
        onConfirm: () => {
          forgetAccount(username);
          setTimeout(() => {
            navigate('WALLET');
          }, 1000);
        },
        data: [
          {
            title: 'common.account',
            value: `@${username}`,
          },
        ],
      };
      navigate('Operation', {
        screen: 'ConfirmationPage',
        params: confirmationData,
      });
    }
  };

  const handleGotoConfirmationKeyRemoval = (
    username: string,
    key: KeyTypes,
  ) => {
    navigation.navigate('ModalScreen', {
      name: 'RemoveKeyModal',
      modalContent: <RemoveKey type={key} name={username} />,
      modalContainerStyle: [
        getModalBaseStyle(theme).roundedTop,
        styles.paddingHorizontal,
      ],
      fixedHeight: 0.4,
    } as ModalScreenProps);
  };

  return (
    <Background theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />
        <ScrollView>
          <UserDropdown copyButtonValue />
          <Separator height={10} />
          <Key
            type={KeyTypes.active}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={handleGotoConfirmationKeyRemoval}
            navigation={navigation}
            theme={theme}
            wrongKeysFound={wrongKeysFound}
          />
          <Key
            type={KeyTypes.posting}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={handleGotoConfirmationKeyRemoval}
            navigation={navigation}
            theme={theme}
            wrongKeysFound={wrongKeysFound}
          />
          <Key
            type={KeyTypes.memo}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={handleGotoConfirmationKeyRemoval}
            navigation={navigation}
            theme={theme}
            wrongKeysFound={wrongKeysFound}
          />
          <Separator height={20} />
          <EllipticButton
            title={translate('settings.keys.show_qr_code')}
            onPress={() => setShowQrCode(true)}
            additionalTextStyle={styles.operationButtonText}
          />
          <Separator />
          <EllipticButton
            title={translate('common.forget_account')}
            isWarningButton
            onPress={handleGotoConfirmationAccountRemoval}
            additionalTextStyle={styles.operationButtonText}
          />
          <Separator height={25} />
        </ScrollView>
        <SlidingOverlay
          setShowOverlay={setShowQrCode}
          showOverlay={showQrCode}
          maxHeightPercent={0.7}
          title="settings.keys.qr.title">
          <ScrollView>
            <Caption text="settings.keys.qr.caption" hideSeparator justify />
            <View style={styles.qrCardContainer}>
              <View style={styles.qrCard}>
                <QRCode
                  size={200}
                  fgColor={getColors(theme).primaryText}
                  bgColor={'transparent'}
                  value={`keychain://add_account=${AccountUtils.generateQRCode(
                    account!,
                  )}`}
                />
              </View>
            </View>
            <Separator />
            <EllipticButton
              title={translate('common.close')}
              isWarningButton
              onPress={() => {
                setShowQrCode(false);
              }}
            />
          </ScrollView>
        </SlidingOverlay>
      </SafeArea>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    safeArea: {paddingHorizontal: 16},
    qrCardContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: -10,
    },
    qrCard: {
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      borderColor: getColors(theme).primaryText,
      borderWidth: 2,
      borderRadius: 16,
    },
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    },
    avatar: {width: 30, height: 30, borderRadius: 50},
    operationButtonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    dropdownContainer: {
      width: '100%',
      padding: 0,
      borderRadius: 20,
      marginBottom: 0,
    },
    dropdownOverlay: {
      paddingHorizontal: MARGIN_PADDING,
    },
    paddingHorizontal: {
      paddingHorizontal: 16,
    },
  });

const mapStateToProps = (state: RootState) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});
const connector = connect(mapStateToProps, {
  forgetAccount,
  addKey,
  forgetKey,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AccountManagement);
