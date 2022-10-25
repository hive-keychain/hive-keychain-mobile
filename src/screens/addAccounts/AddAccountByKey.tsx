import {addAccount} from 'actions/index';
import KeyLogo from 'assets/addAccount/icon_key.svg';
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
import validateNewAccount from 'utils/keyValidation';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const AddAccountByKey = ({
  addAccount,
  navigation,
  route,
}: PropsFromRedux &
  (AddAccNavigationProps | AddAccFromWalletNavigationProps)) => {
  const [account, setAccount] = useState('');
  const [key, setKey] = useState('');
  const [allowAddByAuth, setAllowAddByAuth] = useState(
    route.params ? route.params.wallet : false,
  );

  useLockedPortrait(navigation);

  const onImportKeys = async () => {
    try {
      const keys = await validateNewAccount(account, key);

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
          <Text style={styles.text}>{translate('addAccountByKey.text')}</Text>
          <Separator height={height / 15} />
          <CustomInput
            placeholder={translate('common.username').toUpperCase()}
            leftIcon={<UserLogo />}
            autoCapitalize="none"
            value={account}
            onChangeText={setAccount}
          />
          <Separator height={height / 15} />

          <CustomInput
            placeholder={translate('common.privateKey').toUpperCase()}
            autoCapitalize="characters"
            leftIcon={<KeyLogo />}
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
            value={key}
            onChangeText={setKey}
          />
          <Separator height={height / 7.5} />
          <Button
            title={translate('common.import').toUpperCase()}
            onPress={onImportKeys}
          />
          <Separator height={height / 22} />
          {allowAddByAuth && (
            <Button
              onPress={() => navigate('AddAccountFromWalletScreenByAuth')}
              title="Use Authorized Account instead"
            />
          )}
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
  return state;
};

const connector = connect(mapStateToProps, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByKey);
