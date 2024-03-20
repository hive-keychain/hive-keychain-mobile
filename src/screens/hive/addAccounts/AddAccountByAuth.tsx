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
import React, {useState} from 'react';
import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Text} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
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
        showModal('common.added_account', MessageModalType.SUCCESS);
      } else {
        showModal('toast.error_add_account', MessageModalType.ERROR);
      }
    } catch (e) {
      showModal(
        (e as any).message || JSON.stringify(e),
        MessageModalType.ERROR,
        undefined,
        true,
      );
    }
  };

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});

  return (
    <Background theme={theme}>
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
              {translate('addAccountByAuth.text')}
            </Text>
            <Separator height={height / 15} />
            <OperationInput
              labelInput={translate('common.username')}
              placeholder={translate('common.username')}
              value={account}
              onChangeText={setAccount}
            />
            <Separator height={height / 15} />
            <OperationInput
              labelInput={translate('common.authorized_username')}
              placeholder={translate('common.authorized_username')}
              value={authorizedAccount}
              onChangeText={setAuthorizedAccount}
              rightIcon={
                <Icon
                  name={Icons.SCANNER}
                  theme={theme}
                  onPress={() => {
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
              title={translate('common.import')}
              onPress={onImportKeysByAuth}
              style={[getButtonStyle(theme, height).warningStyleButton]}
              additionalTextStyle={styles.buttonText}
            />
          </View>
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {alignItems: 'center', justifyContent: 'space-between', flex: 1},
    topContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_1}.fontSize,
      ),
    },
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
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
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
