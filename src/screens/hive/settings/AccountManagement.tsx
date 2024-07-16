import {addKey, forgetAccount, forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import UserDropdown from 'components/form/UserDropdown';
import Key from 'components/hive/Key';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import SlidingOverlay from 'components/ui/SlidingOverlay';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import QRCode from 'react-qr-code';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';

const AccountManagement = ({
  account,
  forgetKey,
  forgetAccount,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: MainNavigation}) => {
  useLockedPortrait(navigation);

  const username = account.name;
  if (!username) return null;

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const [showQrCode, setShowQrCode] = useState(false);
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
    const confirmationData = {
      title: 'common.confirm_key_remove',
      onConfirm: () => {
        forgetKey(username, key);
        goBack();
      },
      data: [
        {
          title: 'common.key',
          value: capitalize(key),
        },
      ],
    };
    navigate('Operation', {
      screen: 'ConfirmationPage',
      params: confirmationData,
    });
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
          />
          <Key
            type={KeyTypes.posting}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={handleGotoConfirmationKeyRemoval}
            navigation={navigation}
            theme={theme}
          />
          <Key
            type={KeyTypes.memo}
            containerStyle={styles.cardKey}
            account={accounts.find((e) => e.name === username)}
            forgetKey={handleGotoConfirmationKeyRemoval}
            navigation={navigation}
            theme={theme}
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
