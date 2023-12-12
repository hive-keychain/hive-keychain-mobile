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
import {AddAccNavigationProps} from 'navigators/Signup.types';
import {
  AddAccFromWalletNavigation,
  AddAccFromWalletNavigationProps,
} from 'navigators/mainDrawerStacks/AddAccount.types';
import React, {useContext, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import validateNewAccount from 'utils/keyValidation';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AddAccountByKey = ({
  addAccount,
  navigation,
  route,
  showModal,
}: PropsFromRedux &
  (AddAccNavigationProps | AddAccFromWalletNavigationProps)) => {
  const [account, setAccount] = useState('');
  const [key, setKey] = useState('');
  const [allowAddByAuth, setAllowAddByAuth] = useState(
    route.params ? route.params.wallet : false,
  );

  useLockedPortrait(navigation);

  const onImportKeys = async () => {
    if (account.trim().length === 0 || key.trim().length === 0)
      return SimpleToast.show(
        translate('toast.error_missing_fields'),
        SimpleToast.LONG,
      );
    try {
      const keys = await validateNewAccount(account, key);

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
  const {theme} = useContext(ThemeContext);
  const {height} = useWindowDimensions();
  const styles = getStyles(theme);

  return (
    <Background using_new_ui theme={theme}>
      <View style={styles.flex}>
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
              additionalContainerStyle={styles.marginTop}
            />
            <Separator height={height / 15} />
            <Text
              style={[
                styles.text,
                styles.opacity,
                styles.paddingHorizontal,
                styles.centeredText,
              ]}>
              {capitalizeSentence(translate('addAccountByKey.text'))}
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
              labelInput={translate('common.privateKey')}
              placeholder={translate('common.privateKey')}
              value={key}
              onChangeText={setKey}
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
              title={translate('common.import')}
              onPress={onImportKeys}
              style={[getButtonStyle(theme).warningStyleButton]}
              additionalTextStyle={{...button_link_primary_medium}}
            />
            <Separator height={height / 22} />
            {allowAddByAuth && (
              <TouchableOpacity
                onPress={() => navigate('AddAccountFromWalletScreenByAuth')}>
                <Text style={[styles.text, styles.textUnderlined]}>
                  {capitalizeSentence(
                    translate('common.use_authorized_account_instead'),
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {flex: 1},
    container: {alignItems: 'center', justifyContent: 'space-between', flex: 1},
    text: {color: getColors(theme).secondaryText, ...body_primary_body_1},
    topContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    smallerText: {
      fontSize: 13,
    },
    textUnderlined: {
      textDecorationLine: 'underline',
    },
    opacity: {
      opacity: 0.7,
    },
    paddingHorizontal: {
      paddingHorizontal: 40,
    },
    centeredText: {textAlign: 'center'},
    bottomContainer: {
      marginBottom: 15,
      width: '100%',
      alignItems: 'center',
    },
    marginTop: {marginTop: 25},
  });

const mapStateToProps = (state: RootState) => {
  return state;
};

const connector = connect(mapStateToProps, {addAccount, showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByKey);
