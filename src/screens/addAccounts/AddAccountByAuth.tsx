import {addAccount} from 'actions/index';
import QRLogo from 'assets/addAccount/icon_scan-qr.svg';
import UserLogo from 'assets/addAccount/icon_username.svg';
import TitleLogo from 'assets/addAccount/img_import.svg';
import CustomInput from 'components/form/CustomInput';
import Button from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {
  AddAccFromWalletNavigation,
  AddAccFromWalletNavigationProps,
} from 'navigators/mainDrawerStacks/AddAccount.types';
import {AddAccNavigationProps} from 'navigators/Signup.types';
import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {translate} from 'utils/localize';

const AddAccountByAuth = ({
  addAccount,
  localAccounts,
  navigation,
  route,
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
      } else {
        Toast.show(translate('toast.error_add_account'), Toast.LONG);
      }
    } catch (e) {
      Toast.show((e as any).message || e, Toast.LONG);
    }
  };

  const {height} = useWindowDimensions();

  return (
    <Background>
      <>
        <StatusBar backgroundColor="black" />
        <View style={styles.container}>
          <Separator height={height / 7.5} />
          <TitleLogo />
          <Separator height={height / 15} />
          <Text style={styles.text}>{translate('addAccountByAuth.text')}</Text>
          <Separator height={height / 15} />
          <CustomInput
            autoCapitalize="none"
            placeholder={translate('common.username').toUpperCase()}
            leftIcon={<UserLogo />}
            value={account}
            onChangeText={setAccount}
          />
          <Separator height={height / 15} />
          <CustomInput
            placeholder={translate('common.authorized_username').toUpperCase()}
            leftIcon={<UserLogo />}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  (navigation as AddAccFromWalletNavigation).navigate(
                    'ScanQRScreen',
                    {wallet: true},
                  );
                }}>
                <QRLogo />
              </TouchableOpacity>
            }
            autoCapitalize="none"
            value={authorizedAccount}
            onChangeText={setAuthorizedAccount}
          />
          <Separator height={height / 7.5} />
          <Button
            title={translate('common.import').toUpperCase()}
            onPress={onImportKeysByAuth}
          />
        </View>
      </>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  text: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByAuth);
