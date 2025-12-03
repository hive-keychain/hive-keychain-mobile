import {StackScreenProps} from '@react-navigation/stack';
import {addAccount} from 'actions/accounts';
import {showModal} from 'actions/message';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import {ModalScreenProps} from 'navigators/Root.types';
import {SignupStackParamList} from 'navigators/Signup.types';
import React, {useEffect} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import QRCode from 'react-qr-code';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  button_link_primary_medium,
  headlines_primary_headline_1,
} from 'src/styles/typography';
import AccountUtils from 'utils/account.utils';
import {translate} from 'utils/localize';
import {goBack, navigate, resetStackAndNavigate} from 'utils/navigation.utils';

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

  const showConfirmationModal = () => {
    navigate('ModalScreen', {
      name: 'ConfirmGoBack',
      modalContent: (
        <ConfirmationModalContent
          onConfirm={() => {
            goBack();
            setTimeout(() => {
              resetStackAndNavigate('ChooseAccountOptionsScreen');
            }, 100);
          }}
          onCancel={() => {
            goBack();
          }}
        />
      ),
      modalContainerStyle: [getModalBaseStyle(theme).roundedTop],
      fixedHeight: 0.35,
      onForceCloseModal: () => {
        goBack();
      },
    } as ModalScreenProps);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          name={Icons.ARROW_LEFT}
          theme={theme}
          additionalContainerStyle={[{marginLeft: 16}]}
          onPress={showConfirmationModal}
          color={getColors(theme).iconBW}
        />
      ),
    });
  }, [navigation, theme]);

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

type ConfirmationModalContentProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModalContent = ({
  onConfirm,
  onCancel,
}: ConfirmationModalContentProps) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getConfirmationStyles(theme);

  return (
    <SafeArea skipTop style={styles.container}>
      <Text style={styles.title}>
        {translate('components.create_account.confirm_go_back')}
      </Text>
      <Caption text="components.create_account.confirm_go_back_text" />
      <View style={styles.buttonContainer}>
        <EllipticButton
          title={translate('common.cancel')}
          onPress={onCancel}
          style={[getButtonStyle(theme, width).secondaryButton, styles.button]}
          additionalTextStyle={{...button_link_primary_medium}}
        />
        <EllipticButton
          title={translate('common.confirm')}
          onPress={onConfirm}
          style={[
            getButtonStyle(theme, width).warningStyleButton,
            styles.button,
          ]}
          isWarningButton
          additionalTextStyle={{...button_link_primary_medium}}
        />
      </View>
    </SafeArea>
  );
};

const getConfirmationStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      marginBottom: initialWindowMetrics.insets.bottom,
    },
    title: {
      color: getColors(theme).primaryText,
      ...headlines_primary_headline_1,
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
    },
  });

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
