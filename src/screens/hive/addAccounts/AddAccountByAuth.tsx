import {addAccount} from 'actions/index';
import {showModal} from 'actions/message';
import TitleLogoLight from 'assets/new_UI/img_import_dark.svg';
import TitleLogoDark from 'assets/new_UI/img_import_light.svg';
import Button from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import CustomIconButton from 'components/ui/CustomIconButton';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {
  AddAccFromWalletNavigation,
  AddAccFromWalletNavigationProps,
} from 'navigators/mainDrawerStacks/AddAccount.types';
import {AddAccNavigationProps} from 'navigators/Signup.types';
import React, {useContext, useState} from 'react';
import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Text} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

const AddAccountByAuth = ({
  addAccount,
  localAccounts,
  navigation,
  route,
  showModal,
}: PropsFromRedux &
  (AddAccNavigationProps | AddAccFromWalletNavigationProps)) => {
  const [account, setAccount] = useState('');
  const [authorizedAccount, setAuthorizedAccount] = useState('');

  useLockedPortrait(navigation);

  const onImportKeysByAuth = async () => {
    try {
      const keys = await AccountUtils.addAuthorizedAccount(
        account,
        authorizedAccount,
        localAccounts,
      );
      if (keys) {
        const wallet = route.params ? route.params.wallet : false;
        addAccount(account, keys, wallet, false);
        showModal(true, translate('common.added_account'));
      } else {
        showModal(true, translate('toast.error_add_account'), true);
      }
    } catch (e) {
      showModal(true, (e as any).message || e, true);
    }
  };

  const {theme} = useContext(ThemeContext);
  const {height} = useWindowDimensions();
  const styles = getStyles(theme);

  return (
    <Background using_new_ui theme={theme}>
      <>
        <StatusBar
          barStyle={getColors(theme).barStyle}
          backgroundColor={getColors(theme).primaryBackground}
        />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Separator height={30} />
            <CustomIconButton
              lightThemeIcon={<TitleLogoLight />}
              darkThemeIcon={<TitleLogoDark />}
              onPress={() => {}}
              theme={theme}
            />
            <Separator height={height / 15} />
            <Text style={[styles.text, styles.opacity, styles.centeredText]}>
              {capitalizeSentence(translate('addAccountByAuth.text'))}
            </Text>
            <Separator height={height / 15} />
            <OperationInput
              labelInput={translate('common.username')}
              placeholder={translate('common.username')}
              value={account}
              onChangeText={setAccount}
              inputStyle={[styles.text, styles.smallerText]}
            />
            <Separator height={height / 15} />
            <OperationInput
              labelInput={translate('common.authorized_username')}
              placeholder={translate('common.authorized_username')}
              value={authorizedAccount}
              onChangeText={setAuthorizedAccount}
              inputStyle={[styles.text, styles.smallerText]}
              rightIcon={
                <Icon
                  name="scanner"
                  theme={theme}
                  onClick={() => {
                    (navigation as AddAccFromWalletNavigation).navigate(
                      'ScanQRScreen',
                      {wallet: true},
                    );
                  }}
                />
              }
            />
          </View>
          <View style={styles.bottomContainer}>
            <Button
              title={translate('common.import').toUpperCase()}
              onPress={onImportKeysByAuth}
              style={[getButtonStyle(theme).warningStyleButton]}
              additionalTextStyle={{...button_link_primary_medium}}
            />
          </View>
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {alignItems: 'center', justifyContent: 'space-between', flex: 1},
    topContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    text: {color: getColors(theme).secondaryText, ...body_primary_body_1},
    opacity: {
      opacity: 0.7,
    },
    centeredText: {textAlign: 'center'},
    bottomContainer: {
      marginBottom: 15,
      width: '100%',
      alignItems: 'center',
    },
    smallerText: {
      fontSize: 13,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {addAccount, showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByAuth);
