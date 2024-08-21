import {addAccount} from 'actions/index';
import {showModal} from 'actions/message';
import TitleLogoLight from 'assets/new_UI/img_import_dark.svg';
import TitleLogoDark from 'assets/new_UI/img_import_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import CustomIconButton from 'components/ui/CustomIconButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {AddAccFromWalletNavigation} from 'navigators/mainDrawerStacks/AddAccount.types';
import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import validateNewAccount from 'utils/keyValidation';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AddAccountByKey = ({
  addAccount,
  navigation,
  route,
  showModal,
}: PropsFromRedux & {navigation: any; route: any}) => {
  const [account, setAccount] = useState('');
  const [key, setKey] = useState('');
  const [allowAddByAuth, setAllowAddByAuth] = useState(
    route.params ? route.params.wallet : false,
  );
  const [loadingImportAccount, setLoadingImportAccount] = useState(false);

  useLockedPortrait(navigation);

  const onImportKeys = async () => {
    if (account.trim().length === 0 || key.trim().length === 0)
      return SimpleToast.show(
        translate('toast.error_missing_fields'),
        SimpleToast.LONG,
      );
    const accountName = account.toLowerCase().trim();
    try {
      setLoadingImportAccount(true);
      const keys = await validateNewAccount(accountName, key.trim());

      if (keys) {
        const wallet = route.params ? route.params.wallet : false;
        addAccount(accountName, keys, wallet, false);
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
    } finally {
      setLoadingImportAccount(false);
    }
  };
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();

  const styles = getStyles(theme, {width, height});

  return (
    <Background theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        <FocusAwareStatusBar
          backgroundColor={getColors(theme).primaryBackground}
          barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
        />
        <CustomIconButton
          lightThemeIcon={<TitleLogoLight />}
          darkThemeIcon={<TitleLogoDark />}
          onPress={() => {}}
          theme={theme}
          additionalContainerStyle={styles.marginTop}
        />
        <Separator height={height / 22} />
        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.paddingHorizontal,
            styles.centeredText,
          ]}>
          {translate('addAccountByKey.text')}
        </Text>
        <Separator height={height / 22} />
        <OperationInput
          autoCapitalize={'none'}
          labelInput={translate('common.username')}
          placeholder={translate('common.username')}
          value={account}
          onChangeText={(textValue) => setAccount(textValue.toLowerCase())}
        />
        <Separator height={height / 22} />

        <OperationInput
          labelInput={translate('common.privateKey')}
          placeholder={translate('common.privateKey')}
          value={key}
          onChangeText={setKey}
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
        <View style={styles.bottomContainer}>
          <EllipticButton
            title={translate('common.import')}
            onPress={onImportKeys}
            additionalTextStyle={styles.buttonText}
            isWarningButton
            isLoading={loadingImportAccount}
          />
          <Separator height={height / 22} />
          {allowAddByAuth && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigate('AddAccountFromWalletScreenByAuth')}>
              <Text style={[styles.text, styles.textUnderlined]}>
                {translate('common.use_authorized_account_instead')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
      fontSize: getFontSizeSmallDevices(width, 16),
    },
    container: {
      width: '100%',
      alignItems: 'center',
      flexGrow: 1,
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
      paddingHorizontal: 20,
    },
    centeredText: {textAlign: 'center'},
    bottomContainer: {
      marginBottom: 10,
      width: '100%',
      alignItems: 'center',
      minHeight: height / 5,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    marginTop: {marginTop: 25},
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
  });

const mapStateToProps = (state: RootState) => {
  return state;
};

const connector = connect(mapStateToProps, {addAccount, showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByKey);
