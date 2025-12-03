import {StackScreenProps} from '@react-navigation/stack';
import {addAccount} from 'actions/accounts';
import {showModal} from 'actions/message';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import {SignupStackParamList} from 'navigators/Signup.types';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import QRCode from 'react-qr-code';
import {connect, ConnectedProps} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enum';
import AccountUtils from 'utils/account.utils';
import {navigate} from 'utils/navigation.utils';

type Props = StackScreenProps<
  SignupStackParamList,
  'CreateAccountPeerToPeerQrScreen'
> &
  PropsFromRedux;
const CreateAccountPeerToPeerQr = ({
  route,
  navigation,
  addAccount,
  showModal,
}: Props) => {
  const {theme} = useThemeContext();
  const {accountName, keys, qrData} = route.params;

  const handleLoadNewAccount = () => {
    addAccount(accountName, keys, true, false);
    showModal(
      'wallet.operations.create_account.peer_to_peer.account_sucessfully_created',
      MessageModalType.SUCCESS,
      {
        accountName,
      },
    );
    navigate('Wallet');
  };

  useEffect(() => {
    if (qrData) {
      const interval = setInterval(async () => {
        if (await AccountUtils.doesAccountExist(accountName)) {
          handleLoadNewAccount();
          return;
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [qrData]);

  return (
    <Background
      theme={theme}
      skipBottom
      additionalBgSvgImageStyle={{
        bottom: -initialWindowMetrics.insets.bottom,
      }}>
      <View style={styles.containerQrPage}>
        <FocusAwareStatusBar />
        <View style={styles.qrContainer}>
          <View style={{paddingHorizontal: 18, marginBottom: 8}}>
            <Caption text="components.create_account.peer_to_peer_waiting_text" />
          </View>
          <View style={styles.qrCodeImg}>
            <QRCode
              size={240}
              style={{backgroundColor: 'white'}}
              value={qrData}
            />
          </View>
        </View>
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  qrCodeImg: {
    backgroundColor: 'white',
    width: 'auto',
    height: 'auto',
    padding: 30,
    borderRadius: 12,
  },
  containerQrPage: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});
const connector = connect(undefined, {addAccount, showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(CreateAccountPeerToPeerQr);
