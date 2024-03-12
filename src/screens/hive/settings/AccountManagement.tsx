import {addKey, forgetAccount, forgetKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import UserDropdown from 'components/form/UserDropdown';
import Key from 'components/hive/Key';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

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
        navigate('AccountManagementScreen');
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
          <UserDropdown copyButtonValue remeasure />
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
            style={getButtonStyle(theme).warningStyleButton}
            title={translate('common.forget_account')}
            onPress={handleGotoConfirmationAccountRemoval}
            additionalTextStyle={styles.operationButtonText}
          />
          <Separator height={25} />
        </ScrollView>
      </SafeArea>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    safeArea: {paddingHorizontal: 16},
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
